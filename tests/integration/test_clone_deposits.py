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
"""Integration tests for GET deposits."""

import json

from pytest import mark


#########################################
# api/deposits/{pid}/actions/clone [POST]
#########################################
def test_deposit_clone_when_owner_can_clone_his_deposit(
        client, users, auth_headers_for_user, create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis', publish=True)
    pid = deposit['_deposit']['id']

    resp = client.post('/deposits/{}/actions/clone'.format(pid),
                       headers=auth_headers_for_user(owner))

    assert resp.status_code == 201


def test_deposit_clone_when_superuser_can_clone_others_deposits(
        client, users, auth_headers_for_superuser, create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis', publish=True)
    pid = deposit['_deposit']['id']

    resp = client.post('/deposits/{}/actions/clone'.format(pid),
                       headers=auth_headers_for_superuser)

    assert resp.status_code == 201


def test_deposit_clone_when_other_user_returns_403(client, users,
                                                   auth_headers_for_user,
                                                   create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis', publish=True)
    pid = deposit['_deposit']['id']

    resp = client.post('/deposits/{}/actions/clone'.format(pid),
                       headers=auth_headers_for_user(other_user))

    assert resp.status_code == 403


def test_deposit_clone_when_user_has_only_update_permission_returns_403(
        client, users, auth_headers_for_user, create_deposit, json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis', publish=True)
    pid = deposit['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-update'
    }]

    deposit.edit_permissions(permissions)

    resp = client.post('/deposits/{}/actions/clone'.format(pid),
                       headers=auth_headers_for_user(other_user))

    assert resp.status_code == 403


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-admin"),
])
def test_deposit_clone_when_user_has_read_or_admin_permission_can_clone_deposit(
        action, client, users, auth_headers_for_user, create_deposit,
        json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis', publish=True)
    pid = deposit['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    deposit.edit_permissions(permissions)

    resp = client.post('/deposits/{}/actions/clone'.format(pid),
                       headers=auth_headers_for_user(other_user))

    assert resp.status_code == 201


@mark.skip('Cloning has to be checked, as sth wrong with id fields.')
def test_deposit_clone_works_correctly(client, users, auth_headers_for_user,
                                       json_headers, create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner,
                             'test-analysis',
                             publish=True,
                             experiment='CMS')
    depid = deposit['_deposit']['id']

    resp = client.post('/deposits/{}/actions/clone'.format(depid),
                       headers=auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert resp.json == {
        'id': depid,
        'type': 'deposit',
        'revision': 1,
        'schema': {
            'name': 'test-analysis',
            'version': '1.0.0'
        },
        'experiment': 'CMS',
        'status': 'draft',
        'created_by': owner.email,
        'cloned_from': depid,
        'created': resp.json['created'],
        'updated': resp.json['updated'],
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
        'can_update': True,
        'can_admin': True,
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
