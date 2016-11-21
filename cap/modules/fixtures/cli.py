# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
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

import json
import os

from functools import partial
from pprint import pprint

import click
import pkg_resources

from flask import current_app
from flask_cli import with_appcontext
from invenio_access.models import ActionUsers
from invenio_access.permissions import ParameterizedActionNeed
from invenio_collections.models import Collection
from invenio_db import db
from invenio_files_rest.models import Bucket, Location, ObjectVersion
from invenio_indexer.utils import RecordIndexer

from cap.modules.records.views import construct_record
from cap.modules.records.permissions import (RecordReadActionNeed,
                                             RecordUpdateActionNeed,)
from invenio_records_files.api import Record, RecordsBuckets
from jsonschema.exceptions import ValidationError

from .pages import loadpages

RecordIndexActionNeed = partial(ParameterizedActionNeed, 'records-index')


try:
    from urlparse import urljoin
except ImportError:
    from urllib.parse import urljoin


@click.group()
def fixtures():
    """Create demo records."""


@fixtures.command()
@with_appcontext
def init():
    """Load basic data."""
    loadpages()


@fixtures.command('loadpages')
@click.option('--force', '-f', is_flag=True, default=False)
@with_appcontext
def loadpages_cli(force):
    """Load pages."""
    loadpages(force=force)
    click.secho('Created pages', fg='green')


@fixtures.command()
@click.option('--source', '-s', default=False)
@click.option('--force', '-f', is_flag=True, default=False)
@with_appcontext
def records(source, force):
    if not source:
        source = pkg_resources.resource_filename(
            'cap.modules.fixtures', 'data/records.json'
        )

    with open(source) as json_r:
        data = json.load(json_r)

    for d in data:
        add_record(
            d.get("metadata", None),
            d.get("collection", None),
            d.get("schema", None),
            force)


@fixtures.command()
@click.option('--source', '-s', default=False)
@click.option('--force', '-f', is_flag=True, default=False)
@with_appcontext
def records_files(source, force):
    if not source:
        source = pkg_resources.resource_filename(
            'cap.modules.fixtures', 'data/records_files.json'
        )

    with open(source) as json_r:
        data = json.load(json_r)

    for d in data:
        add_record(
            d.get("metadata", None),
            d.get("collection", None),
            d.get("schema", None),
            force,
            d.get("files", []))

    db.session.commit()


def add_record(metadata, collection, schema, force, files=[]):
    """Add record."""

    collection = Collection.query.filter(
        Collection.name == collection).first()

    if collection is None:
        return

    data, pid, recid = construct_record(
        collection, metadata, 1, {} if force else schema)
    d = current_app.config['DATADIR']

    buckets = []
    data['_files'] = []

    for file in files:
        bucket = Bucket.create(default_location=Location.get_default())
        buckets.append(bucket)

        with open(pkg_resources.resource_filename(
                'cap.modules.fixtures', os.path.join('data', 'files', file)
        ), 'rb') as fp:
            obj = ObjectVersion.create(bucket, file, stream=fp)

            data['_files'].append({
                'bucket': str(obj.bucket_id),
                'key': obj.key,
                'size': obj.file.size,
                'checksum': str(obj.file.checksum),
                'version_id': str(obj.version_id),
            })
    try:
        record = Record.create(data, id_=recid)

        for bucket in buckets:
            rb = RecordsBuckets(record_id=record.id, bucket_id=bucket.id)
            db.session.add(rb)

        # Invenio-Indexer is delegating the document inferring to
        # Invenio-Search which is analysing the string splitting by `/` and
        # using `.json` to be sure that it cans understand the mapping.
        record['$schema'] = 'mappings/{0}.json'.format(collection.name.lower())

        indexer = RecordIndexer()
        indexer.index(record)

        # Creating permission needs for the record
        action_edit_record = RecordUpdateActionNeed(str(recid))
        action_read_record = RecordReadActionNeed(str(recid))
        action_index_record = RecordIndexActionNeed(str(recid))

        # Giving index, read, write permissions to user/creator
        db.session.add(ActionUsers.allow(action_edit_record))
        db.session.add(ActionUsers.allow(action_read_record))
        db.session.add(ActionUsers.allow(action_index_record))

        db.session.commit()

        print("DONE!!!")

    except ValidationError as error:
        print("============================")
        pprint(error.message)
        pprint(error.path)
        print("============================")

        db.session.rollback()
