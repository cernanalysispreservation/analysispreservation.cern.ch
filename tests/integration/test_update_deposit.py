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
from pytest import mark

from cap.modules.schemas.models import Schema
from cap.modules.schemas.resolvers import schema_name_to_url
from conftest import add_role_to_user

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
        'revision': 2,
        'schema': {
            'name': 'lhcb',
            'version': '1.0.0'
        },
        'experiment': 'LHCb',
        'status': 'draft',
        'created_by': owner.email,
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {},
        'files': [],
        'access': {
            'deposit-admin': {
                'roles': [],
                'users': [owner.email]
            },
            'deposit-update': {
                'roles': [],
                'users': [owner.email]
            },
            'deposit-read': {
                'roles': [],
                'users': [owner.email]
            }
        },
        'is_owner': True,
        'links': {
            'bucket':
                'http://analysispreservation.cern.ch/api/files/{}'.format(
                    deposit.files.bucket),
            'clone':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/clone'
                .format(depid),
            'discard':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/discard'
                .format(depid),
            'edit':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/edit'
                .format(depid),
            'files':
                'http://analysispreservation.cern.ch/api/deposits/{}/files'.
                format(depid),
            'html':
                'http://analysispreservation.cern.ch/drafts/{}'.format(depid),
            'permissions':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/permissions'
                .format(depid),
            'publish':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/publish'
                .format(depid),
            'self':
                'http://analysispreservation.cern.ch/api/deposits/{}'.format(
                    depid),
            'upload':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/upload'
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
        'revision': 2,
        'schema': {
            'name': 'lhcb',
            'version': '1.0.0'
        },
        'experiment': 'LHCb',
        'status': 'draft',
        'created_by': owner.email,
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {},
        'files': [],
        'access': {
            'deposit-admin': {
                'roles': [],
                'users': [owner.email]
            },
            'deposit-update': {
                'roles': [],
                'users': [owner.email]
            },
            'deposit-read': {
                'roles': [],
                'users': [owner.email]
            }
        },
        'is_owner': True,
        'links': {
            'bucket':
                'http://analysispreservation.cern.ch/api/files/{}'.format(
                    deposit.files.bucket),
            'clone':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/clone'
                .format(depid),
            'discard':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/discard'
                .format(depid),
            'edit':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/edit'
                .format(depid),
            'files':
                'http://analysispreservation.cern.ch/api/deposits/{}/files'.
                format(depid),
            'html':
                'http://analysispreservation.cern.ch/drafts/{}'.format(depid),
            'permissions':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/permissions'
                .format(depid),
            'publish':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/publish'
                .format(depid),
            'self':
                'http://analysispreservation.cern.ch/api/deposits/{}'.format(
                    depid),
            'upload':
                'http://analysispreservation.cern.ch/api/deposits/{}/actions/upload'
                .format(depid)
        }
    }


# @TODO add tests to check if put validates properly
