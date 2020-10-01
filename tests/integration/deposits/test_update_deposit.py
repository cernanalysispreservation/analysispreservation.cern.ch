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
# or submit itself to any jurisdiction.
"""Integration tests for updating deposits."""

import json

from invenio_search import current_search
from invenio_access import ActionUsers

from invenio_records.api import RecordMetadata
from pytest import mark

from cap.modules.deposit.api import CAPDeposit

from cap.modules.schemas.models import Schema
from cap.modules.schemas.resolvers import schema_name_to_url
from conftest import add_role_to_user, _datastore, get_default_mapping

from flask import current_app
from werkzeug.local import LocalProxy


# #######################################
# # api/deposits/{pid}  [PUT]
# #######################################


def test_update_deposit_with_non_existing_pid_returns_404(
        client, auth_headers_for_superuser):
    resp = client.put('/deposits/{}'.format('non-existing-pid'),
                      headers=auth_headers_for_superuser,
                      data=json.dumps({}))

    assert resp.status_code == 404


def test_update_deposit_when_user_has_no_permission_returns_403(
        client, users, create_deposit, json_headers, auth_headers_for_user):
    deposit = create_deposit(users['lhcb_user'], 'lhcb')
    other_user_headers = auth_headers_for_user(users['lhcb_user2'])

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=other_user_headers + json_headers,
                      data=json.dumps({}))

    assert resp.status_code == 403


def test_update_deposit_when_user_is_owner_can_update_his_deposit(
        client, users, create_deposit, json_headers, auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb')

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(owner) + json_headers,
                      data=json.dumps({}))

    assert resp.status_code == 200


def test_update_deposit_when_superuser_can_update_others_deposits(
        client, users, create_deposit, json_headers,
        auth_headers_for_superuser):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb')

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_superuser + json_headers,
                      data=json.dumps({}))

    assert resp.status_code == 200


@mark.parametrize("action", [("deposit-update"), ("deposit-admin")])
def test_update_deposit_when_user_has_update_or_admin_access_can_update(
        action, client, db, users, create_deposit, json_headers,
        auth_headers_for_user):
    owner, other_user = users['lhcb_user'], users['cms_user']
    deposit = create_deposit(owner, 'lhcb')

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(other_user) + json_headers,
                      data=json.dumps({}))

    assert resp.status_code == 403

    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    deposit.edit_permissions(permissions)

    # sometimes ES needs refresh
    current_search.flush_and_refresh('deposits')

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(other_user) + json_headers,
                      data=json.dumps({}))

    assert resp.status_code == 200


def test_update_deposit_when_user_has_only_read_access_returns_403(
        client, db, users, create_deposit, json_headers,
        auth_headers_for_user):
    owner, other_user = users['lhcb_user'], users['cms_user']
    deposit = create_deposit(owner, 'lhcb')

    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-read'
    }]

    deposit.edit_permissions(permissions)

    # sometimes ES needs refresh
    current_search.flush_and_refresh('deposits')

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(other_user) + json_headers,
                      data=json.dumps({}))

    assert resp.status_code == 403


@mark.parametrize("action", [("deposit-update"), ("deposit-admin")])
def test_update_deposit_when_user_is_member_of_egroup_that_has_update_or_admin_access_he_can_update(
        action, client, db, users, create_deposit, json_headers,
        auth_headers_for_user):
    owner, other_user = users['lhcb_user'], users['cms_user']
    add_role_to_user(other_user, 'some-egroup@cern.ch')
    deposit = create_deposit(owner, 'lhcb')

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(other_user) + json_headers,
                      data=json.dumps({}))

    assert resp.status_code == 403

    permissions = [{
        'email': 'some-egroup@cern.ch',
        'type': 'egroup',
        'op': 'add',
        'action': action
    }]

    deposit.edit_permissions(permissions)

    # sometimes ES needs refresh
    current_search.flush_and_refresh('deposits')

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(other_user) + json_headers,
                      data=json.dumps({}))

    assert resp.status_code == 200


def test_update_deposit_when_user_is_member_of_egroup_that_has_only_read_access_returns_403(
        client, db, users, create_deposit, json_headers,
        auth_headers_for_user):
    owner, other_user = users['lhcb_user'], users['cms_user']
    add_role_to_user(other_user, 'some-egroup@cern.ch')
    deposit = create_deposit(owner, 'lhcb')

    permissions = [{
        'email': 'some-egroup@cern.ch',
        'type': 'egroup',
        'op': 'add',
        'action': 'deposit-read'
    }]

    deposit.edit_permissions(permissions)

    # sometimes ES needs refresh
    current_search.flush_and_refresh('deposits')

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(other_user) + json_headers,
                      data=json.dumps({}))

    assert resp.status_code == 403


def test_update_deposit_cannot_update_underscore_prefixed_files(
        client, db, users, create_deposit, create_schema, json_headers,
        auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb', experiment='LHCb')
    depid = deposit['_deposit']['id']
    schema = create_schema('another-schema', experiment='LHCb')
    metadata = deposit.get_record_metadata()

    resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(owner) + json_headers,
                      data=json.dumps({
                          "$schema": 'another_schema',
                          "_access": [],
                          "_files": [],
                          "_experiment": "ccc"
                      }))

    assert resp.json == {
        'id': depid,
        'type': 'deposit',
        'revision': 1,
        'schema': {
            'fullname': '',
            'name': 'lhcb',
            'version': '1.0.0'
        },
        'experiment': 'LHCb',
        'status': 'draft',
        'created_by': {'email': owner.email, 'profile': {}},
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'labels': [],
        'metadata': {},
        'files': [],
        'access': {
            'deposit-admin': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            },
            'deposit-update': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            },
            'deposit-read': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            }
        },
        'is_owner': True,
        'links': {
            'bucket': 'http://analysispreservation.cern.ch/api/files/{}'.
            format(deposit.files.bucket),
            'clone': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/clone'
            .format(depid),
            'discard': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/discard'
            .format(depid),
            'disconnect_webhook': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/disconnect_webhook'
            .format(depid),
            'edit': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/edit'
            .format(depid),
            'files': 'http://analysispreservation.cern.ch/api/deposits/{}/files'
            .format(depid),
            'html': 'http://analysispreservation.cern.ch/drafts/{}'.format(
                depid),
            'permissions': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/permissions'
            .format(depid),
            'publish': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/publish'
            .format(depid),
            'self': 'http://analysispreservation.cern.ch/api/deposits/{}'.
            format(depid),
            'upload': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/upload'
            .format(depid)
        }
    }

    assert resp.status_code == 200


def test_patch_deposit(client, db, users, create_deposit, create_schema,
                       json_headers, auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb', experiment='LHCb')

    resp = client.patch('/deposits/{}'.format(deposit['_deposit']['id']),
                        headers=auth_headers_for_user(owner) +
                        [('Content-Type', 'application/json-patch+json'),
                         ('Accept', 'application/json')],
                        data=json.dumps([{
                            "op": "replace",
                            "path": "/general_title",
                            "value": "Gen Test"
                        }]))

    assert resp.status_code == 400

    resp = client.patch('/deposits/{}'.format(deposit['_deposit']['id']),
                        headers=auth_headers_for_user(owner) +
                        [('Content-Type', 'application/json-patch+json'),
                         ('Accept', 'application/json')],
                        data=json.dumps([{
                            "op": "add",
                            "path": "/general_title",
                            "value": "Gen Test"
                        }, {
                            "op": "add",
                            "path": "/basic_info",
                            "value": {
                                "conclusion": "Updated path"
                            }
                        }]))

    assert resp.status_code == 200
    assert resp.json.get("metadata", {}).get("general_title",
                                             None) == "Gen Test"


def test_patch_deposit_cannot_update_underscore_prefixed_fields(
        client, db, users, create_deposit, create_schema, json_headers,
        auth_headers_for_user):

    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb', experiment='LHCb')
    depid = deposit['_deposit']['id']
    metadata = deposit.get_record_metadata()

    resp = client.patch('/deposits/{}'.format(deposit['_deposit']['id']),
                        headers=auth_headers_for_user(owner) +
                        [('Content-Type', 'application/json-patch+json'),
                         ('Accept', 'application/json')],
                        data=json.dumps([{
                            "op": "add",
                            "path": "/_experiment",
                            "value": "some-exp"
                        }, {
                            "op": "add",
                            "path": "/$schema",
                            "value": "some-schema"
                        }, {
                            "op": "add",
                            "path": "/_files",
                            "value": []
                        }]))

    assert resp.status_code == 200

    assert resp.json == {
        'id': depid,
        'type': 'deposit',
        'revision': 1,
        'schema': {
            'fullname': '',
            'name': 'lhcb',
            'version': '1.0.0'
        },
        'experiment': 'LHCb',
        'status': 'draft',
        'labels': [],
        'created_by': {'email': owner.email, 'profile': {}},
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {},
        'files': [],
        'access': {
            'deposit-admin': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            },
            'deposit-update': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            },
            'deposit-read': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            }
        },
        'is_owner': True,
        'links': {
            'bucket': 'http://analysispreservation.cern.ch/api/files/{}'.
            format(deposit.files.bucket),
            'clone': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/clone'
            .format(depid),
            'discard': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/discard'
            .format(depid),
            'disconnect_webhook': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/disconnect_webhook'
            .format(depid),
            'edit': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/edit'
            .format(depid),
            'files': 'http://analysispreservation.cern.ch/api/deposits/{}/files'
            .format(depid),
            'html': 'http://analysispreservation.cern.ch/drafts/{}'.format(
                depid),
            'permissions': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/permissions'
            .format(depid),
            'publish': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/publish'
            .format(depid),
            'self': 'http://analysispreservation.cern.ch/api/deposits/{}'.
            format(depid),
            'upload': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/upload'
            .format(depid)
        }
    }


def test_update_deposit_missing_required_field_validates_succesfully(
        client, db, users, create_deposit, create_schema, json_headers, auth_headers_for_user):
    owner = users['cms_user']
    headers = auth_headers_for_user(users['cms_user']) + json_headers
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {'type': 'string'},
                          'abstract': {'type': 'string'}
                      }
                  })

    deposit = create_deposit(owner, 'test-analysis',
                             {
                                 '$ana_type': 'test-analysis',
                                 'title': 'test',
                                 'abstract': 'test abstract'
                             },
                             experiment='CMS')
    depid = deposit['_deposit']['id']

    resp = client.put(f'/deposits/{depid}', headers=headers,
                      data=json.dumps({
                          'abstract': 'test'
                      }))

    assert resp.status_code == 200


def test_update_deposit_with_required_field_success(
        client, db, users, create_deposit, create_schema, json_headers, auth_headers_for_user):
    owner = users['cms_user']
    headers = auth_headers_for_user(users['cms_user']) + json_headers
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {'type': 'string'}
                      }
                  })

    deposit = create_deposit(owner, 'test-analysis',
                             {
                                 '$ana_type': 'test-analysis',
                                 'title': 'test'
                             },
                             experiment='CMS')

    depid = deposit['_deposit']['id']
    resp = client.put(f'/deposits/{depid}', headers=headers,
                      data=json.dumps({
                          'title': 'test1'
                      }))

    metadata = deposit.get_record_metadata()

    assert resp.status_code == 200
    assert resp.json == {
        'id': depid,
        'type': 'deposit',
        'revision': 1,
        'schema': {
            'fullname': '',
            'name': 'test-analysis',
            'version': '1.0.0'
        },
        'labels': [],
        'files': [],
        'experiment': 'CMS',
        'status': 'draft',
        'is_owner': True,
        'created_by': {'email': owner.email, 'profile': {}},
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {
            'title': 'test1'
        },
        'access': {
            'deposit-admin': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            },
            'deposit-update': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            },
            'deposit-read': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            }
        },
        'links': {
            'bucket': f'http://analysispreservation.cern.ch/api/files/{deposit.files.bucket}',
            'clone': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/clone',
            'discard': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/discard',
            'disconnect_webhook': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/disconnect_webhook',
            'edit': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/edit',
            'files': f'http://analysispreservation.cern.ch/api/deposits/{depid}/files',
            'html': f'http://analysispreservation.cern.ch/drafts/{depid}',
            'permissions': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/permissions',
            'publish': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/publish',
            'self': f'http://analysispreservation.cern.ch/api/deposits/{depid}',
            'upload': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/upload'
        }
    }

 
def test_schema_deposit_permissions(
        client, db, users, create_deposit, create_schema, json_headers, auth_headers_for_user, clean_schema_acceess_cache):
    schema_name = 'test-analysis'

    owner = users['cms_user']
    random_user = users['random']
    lhcb_user = users['lhcb_user']

    random_headers = auth_headers_for_user(users['random']) + json_headers
    lhcb_headers = auth_headers_for_user(users['lhcb_user']) + json_headers

    deposit_mapping = get_default_mapping(schema_name, "1.0.0")
    schema = create_schema(schema_name,
        experiment='CMS',
        deposit_schema={
            'type': 'object',
            'required': ['title'],
            'properties': {
                'title': {'type': 'string'}
            }
        },
        deposit_mapping=deposit_mapping)
    schema.process_action_users('allow', [("deposit-schema-create", "cms_user@cern.ch")])

    deposit = create_deposit(owner, schema_name,
                             {
                                 '$ana_type': schema_name,
                                 'title': 'test'
                             },
                             experiment='CMS')

    depid = deposit['_deposit']['id']

    resp = client.put(f'/deposits/{depid}', headers=random_headers,
                      data=json.dumps({
                          'title': 'test1'
                      }))

    assert resp.status_code == 403

    role = _datastore.find_or_create_role('cap-schema-admin@cern.ch')

    schema.process_action_roles('allow', [("deposit-schema-update", "cap-schema-admin@cern.ch")])

    resp = client.put(f'/deposits/{depid}', headers=random_headers,
                      data=json.dumps({
                          'title': 'test1'
                      }))

    assert resp.status_code == 403

    allowed_actions = current_app.extensions['invenio-access'].actions

    schema.process_action_users('allow',
                         [
                             ("deposit-schema-update", random_user.email),
                             ("deposit-schema-read", random_user.email)
                         ])

    resp = client.put(f'/deposits/{depid}', headers=random_headers,
                      data=json.dumps({
                          'title': 'test1'
                      }))

    assert resp.status_code == 200

    # Add role to user
    _datastore.add_role_to_user(lhcb_user, role)

    resp = client.put(f'/deposits/{depid}', headers=lhcb_headers,
                      data=json.dumps({
                          'title': 'test lhcb'
                      }))

    assert resp.status_code == 200

    # process_action_users('allow', 'test-analysis',
    #                      [('deposit-schema-read', random_user.email)])
    # fetch deposits from random - should get 1 result
    resp = client.get('/deposits', headers=random_headers)
    result_deposits = resp.json
    assert result_deposits.get("hits", {}).get("total") == 1

    # fetch deposits_groups from random - should have 0
    resp = client.get('/me', headers=random_headers)
    resp_deposit_groups = resp.json.get("deposit_groups", [])
    
    assert len(resp_deposit_groups) == 0

    # fetch deposits_groups from random - should have 'test-analysis'
    with db.session.begin_nested():
        db.session.add(
            ActionUsers.allow(
                allowed_actions["deposit-schema-create"],
                argument=schema.id,
                user_id=random_user.id
            )
        )

    resp = client.get('/me', headers=random_headers)
    resp_deposit_groups = resp.json.get("deposit_groups", [])
    
    assert resp_deposit_groups[0] == {
        'deposit_group': 'test-analysis',
        'name': None,
        'schema_path': 'deposits/records/test-analysis-v1.0.0.json'
    }

    random_headers = auth_headers_for_user(lhcb_user) + json_headers
    resp = client.get(f'/me', headers=random_headers)
    resp_deposit_groups = resp.json.get("deposit_groups", [])
    
    assert len(resp_deposit_groups) == 0

# @TODO add tests to check if put validates properly
