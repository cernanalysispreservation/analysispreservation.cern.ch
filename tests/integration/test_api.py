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

"""Unit tests Cap Deposit api."""

from __future__ import absolute_import, print_function

import json

import pytest
from uuid import uuid4
from flask_security import login_user
from invenio_search import current_search
from cap.modules.deposit.errors import WrongJSONSchemaError
from cap.modules.deposit.api import CAPDeposit as Deposit

from conftest import get_basic_json_serialized_deposit
from invenio_search import current_search
from invenio_records_rest.errors import JSONSchemaValidationError
from jsonschema.exceptions import ValidationError


#############
# EXAMPLE
#############
def test_example(app, users, auth_headers_for_user, json_headers):
    """ Example test to show how to set up tests for API calls."""
    with app.test_client() as client:
        auth_headers = auth_headers_for_user(users['superuser'])
        headers = auth_headers + json_headers

        resp = client.get('/ping', headers=headers)

        assert resp.status_code == 200
        assert "Pong" in resp.data


# # #################
# # # api/deposits/
# # #################
def test_get_deposits_when_user_not_logged_in_returns_403(app, users, json_headers):
    with app.test_client() as client:
        resp = client.get('/deposits/', headers=json_headers)

        assert resp.status_code == 403


def test_get_deposits_when_superuser_returns_all_deposits(app, users,
                                                          auth_headers_for_superuser,
                                                          create_deposit):
    with app.test_client() as client:
        deposits = [
            create_deposit(users['cms_user'], 'cms-analysis-v0.0.1'),
            create_deposit(users['cms_user2'], 'cms-questionnaire-v0.0.1'),
            create_deposit(users['cms_user'],
                           'cms-auxiliary-measurements-v0.0.1'),
            create_deposit(users['lhcb_user'], 'lhcb-v0.0.1'),
            create_deposit(users['alice_user'], 'alice-analysis-v0.0.1'),
            create_deposit(users['atlas_user'], 'atlas-analysis-v0.0.1'),
            create_deposit(users['atlas_user2'], 'atlas-workflows-v0.0.1'),
        ]

        resp = client.get('/deposits/', headers=auth_headers_for_superuser)
        hits = json.loads(resp.data)['hits']['hits']

        assert resp.status_code == 200
        assert len(hits) == len(deposits)


def test_get_deposits_when_normal_user_returns_only_his_deposits(app, db, users,
                                                                 auth_headers_for_user,
                                                                 json_headers,
                                                                 create_deposit
                                                                 ):
    with app.test_client() as client:
        user_deposits_ids = [x['_deposit']['id'] for x in [
            create_deposit(users['cms_user'], 'cms-analysis-v0.0.1'),
            create_deposit(users['cms_user'], 'cms-questionnaire-v0.0.1'),
            create_deposit(users['cms_user'],
                           'cms-auxiliary-measurements-v0.0.1'),
        ]]

        create_deposit(users['cms_user2'], 'cms-analysis-v0.0.1'),
        create_deposit(users['lhcb_user'], 'lhcb-v0.0.1'),
        create_deposit(users['alice_user'], 'alice-analysis-v0.0.1'),
        headers = auth_headers_for_user(users['cms_user']) + json_headers

        resp = client.get('/deposits/', headers=headers)

        hits = json.loads(resp.data)['hits']['hits']

        assert resp.status_code == 200
        assert len(hits) == 3
        for x in hits:
            assert x['metadata']['_deposit']['id'] in user_deposits_ids


def test_get_deposits_with_basic_json_serializer_returns_correct_fields_for_all_deposits(app,
                                                                                         users,
                                                                                         auth_headers_for_superuser,
                                                                                         create_deposit):
    deposits = [
        create_deposit(users['superuser'], 'cms-analysis-v0.0.1'),
        create_deposit(users['superuser'], 'cms-analysis-v0.0.1'),
    ]

    with app.test_client() as client:
        resp = client.get('/deposits/',
                          headers=[('Accept', 'application/basic+json')] +
                          auth_headers_for_superuser)

        hits = json.loads(resp.data)['hits']['hits']

        assert resp.status_code == 200
        assert len(hits) == len(deposits)
        for deposit in deposits:
            assert get_basic_json_serialized_deposit(
                deposit, 'cms-analysis-v0.0.1') in hits


def test_post_deposit_with_wrong_schema_returns_wrong_schema_error(app,
                                                                   users,
                                                                   location,
                                                                   get_jsonschemas_host):
    with app.test_request_context():
        metadata = {
            '$schema': 'https://{}/schemas/deposits/records/lhcb-wrong.json'.format(get_jsonschemas_host)}
        login_user(users['superuser'])
        id_ = uuid4()
        with pytest.raises(WrongJSONSchemaError):
            Deposit.create(metadata, id_=id_)


def test_post_deposit_with_wrong_data_returns_validation_error(app,
                                                               users,
                                                               location,
                                                               get_jsonschemas_host
                                                               ):
    with app.test_request_context():
        metadata = {
            '$schema': 'https://{}/schemas/deposits/records/lhcb-v0.0.1.json'.format(get_jsonschemas_host),
            'general_title': ['I am an array, not a string']
        }
        login_user(users['superuser'])
        id_ = uuid4()
        with pytest.raises(ValidationError):
            Deposit.create(metadata, id_=id_)


# # #######################
# # # api/deposits/{pid}
# # #######################
def test_get_deposits_with_given_id_superuser_can_see_deposits_created_by_others(app,
                                                                                 users,
                                                                                 auth_headers_for_superuser,
                                                                                 create_deposit):
    deposit = create_deposit(users['alice_user'], 'alice-analysis-v0.0.1')

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 200


def test_get_deposits_with_given_id_creator_can_see_his_deposit(app,
                                                                users,
                                                                auth_headers_for_user,
                                                                create_deposit,
                                                                json_headers):
    deposit = create_deposit(users['alice_user'], 'alice-analysis-v0.0.1')
    headers = auth_headers_for_user(users['alice_user']) + json_headers

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=headers)

        assert resp.status_code == 200


def test_get_deposits_with_given_id_other_member_of_collaboration_cant_see_deposit(app,
                                                                                   users,
                                                                                   auth_headers_for_user,
                                                                                   create_deposit,
                                                                                   json_headers):
    deposit = create_deposit(users['alice_user'], 'alice-analysis-v0.0.1')
    headers = auth_headers_for_user(users['alice_user2']) + json_headers

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=headers)

        assert resp.status_code == 403


def test_get_deposits_with_given_id_with_basic_json_serializer_returns_all_correct_fields(app,
                                                                                          auth_headers_for_superuser,
                                                                                          deposit):
    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=[('Accept', 'application/basic+json')] +
                          auth_headers_for_superuser)

        res = json.loads(resp.data)

        assert res == get_basic_json_serialized_deposit(
            deposit, 'cms-analysis-v0.0.1')


def test_get_deposits_with_given_id_with_permissions_json_serializer_returns_all_correct_fields(app,
                                                                                                auth_headers_for_superuser,
                                                                                                deposit,
                                                                                                permissions_serialized_deposit):
    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=[('Accept', 'application/permissions+json')] +
                          auth_headers_for_superuser)

        res = json.loads(resp.data)

        assert res == permissions_serialized_deposit


# # #######################################
# # # api/deposits/{pid}  [DELETE]
# # #######################################
# #
# #
def test_delete_deposit_with_non_existing_pid_returns_404(app,
                                                          auth_headers_for_superuser):
    with app.test_client() as client:
        resp = client.delete('/deposits/{}'.format('non-existing-pid'),
                             headers=auth_headers_for_superuser)

        assert resp.status_code == 404


@pytest.mark.xfail
def test_delete_deposit_when_user_has_no_permission_returns_403(app,
                                                                users,
                                                                create_deposit,
                                                                auth_headers_for_user):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
    other_user_headers = auth_headers_for_user(users['lhcb_user2'])

    with app.test_client() as client:
        resp = client.delete('/deposits/{}'.format(deposit['_deposit']['id']),
                             headers=other_user_headers)

        assert resp.status_code == 403


def test_delete_deposit_when_user_is_owner_can_delete_his_deposit(app,
                                                                  users,
                                                                  create_deposit,
                                                                  auth_headers_for_user):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
    user_headers = auth_headers_for_user(users['lhcb_user'])

    with app.test_client() as client:
        resp = client.delete('/deposits/{}'.format(deposit['_deposit']['id']),
                             headers=user_headers)

        assert resp.status_code == 204

        # deposit not existing anymore
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=user_headers)

        assert resp.status_code == 410


def test_delete_deposit_when_deposit_published_already_cant_be_deleted(app,
                                                                       users,
                                                                       create_deposit,
                                                                       auth_headers_for_user):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
    user_headers = auth_headers_for_user(users['lhcb_user'])
    pid = deposit['_deposit']['id']

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=[('Content-Type', 'application/json')] + user_headers)

        resp = client.delete('/deposits/{}'.format(pid),
                             headers=user_headers)

        assert resp.status_code == 403

        # deposit not removed
        resp = client.get('/deposits/{}'.format(pid),
                          headers=user_headers)

        assert resp.status_code == 200


def test_delete_deposit_when_superuser_can_delete_others_deposit(app,
                                                                 users,
                                                                 create_deposit,
                                                                 auth_headers_for_superuser):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')

    with app.test_client() as client:
        resp = client.delete('/deposits/{}'.format(deposit['_deposit']['id']),
                             headers=auth_headers_for_superuser)

        assert resp.status_code == 204


# #######################################
# # api/deposits/{pid}  [PUT]
# #######################################

def test_put_deposit_throws_validation_error(app,
                                             users,
                                             create_deposit,
                                             get_jsonschemas_host,
                                             auth_headers_for_superuser):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')

    test_data = {
        "$schema": deposit.get('$schema', ''),
        "general_title": ["Updated field with wrong data"]
    }

    with app.test_client() as client:
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps(test_data),
                          headers=([('Content-Type', 'application/json')] + auth_headers_for_superuser))
        assert resp.status_code == 400



# #######################################
# # api/deposits  [POST]
# #######################################

def test_owner_deposit_permissions_on_create(app,
                                             users,
                                             create_deposit,
                                             create_owner_permissions,
                                             auth_headers_for_user):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
    user_headers = auth_headers_for_user(users['lhcb_user'])
    pid = deposit['_deposit']['id']

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(pid),
                          headers=[('Content-Type', 'application/json')] + user_headers)

        data = json.loads(resp.data)

        assert len(data.get('access')) == 3


########################################
# api/deposits/{pid}/actions/permissions [POST]
########################################


def test_permissions_assign_permission_to_user(app,
                                               users,
                                               auth_headers_for_user,
                                               create_deposit,
                                               prepare_user_permissions_for_request,
                                               json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(
        users['cms_user2']) + json_headers
    cms_user3_headers = auth_headers_for_user(
        users['cms_user3']) + json_headers

    test_data = {
        "$schema": deposit.get('$schema', ''),
        "general_title": "Updated field with wrong data"
    }

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 403

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps(test_data),
                          headers=([('Content-Type', 'application/json')] + cms_user2_headers))

        assert resp.status_code == 403

        permissions = prepare_user_permissions_for_request([
            (
                users['cms_user2'].email,
                [("add", "deposit-read"), ("add", "deposit-update")]
            )
        ])

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 200

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps(test_data),
                          headers=([('Content-Type', 'application/json')] + cms_user2_headers))

        assert resp.status_code == 200

        # Test for user X
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps(test_data),
                          headers=([('Content-Type', 'application/json')] + cms_user3_headers))

        assert resp.status_code == 403


def test_permissions_remove_permission_from_user(app,
                                                 users,
                                                 auth_headers_for_user,
                                                 create_deposit,
                                                 prepare_user_permissions_for_request,
                                                 json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(
        users['cms_user2']) + json_headers
    cms_user3_headers = auth_headers_for_user(
        users['cms_user3']) + json_headers

    test_data = {
        "$schema": deposit.get('$schema', ''),
        "general_title": "Updated field with wrong data"
    }

    with app.test_client() as client:
        permissions = prepare_user_permissions_for_request([
            (
                users['cms_user2'].email,
                [("add", "deposit-read"), ("add", "deposit-update")]
            )
        ])

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        permissions = prepare_user_permissions_for_request([
            (
                users['cms_user2'].email,
                [("remove", "deposit-update")]
            )
        ])

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 200

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps(test_data),
                          headers=([('Content-Type', 'application/json')] + cms_user2_headers))

        assert resp.status_code == 403

        # Test for user X
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps(test_data),
                          headers=([('Content-Type', 'application/json')] + cms_user3_headers))

        assert resp.status_code == 403


def test_permissions_post_permission_from_random_user(app,
                                                      users,
                                                      auth_headers_for_user,
                                                      create_deposit,
                                                      prepare_user_permissions_for_request,
                                                      json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(
        users['cms_user2']) + json_headers

    with app.test_client() as client:
        permissions = prepare_user_permissions_for_request([
            (
                users['cms_user2'].email,
                [("add", "deposit-read"), ("add", "deposit-update")]
            )
        ])

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user2_headers, data=json.dumps(permissions))

        assert resp.status_code == 403

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        assert resp.status_code == 201


def test_permissions_post_permission_for_registered_and_random_user(app,
                                                                    users,
                                                                    auth_headers_for_user,
                                                                    create_deposit,
                                                                    prepare_user_permissions_for_request,
                                                                    json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(
        users['cms_user2']) + json_headers
    cms_user3_headers = auth_headers_for_user(
        users['cms_user3']) + json_headers
    lhcb_user_headers = auth_headers_for_user(
        users['lhcb_user']) + json_headers

    with app.test_client() as client:
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 403

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user3_headers)

        assert resp.status_code == 403

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=lhcb_user_headers)

        assert resp.status_code == 403

        permissions = prepare_user_permissions_for_request([
            (
                users['cms_user2'].email,
                [("add", "deposit-read"), ("add", "deposit-update")]
            ),
            (
                "fake@email.com",
                [("add", "deposit-read"), ("add", "deposit-update")]
            ),
            (
                users['cms_user3'].email,
                [("add", "deposit-read"), ("add", "deposit-update")]
            )
        ])

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user_headers)
        data = json.loads(resp.data)
        assert len(data['access']) == 7

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 200

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user3_headers)

        assert resp.status_code == 200

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=lhcb_user_headers)

        assert resp.status_code == 403


def test_permissions_post_permission_with_fake_user(app,
                                                    users,
                                                    auth_headers_for_user,
                                                    create_deposit,
                                                    prepare_user_permissions_for_request,
                                                    json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(
        users['cms_user2']) + json_headers

    with app.test_client() as client:
        permissions = prepare_user_permissions_for_request([
            (
                "fake@email.com",
                [("add", "deposit-read"), ("add", "deposit-update")]
            )
        ])

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user_headers)
        data = json.loads(resp.data)
        assert len(data['access']) == 3

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        assert resp.status_code == 201

        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user_headers)
        data = json.loads(resp.data)
        assert len(data['access']) == 3

########################################
# api/deposits/{pid}/actions/publish
########################################
def test_get_deposits_when_published_other_member_can_see_it(app, db, users,
                                                             auth_headers_for_user,
                                                             create_deposit):
    with app.test_client() as client:
        user_headers = auth_headers_for_user(users['lhcb_user'])
        other_user_headers = auth_headers_for_user(users['lhcb_user2'])
        deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
        pid = deposit['_deposit']['id']

        # creator can see it
        resp = client.get('/deposits/{}'.format(pid),
                          headers=user_headers)

        assert resp.status_code == 200

        # other members of collaboration cant see it
        resp = client.get('/deposits/{}'.format(pid),
                          headers=other_user_headers)

        assert resp.status_code == 403

        # publish
        pid = deposit['_deposit']['id']
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=[('Content-Type', 'application/json')] + user_headers)

        # creator can see published one under api/records
        resp = client.get('/records/{}'.format(deposit['_deposit']['pid']['value']),
                          headers=user_headers)

        assert resp.status_code == 200

        # once deposit has been published other members can see it as well
        resp = client.get('/records/{}'.format(deposit.pid.id),
                          headers=other_user_headers)

        assert resp.status_code == 200


def test_deposit_when_published_status_changed_and_record_created(app, db, users,
                                                                  auth_headers_for_user,
                                                                  create_deposit):
    with app.test_client() as client:
        user_headers = auth_headers_for_user(users['lhcb_user'])
        deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
        pid = deposit['_deposit']['id']

        # publish a deposit
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=[('Content-Type', 'application/json')] + user_headers)

        resp = client.get('/records/{}'.format(deposit['_deposit']['pid']['value']),
                          headers=user_headers)

        res = json.loads(resp.data)

        assert resp.status_code == 200

        assert 'control_number' in res['metadata']

        assert 'published' in res['metadata']['_deposit']['status']
