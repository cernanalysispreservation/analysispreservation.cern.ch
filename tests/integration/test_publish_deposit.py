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

from invenio_access.models import ActionRoles, ActionUsers
from pytest import mark

from cap.modules.experiments.permissions import exp_need_factory
from conftest import _datastore


###########################################
# api/deposits/{pid}/actions/publish [POST]
###########################################
def test_deposit_publish_when_owner_can_publish_his_deposit(
        client, users, auth_headers_for_user, create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner, 'test')['_deposit']['id']

    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=auth_headers_for_user(owner))

    assert resp.status_code == 202


def test_deposit_publish_when_superuser_can_publish_others_deposits(
        client, users, auth_headers_for_superuser, create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner, 'test')['_deposit']['id']

    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=auth_headers_for_superuser)

    assert resp.status_code == 202


def test_deposit_publish_when_other_user_returns_403(client, users,
                                                     auth_headers_for_user,
                                                     create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    pid = create_deposit(owner, 'test')['_deposit']['id']

    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=auth_headers_for_user(other_user))

    assert resp.status_code == 403


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-update"),
])
def test_deposit_publish_when_user_has_only_read_or_update_permission_returns_403(
        action, client, users, json_headers, auth_headers_for_user,
        create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    pid = create_deposit(owner, 'test')['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    client.post('/deposits/{}/actions/permissions'.format(pid),
                headers=auth_headers_for_user(owner) + json_headers,
                data=json.dumps(permissions))

    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=auth_headers_for_user(other_user))

    assert resp.status_code == 403


def test_deposit_publish_when_user_has_admin_permission_can_publish_deposit(
        client, users, json_headers, auth_headers_for_user, create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    pid = create_deposit(owner, 'cms')['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-admin'
    }]

    client.post('/deposits/{}/actions/permissions'.format(pid),
                headers=auth_headers_for_user(owner) + json_headers,
                data=json.dumps(permissions))

    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=auth_headers_for_user(other_user))

    assert resp.status_code == 202


def test_deposit_publish_changes_status_and_creates_record(
        client, users, auth_headers_for_user, json_headers, create_schema,
        create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    deposit = create_deposit(owner, 'test', experiment='CMS')
    depid = deposit['_deposit']['id']
    metadata = deposit.get_record_metadata()

    resp = client.post('/deposits/{}/actions/publish'.format(depid),
                       headers=headers)

    _, record = deposit.fetch_published()

    assert resp.json == {
        'id': depid,
        'recid': record['control_number'],
        'type': 'deposit',
        'revision': 2,
        'schema': {
            'name': 'test',
            'version': '1.0.0'
        },
        'experiment': 'CMS',
        'status': 'published',
        'created_by': owner.email,
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'labels': [],
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
            'bucket': 'http://analysispreservation.cern.ch/api/files/{}'.
            format(deposit.files.bucket),
            'clone': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/clone'
            .format(depid),
            'discard': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/discard'
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

    resp = client.get('/records/{}'.format(record['control_number']),
                      headers=headers)

    assert resp.status_code == 200


def test_deposit_publish_then_deposit_update_should_not_be_allowed(
        client, users, auth_headers_for_user, json_headers, create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    pid = create_deposit(owner, 'cms')['_deposit']['id']

    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=headers)

    assert resp.status_code == 202

    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"title": "Updated published"}))

    assert resp.status_code == 403

    resp = client.post('/deposits/{}/actions/edit'.format(pid),
                       headers=headers + json_headers)

    assert resp.status_code == 201

    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"title": "Updated published"}))

    assert resp.status_code == 200
    assert resp.json.get("metadata", {}).get("title",
                                             None) == "Updated published"


# TOFIX : updating schemas that don't have indexes, results to error
@mark.skip
def test_deposit_publish_unknown_schema_then_deposit_update_should_not_be_allowed(
        client, users, auth_headers_for_user, json_headers, create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    pid = create_deposit(owner, 'test')['_deposit']['id']

    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=headers)

    assert resp.status_code == 202

    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"general_title": "Updated published"}))

    assert resp.status_code == 403

    resp = client.post('/deposits/{}/actions/edit'.format(pid),
                       headers=headers + json_headers)

    assert resp.status_code == 201


def test_get_deposits_when_published_other_members_of_experiment_can_see_it(
        client, db, users, auth_headers_for_user, json_headers, create_schema,
        create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    user_from_different_exp = users['lhcb_user']
    headers_for_owner = auth_headers_for_user(owner)
    headers_for_other_user = auth_headers_for_user(other_user)
    headers_for_diff_exp_user = auth_headers_for_user(user_from_different_exp)
    pid = create_deposit(owner, 'test', experiment='CMS')['_deposit']['id']

    # creator can see it
    resp = client.get('/deposits/{}'.format(pid), headers=headers_for_owner)

    assert resp.status_code == 200

    # other members of collaboration cant see it
    resp = client.get('/deposits/{}'.format(pid),
                      headers=headers_for_other_user)

    assert resp.status_code == 403

    # publish
    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=headers_for_owner)
    record_pid = resp.json['recid']

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


def test_deposit_publish_record_inherits_deposit_permissions(
        client, db, users, create_deposit):
    owner = users['superuser']
    role = _datastore.find_or_create_role('some-egroup@cern.ch')
    deposit = create_deposit(owner, 'test', {})
    deposit._add_egroup_permissions(role, ['deposit-read', 'deposit-update'],
                                    db.session)
    deposit.publish()
    _, record = deposit.fetch_published()

    assert record['_access'] == {
        'record-read': {
            'users': [owner.id],
            'roles': [role.id]
        },
        'record-update': {
            'users': [owner.id],
            'roles': [role.id]
        },
        'record-admin': {
            'users': [owner.id],
            'roles': []
        }
    }

    assert ActionUsers.query.filter_by(action='record-read',
                                       argument=str(record.id),
                                       user_id=owner.id).one()
    assert ActionUsers.query.filter_by(action='record-update',
                                       argument=str(record.id),
                                       user_id=owner.id).one()
    assert ActionUsers.query.filter_by(action='record-admin',
                                       argument=str(record.id),
                                       user_id=owner.id).one()
    assert ActionRoles.query.filter_by(action='record-read',
                                       argument=str(record.id),
                                       role_id=role.id).one()
    assert ActionRoles.query.filter_by(action='record-update',
                                       argument=str(record.id),
                                       role_id=role.id).one()
    assert not ActionRoles.query.filter_by(action='record-admin',
                                           argument=str(record.id),
                                           role_id=role.id).one_or_none()


def test_deposit_publish_gives_acceess_to_members_of_exp(
        client, db, users, create_deposit):
    owner = users['superuser']
    role = _datastore.find_or_create_role('some-egroup@cern.ch')
    db.session.add(ActionRoles.allow(exp_need_factory('CMS'), role=role))
    deposit = create_deposit(owner, 'test', {}, experiment='CMS', publish=True)
    _, record = deposit.fetch_published()

    assert record['_access'] == {
        'record-read': {
            'users': [owner.id, users['cms_user'].id, users['cms_user2'].id],
            'roles': [role.id]
        },
        'record-update': {
            'users': [owner.id],
            'roles': []
        },
        'record-admin': {
            'users': [owner.id],
            'roles': []
        }
    }

    assert ActionUsers.query.filter_by(action='record-read',
                                       argument=str(record.id),
                                       user=users['cms_user']).one()
    assert ActionUsers.query.filter_by(action='record-read',
                                       argument=str(record.id),
                                       user=users['cms_user2']).one()
    assert ActionRoles.query.filter_by(action='record-read',
                                       argument=str(record.id),
                                       role=role).one()
