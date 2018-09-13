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

"""Integration tests for CAP api."""

from __future__ import absolute_import, print_function

import json

from flask import session

from mock import patch
from pytest import mark


########################################
# api/deposits/{pid}/actions/permissions [POST]
########################################
def test_permissions_when_user_doesnt_have_update_permissions_returns_403(app,
                                                                         users,
                                                                         auth_headers_for_user,
                                                                         create_deposit,
                                                                         json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(users['cms_user2']) + json_headers
    permissions = [{
        'email': users['cms_user2'].email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-read'
    }]

    with app.test_client() as client:
        # cms_user2 will get read permissions, but not write ones
        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        # so one can't update permissions without deposit-admin permission
        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user2_headers, data=json.dumps(permissions))

        assert resp.status_code == 403


def test_permissions_when_user_doesnt_exist(app,
                                            users,
                                            auth_headers_for_user,
                                            create_deposit,
                                            json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    permissions = [{
        'email': 'non-existing-user',
        'type': 'user',
        'op': 'add',
        'action': 'deposit-read'
    }]

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        assert resp.status_code == 400
        assert resp.json['message'] == 'User with this mail does not exist.'


def test_permissions_add_permissions_for_user(app,
                                              users,
                                              auth_headers_for_user,
                                              create_deposit,
                                              json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(users['cms_user2']) + json_headers

    with app.test_client() as client:
        # owner can see the deposit
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user_headers)

        assert resp.status_code == 200

        # other user cant see the deposit
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 403

        permissions = [{
            'email': users['cms_user2'].email,
            'type': 'user',
            'op': 'add',
            'action': 'deposit-read'
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        # now other user can see the deposit
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 200

        # but other user still can't update the deposit
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps({}),
                          headers=([('Content-Type', 'application/json')] + cms_user2_headers))

        assert resp.status_code == 403

        permissions = [{
            'email': users['cms_user2'].email,
            'type': 'user',
            'op': 'add',
            'action': 'deposit-update'
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        # now user can update the deposit
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps({}),
                          headers=([('Content-Type', 'application/json')] + cms_user2_headers))

        assert resp.status_code == 200


def test_permissions_on_add_when_permission_already_exist_returns_400(app,
                                                                      users,
                                                                      auth_headers_for_user,
                                                                      create_deposit,
                                                                      json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers

    with app.test_client() as client:

        permissions = [{
            'email': users['cms_user'].email,
            'type': 'user',
            'op': 'add',
            'action': 'deposit-read'
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        assert resp.status_code == 400
        assert resp.json['message'] == 'Permission already exist.'


def test_permissions_on_add_when_permission_doesnt_exist_returns_400(app,
                                                                     users,
                                                                     auth_headers_for_user,
                                                                     create_deposit,
                                                                     json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers

    with app.test_client() as client:

        permissions = [{
            'email': users['cms_user2'].email,
            'type': 'user',
            'op': 'remove',
            'action': 'deposit-read'
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        assert resp.status_code == 400
        assert resp.json['message'] == 'Permission does not exist.'


def test_permissions_remove_user_permissions(app,
                                             users,
                                             auth_headers_for_user,
                                             create_deposit,
                                             prepare_user_permissions_for_request,
                                             json_headers,
                                             record_metadata):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(users['cms_user2']) + json_headers
    test_data = {"$schema": deposit.get('$schema', '')}

    with app.test_client() as client:
        permissions = [{
            'email': users['cms_user2'].email,
            'type': 'user',
            'op': 'add',
            'action': 'deposit-read'
        },{
            'email': users['cms_user2'].email,
            'type': 'user',
            'op': 'add',
            'action': 'deposit-update'
        }]
        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        # user can read/write the deposit
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 200

        # remove read/write permissions
        permissions = [{
            'email': users['cms_user2'].email,
            'type': 'user',
            'op': 'remove',
            'action': 'deposit-read'
        },{
            'email': users['cms_user2'].email,
            'type': 'user',
            'op': 'remove',
            'action': 'deposit-update'
        }]
        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        # user cant read/write the deposit anymore
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 403


def test_permissions_when_egroup_doesnt_exist(app,
                                            users,
                                            auth_headers_for_user,
                                            create_deposit,
                                            json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    permissions = [{
        'email': 'non-existing-egroup',
        'type': 'egroup',
        'op': 'add',
        'action': 'deposit-read'
    }]

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        assert resp.status_code == 400
        assert resp.json['message'] == 'Egroup with this mail does not exist.'

@mark.skip
@patch.dict(session, {'roles': ['some-egroup@cern.ch', 'some-other@cern.ch']})
def test_permissions_add_permissions_for_egroup(
                                                app,
                                                users,
                                                auth_headers_for_user,
                                                create_deposit,
                                                json_headers
                                                ):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(users['cms_user2']) + json_headers

    with app.test_client() as client:
        # owner can see the deposit
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user_headers)

        assert resp.status_code == 200

        # other user cant see the deposit
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 403

        permissions = [{
            'email': 'some-egroup@cern.ch',
            'type': 'egroup',
            'op': 'add',
            'action': 'deposit-read'
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        # now other user can see the deposit
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 200

        # but other user still can't update the deposit
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps({}),
                          headers=([('Content-Type', 'application/json')] + cms_user2_headers))

        assert resp.status_code == 403

        permissions = [{
            'email': users['cms_user2'].email,
            'type': 'user',
            'op': 'add',
            'action': 'deposit-update'
        }]

        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        # now user can update the deposit
        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps({}),
                          headers=([('Content-Type', 'application/json')] + cms_user2_headers))

        assert resp.status_code == 200


@mark.skip
@patch.dict(session, {'roles': ['some-egroup@cern.ch', 'some-other@cern.ch']})
def test_permissions_remove_egroup_permissions(app,
                                               users,
                                               auth_headers_for_user,
                                               create_deposit,
                                               json_headers):
    deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')
    cms_user_headers = auth_headers_for_user(users['cms_user']) + json_headers
    cms_user2_headers = auth_headers_for_user(users['cms_user2']) + json_headers

    with app.test_client() as client:
        permissions = [{
            'email': 'some-egroup@cern.ch',
            'type': 'egroup',
            'op': 'add',
            'action': 'deposit-read'
        },{
            'email': 'some-egroup@cern.ch',
            'type': 'egroup',
            'op': 'add',
            'action': 'deposit-update'
        }]
        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        # user can read/write the deposit
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 200

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers, data=json.dumps({}))

        assert resp.status_code == 200

        # remove read/write permissions
        permissions = [{
            'email': 'some-egroup@cern.ch',
            'type': 'egroup',
            'op': 'remove',
            'action': 'deposit-read'
        },{
            'email': 'some-egroup@cern.ch',
            'type': 'egroup',
            'op': 'remove',
            'action': 'deposit-update'
        }]
        resp = client.post('/deposits/{}/actions/permissions'.format(deposit['_deposit']['id']),
                           headers=cms_user_headers, data=json.dumps(permissions))

        # user cant read/write the deposit anymore
        resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                          headers=cms_user2_headers)

        assert resp.status_code == 403

        resp = client.put('/deposits/{}'.format(deposit['_deposit']['id']),
                          data=json.dumps({}),
                          headers=([('Content-Type', 'application/json')] + cms_user2_headers))

        assert resp.status_code == 403
