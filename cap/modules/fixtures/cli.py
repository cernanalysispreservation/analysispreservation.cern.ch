import json
from functools import partial
from pprint import pprint

import click
import pkg_resources
from flask import current_app
from flask_cli import with_appcontext
from invenio_access.models import ActionRoles, ActionUsers
from invenio_access.permissions import ParameterizedActionNeed
from invenio_accounts.models import Role, User
from invenio_collections.models import Collection
from invenio_db import db
from invenio_indexer.utils import RecordIndexer
from invenio_records import Record
from invenio_records.permissions import (RecordReadActionNeed,
                                         RecordUpdateActionNeed,
                                         read_permission_factory,
                                         update_permission_factory)
from jsonschema.exceptions import ValidationError

from cap.config import JSON_METADATA_PATH
from cap.modules.records.views import construct_record

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


def add_record(metadata, collection, schema, force):
    """Add record."""

    collection = Collection.query.filter(
        Collection.name == collection).first()

    if collection is None:
        return

    data, pid, recid = construct_record(
        collection, metadata, 1, {} if force else schema)

    try:
        record = Record.create(data, id_=recid)
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
