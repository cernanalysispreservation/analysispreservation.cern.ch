# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.


"""CAP Deposit loaders."""

from itertools import groupby

from celery import shared_task

import jsonpointer
import requests

from cap.modules.deposit.api import CAPDeposit
from flask import after_this_request, current_app, request
from invenio_db import db
from invenio_files_rest.models import FileInstance, ObjectVersion
from jsonschema.exceptions import ValidationError
from jsonschema.validators import Draft4Validator, extend
from operator import attrgetter
from werkzeug.utils import cached_property


class XCapFileValidationError(ValidationError):
    """Handle x-cap-file schema property."""

    @cached_property
    def condition(self):
        """Return condition value."""
        return jsonpointer.resolve_pointer(
            # TODO get default value from schema
            self.instance, self.validator_value['condition'], True
        )

    @cached_property
    def url(self):
        """Return condition value."""
        return jsonpointer.resolve_pointer(
            self.instance, self.validator_value['fetch_from'], None
        )

    @cached_property
    def file_key(self):
        """Return condition value."""
        return jsonpointer.resolve_pointer(
            self.instance, self.validator_value['file_key'], None
        )

    @cached_property
    def ref(self):
        """Return JSON pointer to the original source."""
        return jsonpointer.JsonPointer.from_parts(self.path).path

    def update_file_key(self, key):
        """Update file key if condition is valid."""
        if self.condition:
            jsonpointer.set_pointer(
                self.instance, self.validator_value['file_key'], key)
        else:
            data, part = jsonpointer.JsonPointer(
                self.validator_value['file_key']
            ).to_last(
                self.instance
            )
            if data:
                if part is not None:
                    del data[part]
                else:
                    del data


def x_cap_file(validator, config, instance, schema):
    """Extract file field configurations."""
    yield XCapFileValidationError('Found X-Cap-File')


XCapFileDraft4Validator = extend(Draft4Validator, validators={
    'x-cap-file': x_cap_file,
})


def extract_refs_from_errors(errors):
    """Return list with extracted references from errors."""
    return [error.ref for error in errors if error.condition]


def extract_x_cap_files(data):
    """Extract urls and references from data."""
    schema = data['$schema']

    if not isinstance(schema, dict):
        schema = {'$ref': schema}

    resolver = current_app.extensions[
        'invenio-records'].ref_resolver_cls.from_schema(schema)

    return [error for error in XCapFileDraft4Validator(
        schema, resolver=resolver
    ).iter_errors(data) if isinstance(error, XCapFileValidationError)]


@shared_task
def download_url(record_id, url):
    """Create new file object and assign it to object version."""
    record = CAPDeposit.get_record(record_id)
    r = requests.get(url, stream=True).raw
    r.decode_content = True
    record.files[url].file.set_contents(
        r,
        default_location=record.files.bucket.location.uri)
    db.session.commit()


def process_x_cap_files(record, x_cap_files):
    """Process files, update record."""
    result = []
    old_keys = set(record.files.keys)
    used_keys = set()

    # Download new files.
    urls = {error.url for error in x_cap_files if error.condition and error.url}
    for url in urls:
        if url not in record.files:
            result.append(url)

            obj = ObjectVersion.create(
                bucket=record.files.bucket, key=url
            )
            obj.file = FileInstance.create()
            record.files.flush()

            record.files[url]['source_url'] = url

    # Update file key for external URLs.
    for error in x_cap_files:
        if error.url:
            error.update_file_key(error.url)

    # Calculate references.
    keyfunc = attrgetter('file_key')
    for key, errors in groupby(sorted(x_cap_files, key=keyfunc), keyfunc):
        if key is None:
            continue

        refs = extract_refs_from_errors(errors)
        if refs:
            used_keys.add(key)
            record.files[key]['refs'] = refs

    for key in old_keys - used_keys:
        record.files[key]['refs'] = []

    return result


def json_v1_loader(data=None):
    """Load data from request and process URLs."""
    from copy import deepcopy
    data = deepcopy(data or request.json)

    if request and request.view_args.get('pid_value'):
        _, record = request.view_args.get('pid_value').data
        record_id = str(record.id)
        x_cap_files = extract_x_cap_files(data)
        urls = process_x_cap_files(record, x_cap_files)
        data['_files'] = record.files.dumps()
        for file in data['_files']:
            file['file_name'] = file['key'].split('/')[-1]

        @after_this_request
        def _preserve_files(response):
            for url in urls:
                download_url.delay(record_id, url)
            return response

    result = clean_empty_values(data)
    return result


def clean_empty_values(data):
    if not isinstance(data, (dict, list)):
        return data
    if isinstance(data, list):
        return [v for v in (clean_empty_values(v) for v in data) if v]
    return {k: v for k, v in ((k, clean_empty_values(v)) for k, v in data.items()) if v}
