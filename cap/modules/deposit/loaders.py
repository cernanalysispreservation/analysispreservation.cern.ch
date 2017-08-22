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

from celery import Task, current_app as celery_app

import jsonpointer
import requests

from cap.modules.deposit.api import CAPDeposit
from cap.modules.deposit.utils import clean_empty_values, parse_github_url
from flask import after_this_request, current_app, request
from invenio_db import db
from invenio_files_rest.models import (
    FileInstance, ObjectVersion, as_object_version)
from jsonschema.exceptions import ValidationError
from jsonschema.validators import Draft4Validator, extend
from operator import attrgetter
from werkzeug.utils import cached_property

from invenio_sse import current_sse
from celery.states import (FAILURE, STARTED, SUCCESS)


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
                if part is not None and part in data:
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


def sse_publish_event(channel, type_, state, meta):
    """Publish a message on SSE channel."""
    if channel:
        data = {'state': state, 'meta': meta}
        current_sse.publish(data=data, type_=type_, channel=channel)


class _Task(Task):
    abstract = True

    def _extract_call_arguments(self, arg_list, **kwargs):
        for name in arg_list:
            setattr(self, name, kwargs.pop(name, None))
        return kwargs

    def __call__(self, *args, **kwargs):
        """Extract SSE channel from keyword arguments.
        .. note ::
            the channel is extracted from the ``sse_channel`` keyword
            argument.
        """
        arg_list = ['sse_channel', 'event_id', 'deposit_id', 'key']
        kwargs = self._extract_call_arguments(arg_list, **kwargs)

        with self.app.flask_app.app_context():
            self.object = as_object_version(kwargs.pop('version_id', None))
            if self.object:
                self.obj_id = str(self.object.version_id)
            self.set_base_payload()
            return self.run(*args, **kwargs)

    def set_base_payload(self, payload=None):
        """Set default base payload."""
        self._base_payload = {
            'deposit_id': self.deposit_id,
            'event_id': self.event_id,
            'sse_channel': self.sse_channel,
            'type': self._type,
        }
        if self.object:
            self._base_payload.update(
                tags=self.object.get_tags(),
                version_id=str(self.object.version_id)
            )
        if payload:
            self._base_payload.update(**payload)

    def _meta_exception_envelope(self, exc):
        """Create a envelope for exceptions.
        NOTE: workaround to be able to save the payload in celery in case of
        exceptions.
        """
        meta = dict(message=str(exc), payload=self._base_payload)
        return dict(
            exc_message=meta,
            exc_type=exc.__class__.__name__
        )

    def update_state(self, task_id=None, state=None, meta=None):
        """Updates state depending on task status"""
        self._base_payload.update(meta.get('payload', {}))
        meta['payload'] = self._base_payload
        super(_Task, self).update_state(task_id, state, meta)
        sse_publish_event(channel=self.sse_channel, type_=self._type,
                          state=state, meta=meta)

    def on_success(self, exc, task_id, *args, **kwargs):
        """When end correctly, attach useful information to the state."""
        with celery_app.flask_app.app_context():
            meta = dict(message=str(exc), payload=self._base_payload)
            self.update_state(task_id=task_id, state=SUCCESS, meta=meta)

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """When an error occurs, attach useful information to the state."""
        with celery_app.flask_app.app_context():
            exception = self._meta_exception_envelope(exc=exc)
            self.update_state(task_id=task_id, state=FAILURE, meta=exception)


class DownloadTask(_Task):

    def __init__(self):
        """Init."""
        self._type = 'file_download'

    def run(self, url, recid=None, sse_channel=None, ** kwargs):
        """Create new file object and assign it to object version."""
        record = CAPDeposit.get_record(recid)
        if url.startswith("root://"):
            from xrootdpyfs.xrdfile import XRootDPyFile
            response = XRootDPyFile(url, mode='r-')
            headers_size = response.size
        else:
            parsed_url = url
            if url.startswith("https://github"):
                parsed_url = parse_github_url(url)
            response = requests.get(parsed_url, stream=True).raw
            headers_size = int(response.getheader('Content-Length'))

        def progress_updater(size, total):
            """Progress reporter."""
            size = size or headers_size
            if size is None:
                    # FIXME decide on proper error-handling behaviour
                raise RuntimeError('Cannot locate "Content-Length" header.')
            meta = dict(
                payload=dict(
                    size=size,
                    total=total,
                    percentage=total * 100 / size, ),
                message='Downloading {0} of {1}'.format(total, size), )

            self.update_state(state=STARTED, meta=meta)

        record.files[url].file.set_contents(
            response,
            default_location=record.files.bucket.location.uri,
            size=headers_size,
            progress_callback=progress_updater
        )
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
        pid, record = request.view_args.get('pid_value').data
        record_id = str(record.id)
        x_cap_files = extract_x_cap_files(data)
        urls = process_x_cap_files(record, x_cap_files)
        data['_files'] = record.files.dumps()
        for file in data['_files']:
            file['file_name'] = file['key'].split('/')[-1]

        @after_this_request
        def _preserve_files(response):
            for url in urls:
                DownloadTask().delay(
                    url,
                    recid=record_id,
                    sse_channel='/api/deposits/{}/sse'.format(pid.pid_value))
            return response

    result = clean_empty_values(data)
    return result
