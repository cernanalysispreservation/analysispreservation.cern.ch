import json

from flask import current_app

from cap.modules.deposit.api import (CAPDeposit, construct_access,
                                     set_egroup_permissions)
from elasticsearch import helpers
from invenio_accounts.models import Role
from invenio_db import db
from invenio_search.proxies import current_search_client as es


def construct_draft_obj(schema, data):
    schema = 'https://{}/schemas/deposits/records/{}.json'.format(
        current_app.config.get('JSONSCHEMAS_HOST'),
        schema)

    entry = {
        '$schema': schema,
    }

    entry.update(data)

    return entry


def add_read_permission_for_egroup(deposit, egroup):
    with db.session.begin_nested():
        role = Role.query.filter_by(name=egroup).one()
        permissions = [{
            'action': 'deposit-read',
            'identity': egroup,
            'op': 'add',
            'type': 'egroup'
        }]

        access = set_egroup_permissions(role, permissions, deposit,
                                        db.session, construct_access())
    db.session.commit()

    deposit['_access'] = access
    deposit.commit()


def add_drafts_from_file(file_path, schema, egroup, limit=None):
    with open(file_path, 'r') as fp:
        entries = json.load(fp)
        for entry in entries[0:limit]:
            deposit = CAPDeposit.create(construct_draft_obj(schema,
                                                            entry))
            add_read_permission_for_egroup(deposit, egroup)

            print('Draft {} added.'.format(deposit.id))


def bulk_index_from_source(index_name, doc_type, source):
    actions = [{
        "_index": index_name,
        "_type": doc_type, 
        "_id": idx,
        "_source": obj
    } for idx, obj in enumerate(source)]

    helpers.bulk(es, actions)
