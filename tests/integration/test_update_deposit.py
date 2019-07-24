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

from cap.modules.schemas.models import Schema
from cap.modules.schemas.resolvers import schema_name_to_url
from conftest import add_role_to_user
from invenio_search import current_search
from pytest import mark


# #######################################
# # api/deposits/{pid}  [PUT]
# #######################################


def test_update_deposit_with_non_existing_pid_returns_404(app,
                                                          auth_headers_for_superuser):
    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format('non-existing-pid'),
                          headers=auth_headers_for_superuser,
                          data=json.dumps({}))

        assert resp.status_code == 404


def test_update_deposit_when_user_has_no_permission_returns_403(app,
                                                                users,
                                                                create_deposit,
                                                                json_headers,
                                                                auth_headers_for_user):
    deposit = create_deposit(users['lhcb_user'], 'lhcb')
    other_user_headers = auth_headers_for_user(users['lhcb_user2'])

    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=other_user_headers + json_headers,
                          data=json.dumps({}))

        assert resp.status_code == 403


def test_update_deposit_when_user_is_owner_can_update_his_deposit(app,
                                                                  users,
                                                                  create_deposit,
                                                                  json_headers,
                                                                  auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb')

    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(owner) + json_headers,
                          data=json.dumps({}))

        assert resp.status_code == 200


def test_update_deposit_when_superuser_can_update_others_deposits(app,
                                                                  users,
                                                                  create_deposit,
                                                                  json_headers,
                                                                  auth_headers_for_superuser):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb')

    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_superuser + json_headers,
                          data=json.dumps({}))

        assert resp.status_code == 200


@mark.parametrize("action", [
    ("deposit-update"),
    ("deposit-admin")
])
def test_update_deposit_when_user_has_update_or_admin_access_can_update(action,
                                                                        app, db, users,
                                                                        create_deposit,
                                                                        json_headers,
                                                                        auth_headers_for_user):
    owner, other_user = users['lhcb_user'], users['cms_user']
    deposit = create_deposit(owner, 'lhcb')

    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(
                              other_user) + json_headers,
                          data=json.dumps({}))

        assert resp.status_code == 403

        permissions = [{
            'email': other_user.email,
            'type': 'user',
            'op': 'add',
            'action': action
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=auth_headers_for_user(owner) + json_headers,
                           data=json.dumps(permissions))

        # sometimes ES needs refresh
        current_search.flush_and_refresh('deposits')

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(
                              other_user) + json_headers,
                          data=json.dumps({}))

        assert resp.status_code == 200


def test_update_deposit_when_user_has_only_read_access_returns_403(app, db, users,
                                                                   create_deposit,
                                                                   json_headers,
                                                                   auth_headers_for_user):
    owner, other_user = users['lhcb_user'], users['cms_user']
    deposit = create_deposit(owner, 'lhcb')

    with app.test_client() as client:
        permissions = [{
            'email': other_user.email,
            'type': 'user',
            'op': 'add',
            'action': 'deposit-read'
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=auth_headers_for_user(owner) + json_headers,
                           data=json.dumps(permissions))

        # sometimes ES needs refresh
        current_search.flush_and_refresh('deposits')

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(
                              other_user) + json_headers,
                          data=json.dumps({}))

        assert resp.status_code == 403


@mark.parametrize("action", [
    ("deposit-update"),
    ("deposit-admin")
])
def test_update_deposit_when_user_is_member_of_egroup_that_has_update_or_admin_access_he_can_update(action,
                                                                                                    app, db, users,
                                                                                                    create_deposit,
                                                                                                    json_headers,
                                                                                                    auth_headers_for_user):
    owner, other_user = users['lhcb_user'], users['cms_user']
    add_role_to_user(other_user, 'some-egroup@cern.ch')
    deposit = create_deposit(owner, 'lhcb')

    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(
                              other_user) + json_headers,
                          data=json.dumps({}))

        assert resp.status_code == 403

        permissions = [{
            'email': 'some-egroup@cern.ch',
            'type': 'egroup',
            'op': 'add',
            'action': action
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=auth_headers_for_user(owner) + json_headers,
                           data=json.dumps(permissions))

        assert resp.status_code == 201

        # sometimes ES needs refresh
        current_search.flush_and_refresh('deposits')

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(
                              other_user) + json_headers,
                          data=json.dumps({}))

        assert resp.status_code == 200


def test_update_deposit_when_user_is_member_of_egroup_that_has_only_read_access_returns_403(app, db, users,
                                                                                            create_deposit,
                                                                                            json_headers,
                                                                                            auth_headers_for_user):
    owner, other_user = users['lhcb_user'], users['cms_user']
    add_role_to_user(other_user, 'some-egroup@cern.ch')
    deposit = create_deposit(owner, 'lhcb')

    with app.test_client() as client:
        permissions = [{
            'email': 'some-egroup@cern.ch',
            'type': 'egroup',
            'op': 'add',
            'action': 'deposit-read'
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=auth_headers_for_user(owner) + json_headers,
                           data=json.dumps(permissions))

        # sometimes ES needs refresh
        current_search.flush_and_refresh('deposits')

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(
                              other_user) + json_headers,
                          data=json.dumps({}))

        assert resp.status_code == 403


def test_update_deposit_cannot_update_schema_field(app, db, users,
                                                   create_deposit,
                                                   create_schema,
                                                   json_headers,
                                                   auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb', experiment='LHCb')
    schema = create_schema('another-schema',
                           experiment='LHCb')
    schema_url = schema_name_to_url('lhcb')

    deposit_schema = deposit.get("$schema", None)
    assert deposit_schema is not None

    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(owner) + json_headers,
                          data=json.dumps({}))

        resp_schema = resp.json.get("metadata", {}).get("$schema", None)
        assert resp_schema == deposit_schema

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(owner) + json_headers,
                          data=json.dumps({"$schema": schema_url}))

        resp_schema = resp.json.get("metadata", {}).get("$schema", None)
        assert resp_schema == deposit_schema

        assert resp.status_code == 200


def test_update_deposit_cannot_update_access_field(app, db, users,
                                                   create_deposit,
                                                   create_schema,
                                                   json_headers,
                                                   auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb', experiment='LHCb')
    schema = create_schema('another-schema',
                           experiment='LHCb')

    deposit_access = deposit.get("_access", None)
    assert deposit_access is not None

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(owner) + json_headers,
                          data=json.dumps({}))

        resp_access = resp.json.get("access", None)

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(owner) + json_headers,
                          data=json.dumps({}))

        updated_resp_data = resp.json.get("access", None)
        assert updated_resp_data == resp_access

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(owner) + json_headers,
                          data=json.dumps({"_access": []}))

        assert resp.status_code == 200


def test_patch_deposit(app, db, users,
                       create_deposit,
                       create_schema,
                       json_headers,
                       auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb', experiment='LHCb')

    with app.test_client() as client:
        resp = client.patch('/deposits/{}'.format(deposit['_deposit']['id']),
                            headers=auth_headers_for_user(owner) + [
            ('Content-Type', 'application/json-patch+json'),
            ('Accept', 'application/json')],
            data=json.dumps([
                {
                    "op": "replace",
                    "path": "/general_title",
                    "value": "Gen Test"
                }
            ]))

        assert resp.status_code == 400

        resp = client.patch('/deposits/{}'.format(deposit['_deposit']['id']),
                            headers=auth_headers_for_user(owner) + [
            ('Content-Type', 'application/json-patch+json'),
            ('Accept', 'application/json')],
            data=json.dumps([
                {
                    "op": "add",
                    "path": "/general_title",
                    "value": "Gen Test"
                },
                {"op": "add",
                 "path": "/basic_info",
                 "value": {"conclusion": "Updated path"}
                 }
            ]))

        assert resp.status_code == 200
        assert resp.json.get("metadata", {}).get(
            "general_title", None) == "Gen Test"

        resp = client.patch('/deposits/{}'.format(deposit['_deposit']['id']),
                            headers=auth_headers_for_user(owner) + [
            ('Content-Type', 'application/json-patch+json'),
            ('Accept', 'application/json')],
            data=json.dumps([
                {
                    "op": "replace",
                    "path": "/general_title",
                    "value": "Gen 8"
                }
            ]))

        assert resp.status_code == 200
        assert resp.json.get("metadata", {}).get(
            "general_title", None) == "Gen 8"


def test_patch_deposit_passing__files_field(app, db, users,
                                            create_deposit,
                                            create_schema,
                                            json_headers,
                                            auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb-v0.0.1', experiment='LHCb')

    with app.test_client() as client:
        resp = client.patch('/deposits/{}'.format(deposit['_deposit']['id']),
                            headers=auth_headers_for_user(owner) + [
            ('Content-Type', 'application/json-patch+json'),
            ('Accept', 'application/json')],
            data=json.dumps([
                {
                    "op": "add",
                    "path": "/_files",
                    "value": "Gen Test"
                }
            ]))

        assert resp.status_code == 200


def test_put_deposit_passing__files_field(app, db, users,
                                          create_deposit,
                                          create_schema,
                                          json_headers,
                                          auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb-v0.0.1', experiment='LHCb')

    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(owner) + json_headers,
                          data=json.dumps({"_files": "Gen Test"}))

        assert resp.status_code == 200


def test_put_deposit_passing__experiment_field(app, db, users,
                                               create_deposit,
                                               create_schema,
                                               json_headers,
                                               auth_headers_for_user):

    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb-v0.0.1', experiment='LHCb')

    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_user(owner) + json_headers,
                          data=json.dumps({"_experiment": "LHCb2"}))

        assert resp.status_code == 200

        resp_experiment = resp.json.get(
            "metadata", {}).get("_experiment", None)
        assert resp_experiment == "LHCb"


def test_patch_deposit_passing__experiment_field(app, db, users,
                                                 create_deposit,
                                                 create_schema,
                                                 json_headers,
                                                 auth_headers_for_user):

    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb-v0.0.1', experiment='LHCb')

    with app.test_client() as client:
        resp = client.patch('/deposits/{}'.format(deposit['_deposit']['id']),
                            headers=auth_headers_for_user(owner) + [
            ('Content-Type', 'application/json-patch+json'),
            ('Accept', 'application/json')],
            data=json.dumps([
                {
                    "op": "add",
                    "path": "/_experiment",
                    "value": "wrong_experiment"
                }
            ]))

        assert resp.status_code == 200

        resp_experiment = resp.json.get(
            "metadata", {}).get("_experiment", None)
        assert resp_experiment == "LHCb"


#@TODO add tests to check if put validates properly
