from flask import current_app
from flask_cli import with_appcontext


from uuid import uuid4
import click
from functools import partial
import pkg_resources
import json




from invenio_access.models import ActionRoles, ActionUsers
from invenio_access.permissions import ParameterizedActionNeed
from invenio_accounts.models import User, Role
from invenio_collections.models import Collection
from invenio_db import db
from invenio_indexer.utils import RecordIndexer
from invenio_pidstore.providers.recordid import RecordIdProvider
from invenio_records import Record
from invenio_records.permissions import (RecordReadActionNeed,
                                         RecordUpdateActionNeed,
                                         read_permission_factory,
                                         update_permission_factory)
from jsonpatch import JsonPatchException, JsonPointerException
from cap.config import JSON_METADATA_PATH

RecordIndexActionNeed = partial(ParameterizedActionNeed, 'records-index')


try:
    from urlparse import urljoin
except ImportError:
    from urllib.parse import urljoin

@click.group()
def fixtures():
    """Create demo records."""


@fixtures.command()
@click.option('--source', '-s', default=False)
@with_appcontext
def records(source):
    if not source:
        source = pkg_resources.resource_filename(
            'cap.modules.fixtures', 'data/records.json'
        )

    with open(source) as json_r:
        data = json.load(json_r)

    for d in data:
        print(d)
        add_record(d["metadata"], d["collection"], d["schema"])


def add_record(metadata, collection, schema):
    """Add record."""

    # Creating a uuid4
    recid = uuid4()

    # Creating a PID for the record
    provider = RecordIdProvider.create(object_type='rec', object_uuid=recid)
    pid = provider.pid.pid_value

    data = dict()

    data['$schema'] = urljoin(
            current_app.config.get('JSONSCHEMAS_HOST'),
            '/jsonschemas/'+collection)
    data['pid_value'] = pid
    data['control_number'] = pid
    data['collections'] = [collection]
    data['creator'] = 1
    data['_metadata'] = metadata

    record = Record.create(data, id_=recid)

    # Invenio-Indexer is delegating the document inferring to
    # Invenio-Search which is analysing the string splitting by `/` and
    # using `.json` to be sure that it cans understand the mapping.
    record['$schema'] = 'mappings/{0}.json'.format(collection.lower())

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
