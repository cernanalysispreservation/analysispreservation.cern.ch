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
"""Integration tests for deleting deposits."""

import json

# #######################################
# # api/deposits/{pid}  [DELETE]
# #######################################


def test_delete_deposit_with_non_existing_pid_returns_404(
        client, auth_headers_for_superuser):
    resp = client.delete('/deposits/{}'.format('non-existing-pid'),
                         headers=auth_headers_for_superuser)

    assert resp.status_code == 404


def test_delete_deposit_when_user_has_no_permission_returns_403(
        client, users, create_deposit, auth_headers_for_user):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
    other_user_headers = auth_headers_for_user(users['lhcb_user2'])

    resp = client.delete('/deposits/{}'.format(deposit['_deposit']['id']),
                         headers=other_user_headers)

    assert resp.status_code == 403


def test_delete_deposit_when_user_is_owner_can_delete_his_deposit(
        client, users, create_deposit, json_headers, auth_headers_for_user):
    owner = users['lhcb_user']
    deposit = create_deposit(owner, 'lhcb-v0.0.1')
    pid = deposit['_deposit']['id']
    headers = auth_headers_for_user(owner) + json_headers

    resp = client.delete('/deposits/{}'.format(pid), headers=headers)

    assert resp.status_code == 204

    # deposit not existing anymore
    resp = client.get('/deposits/{}'.format(pid), headers=headers)

    assert resp.status_code == 410


def test_delete_deposit_when_deposit_published_already_cant_be_deleted(
        client, users, create_deposit, json_headers, auth_headers_for_user):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
    headers = auth_headers_for_user(users['lhcb_user']) + json_headers
    pid = deposit['_deposit']['id']

    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=headers)

    resp = client.delete('/deposits/{}'.format(pid), headers=headers)

    assert resp.status_code == 403

    # deposit not removed
    resp = client.get('/deposits/{}'.format(pid), headers=headers)

    assert resp.status_code == 200


def test_delete_deposit_when_superuser_can_delete_others_deposit(
        client, users, create_deposit, auth_headers_for_superuser):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')

    resp = client.delete('/deposits/{}'.format(deposit['_deposit']['id']),
                         headers=auth_headers_for_superuser)

    assert resp.status_code == 204


def test_delete_deposit_when_user_with_admin_access_can_delete(
        client, users, create_deposit, auth_headers_for_user, json_headers):
    owner, other_user = users['lhcb_user'], users['cms_user']
    deposit = create_deposit(owner, 'lhcb-v0.0.1')
    pid = deposit['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-admin'
    }]

    # give other user read/write access
    resp = client.post('/deposits/{}/actions/permissions'.format(pid),
                       headers=auth_headers_for_user(owner) + json_headers,
                       data=json.dumps(permissions))

    resp = client.delete('/deposits/{}'.format(pid),
                         headers=auth_headers_for_user(other_user))

    assert resp.status_code == 204


def test_delete_deposit_when_user_only_with_read_write_access_returns_403(
        client, users, create_deposit, auth_headers_for_user, json_headers):
    owner, other_user = users['lhcb_user'], users['cms_user']
    deposit = create_deposit(owner, 'lhcb-v0.0.1')
    pid = deposit['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-read'
    }, {
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-update'
    }]

    # give other user read/write access
    resp = client.post('/deposits/{}/actions/permissions'.format(pid),
                       headers=auth_headers_for_user(owner) + json_headers,
                       data=json.dumps(permissions))

    resp = client.delete('/deposits/{}'.format(pid),
                         headers=auth_headers_for_user(other_user))

    assert resp.status_code == 403
