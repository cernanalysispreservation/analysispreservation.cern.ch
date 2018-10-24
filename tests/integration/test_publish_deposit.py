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

"""Integration tests for publishing deposits."""

import json
import re

from pytest import mark


###########################################
# api/deposits/{pid}/actions/publish [POST]
###########################################
def test_deposit_publish_when_owner_can_publish_his_deposit(app, users,
                                                          auth_headers_for_user,
                                                          create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner, 'test-analysis-v0.0.1')['_deposit']['id']

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=auth_headers_for_user(owner))

        assert resp.status_code == 202


def test_deposit_publish_when_superuser_can_publish_others_deposits(app, users,
                                                                  auth_headers_for_superuser,
                                                                  create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner, 'test-v0.0.1')['_deposit']['id']

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=auth_headers_for_superuser)

        assert resp.status_code == 202


def test_deposit_publish_when_other_user_returns_403(app, users,
                                                     auth_headers_for_user,
                                                     create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    pid = create_deposit(owner, 'test-v0.0.1')['_deposit']['id']

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 403


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-update"),
])
def test_deposit_publish_when_user_has_only_read_or_update_permission_returns_403(action, app, users,
                                                                                  json_headers,
                                                                                  auth_headers_for_user,
                                                                                  create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    pid = create_deposit(owner, 'test-v0.0.1')['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    with app.test_client() as client:
        client.post('/deposits/{}/actions/permissions'.format(pid),
                    headers=auth_headers_for_user(owner) + json_headers,
                    data=json.dumps(permissions))

        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=auth_headers_for_user(other_user))

        assert resp.status_code == 403


def test_deposit_publish_when_user_has_admin_permission_can_publish_deposit(app, users,
                                                                            json_headers,
                                                                            auth_headers_for_user,
                                                                            create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    pid = create_deposit(owner, 'cms-analysis-v0.0.1')['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-admin'
    }]

    with app.test_client() as client:
        client.post('/deposits/{}/actions/permissions'.format(pid),
                    headers=auth_headers_for_user(owner) + json_headers,
                    data=json.dumps(permissions))

        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=auth_headers_for_user(other_user))

        assert resp.status_code == 202


def test_deposit_publish_changes_status_and_creates_record(app, users,
                                                           auth_headers_for_user,
                                                           json_headers,
                                                           create_schema,
                                                           create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('deposits/records/test-v0.0.1', experiment='CMS')
    pid = create_deposit(owner, 'test-v0.0.1')['_deposit']['id']

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=headers)

        record_metadata = resp.json['metadata']
        assert re.match('CAP.CMS.{4}\w.{4}\w', record_metadata['control_number'])
        assert re.match('CAP.CMS.{4}\w.{4}\w', record_metadata['_deposit']['pid']['value'])
        assert record_metadata['_deposit']['status'] == 'published'

        resp = client.get('/records/{}'.format(record_metadata['control_number']),
                          headers=headers)

        assert resp.status_code == 200


def test_deposit_publish_then_deposit_update_should_not_be_allowed(app, users,
                                                           auth_headers_for_user,
                                                           json_headers,
                                                           create_schema,
                                                           create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    pid = create_deposit(owner, 'cms-analysis-v0.0.1')['_deposit']['id']

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=headers)

        assert resp.status_code == 202

        resp = client.put('/deposits/{}'.format(pid),
                           headers=headers + json_headers,
                           data = json.dumps({"title": "Updated published"}))

        assert resp.status_code == 403

        resp = client.post('/deposits/{}/actions/edit'.format(pid),
                           headers=headers + json_headers)

        assert resp.status_code == 201

        resp = client.put('/deposits/{}'.format(pid),
                           headers=headers + json_headers,
                           data = json.dumps({"title": "Updated published"}))

        assert resp.status_code == 200
        assert resp.json.get("metadata", {}).get("title", None) == "Updated published"


# TOFIX : updating schemas that don't have indexes, results to error
@mark.skip
def test_deposit_publish_unknown_schema_then_deposit_update_should_not_be_allowed(app, users,
                                                           auth_headers_for_user,
                                                           json_headers,
                                                           create_schema,
                                                           create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('deposits/records/test-v0.0.1', experiment='CMS')
    pid = create_deposit(owner, 'test-v0.0.1')['_deposit']['id']

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=headers)

        assert resp.status_code == 202

        resp = client.put('/deposits/{}'.format(pid),
                           headers=headers + json_headers,
                           data = json.dumps({"general_title": "Updated published"}))

        assert resp.status_code == 403

        resp = client.post('/deposits/{}/actions/edit'.format(pid),
                           headers=headers + json_headers)

        assert resp.status_code == 201


def test_get_deposits_when_published_other_members_of_experiment_can_see_it(app, db, users,
                                                                            auth_headers_for_user,
                                                                            json_headers,
                                                                            create_schema,
                                                                            create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    headers_for_owner = auth_headers_for_user(owner) 
    headers_for_other_user = auth_headers_for_user(other_user) 
    user_from_different_exp = users['lhcb_user']
    headers_for_diff_exp_user = auth_headers_for_user(user_from_different_exp)
    schema = create_schema('deposits/records/test-v0.0.1', experiment='CMS')
    pid = create_deposit(owner, 'test-v0.0.1')['_deposit']['id']
    
    with app.test_client() as client:
        # creator can see it
        resp = client.get('/deposits/{}'.format(pid),
                          headers=headers_for_owner)

        assert resp.status_code == 200

        # other members of collaboration cant see it
        resp = client.get('/deposits/{}'.format(pid),
                          headers=headers_for_other_user)

        assert resp.status_code == 403

        # publish
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=headers_for_owner)
        record_pid = resp.json['metadata']['control_number']

        # creator can see published one under api/records
        resp = client.get('/records/{}'.format(record_pid),
                          headers=headers_for_other_user)

        assert resp.status_code == 200

        # once deposit has been published other members can see it as well
        resp = client.get('/records/{}'.format(record_pid),
                          headers=headers_for_other_user)

        assert resp.status_code == 200

        # members of different collaborations cant see the record
        resp = client.get('/records/{}'.format(record_pid),
                          headers=headers_for_diff_exp_user)

        assert resp.status_code == 403
