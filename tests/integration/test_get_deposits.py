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

from six import BytesIO

from conftest import add_role_to_user
from invenio_search import current_search
from pytest import mark


######################
# api/deposits/  [GET]
######################
def test_get_deposits_when_user_not_logged_in_returns_401(client, users):
    resp = client.get('/deposits/')

    assert resp.status_code == 401


def test_get_deposits_when_superuser_returns_all_deposits(
        client, users, auth_headers_for_superuser, create_deposit):
    deposits = [
        create_deposit(users['cms_user'], 'cms'),
        create_deposit(users['lhcb_user'], 'lhcb')
    ]

    resp = client.get('/deposits/', headers=auth_headers_for_superuser)
    hits = resp.json['hits']['hits']

    assert resp.status_code == 200
    assert len(hits) == 2


def test_get_deposits_when_owner_returns_his_deposits(client, db, users,
                                                      auth_headers_for_user,
                                                      create_deposit):
    user = users['cms_user']

    user_deposits_ids = [
        x['_deposit']['id'] for x in [
            create_deposit(user, 'cms'),
            create_deposit(user, 'cms'),
        ]
    ]

    create_deposit(users['lhcb_user'], 'lhcb'),

    resp = client.get('/deposits/', headers=auth_headers_for_user(user))
    hits = resp.json['hits']['hits']

    assert resp.status_code == 200
    assert len(hits) == 2
    for hit in hits:
        assert hit['id'] in user_deposits_ids


def test_get_deposits_doesnt_return_published_ones(client, db, users,
                                                   auth_headers_for_user,
                                                   create_deposit):
    user = users['cms_user']

    published = create_deposit(user, 'cms', publish=True)
    deposit = create_deposit(user, 'cms-questionnaire')

    create_deposit(users['lhcb_user'], 'lhcb'),

    resp = client.get('/deposits/', headers=auth_headers_for_user(user))
    hits = resp.json['hits']['hits']

    assert resp.status_code == 200
    assert len(hits) == 1
    assert deposit.pid.pid_value in [hit['id'] for hit in hits]


@mark.parametrize("action", [("deposit-read"), ("deposit-admin")])
def test_get_deposits_returns_deposits_that_user_has_read_or_admin_access_to(
        action, client, db, users, auth_headers_for_user, create_deposit):
    user, other_user = users['cms_user'], users['lhcb_user']

    deposit = create_deposit(user, 'cms')

    # other user cant see the deposit
    resp = client.get('/deposits/', headers=auth_headers_for_user(other_user))
    hits = resp.json['hits']['hits']

    assert len(hits) == 0

    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    deposit.edit_permissions(permissions)

    # sometimes ES needs refresh
    current_search.flush_and_refresh('deposits')

    resp = client.get('/deposits/', headers=auth_headers_for_user(other_user))
    hits = resp.json['hits']['hits']

    assert len(hits) == 1


@mark.parametrize("action", [("deposit-read"), ("deposit-admin")])
def test_get_deposits_returns_deposits_that_users_egroups_have_read_or_admin_access_to(
        action, client, db, users, auth_headers_for_user, create_deposit):
    user, other_user = users['cms_user'], users['lhcb_user']
    add_role_to_user(users['lhcb_user'], 'some-egroup@cern.ch')

    deposit = create_deposit(user, 'cms-v0.0.1')

    # other user cant see the deposit
    resp = client.get('/deposits/', headers=auth_headers_for_user(other_user))
    hits = resp.json['hits']['hits']

    assert len(hits) == 0

    permissions = [{
        'email': 'some-egroup@cern.ch',
        'type': 'egroup',
        'op': 'add',
        'action': action
    }]

    deposit.edit_permissions(permissions)

    # sometimes ES needs refresh
    current_search.flush_and_refresh('deposits')

    resp = client.get('/deposits/', headers=auth_headers_for_user(other_user))
    hits = resp.json['hits']['hits']

    assert len(hits) == 1


def test_get_deposits_with_basic_json_serializer_returns_serialized_deposit_properly(
        client, users, auth_headers_for_user, create_deposit):
    user = users['cms_user']
    deposit = create_deposit(
        user, 'cms', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-v1.0.0.json',
            'basic_info': {
                'analysis_number': 'dream_team',
                'people_info': [{}]
            }
        })
    metadata = deposit.get_record_metadata()

    resp = client.get('/deposits/',
                      headers=[('Accept', 'application/basic+json')] +
                      auth_headers_for_user(user))

    hit = resp.json['hits']['hits'][0]

    assert resp.status_code == 200
    assert hit == {
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {
            'basic_info': {
                'people_info': [{}],
                'analysis_number': 'dream_team'
            }
        },
        'pid': deposit['_deposit']['id'],
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
    }


def test_get_deposit_with_default_serializer(client, users,
                                             auth_headers_for_user,
                                             create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(
        owner,
        'cms-analysis', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v1.0.0.json',
            'basic_info': {
                'analysis_number': 'dream_team',
            }
        },
        files={'file_1.txt': BytesIO(b'Hello world!')},
        experiment='CMS')

    depid = deposit['_deposit']['id']
    metadata = deposit.get_record_metadata()
    file = deposit.files['file_1.txt']

    resp = client.get('/deposits/',
                      headers=[('Accept', 'application/json')] +
                      auth_headers_for_user(owner))

    assert resp.status_code == 200
    assert resp.json['hits']['hits'] == [{
        'id': depid,
        'type': 'deposit',
        'revision': 2,
        'schema': {
            'name': 'cms-analysis',
            'version': '1.0.0'
        },
        'experiment': 'CMS',
        'status': 'draft',
        'created_by': owner.email,
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {
            'basic_info': {
                'analysis_number': 'dream_team'
            }
        },
        'labels': [],
        'files': [{
            'bucket': str(file.bucket),
            'checksum': file.file.checksum,
            'key': file.key,
            'size': file.file.size,
            'version_id': str(file.version_id)
        }],
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
    }]


###########################
# api/deposits/{pid}  [GET]
###########################
def test_get_deposit_when_superuser_returns_deposit_that_he_even_has_no_access_to(
        client, users, auth_headers_for_superuser, create_deposit):
    deposit = create_deposit(users['alice_user'], 'alice')

    resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_superuser)

    assert resp.status_code == 200


def test_get_deposit_when_owner_returns_deposit(client, users,
                                                auth_headers_for_user,
                                                create_deposit):
    user = users['alice_user']
    deposit = create_deposit(user, 'alice')

    resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(user))

    assert resp.status_code == 200


def test_get_deposit_when_other_member_of_collaboration_returns_403(
        client, users, auth_headers_for_user, create_deposit):
    user, other_user = users['alice_user'], users['alice_user2']
    deposit = create_deposit(user, 'alice')

    resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 403


@mark.parametrize("action", [("deposit-read"), ("deposit-admin")])
def test_get_deposit_when_user_has_read_or_admin_acces_can_see_deposit(
        action, client, users, auth_headers_for_user, create_deposit):
    user, other_user = users['alice_user'], users['alice_user2']
    deposit = create_deposit(user, 'alice')
    pid = deposit['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    resp = client.get('/deposits/{}'.format(pid),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 403

    deposit.edit_permissions(permissions)

    resp = client.get('/deposits/{}'.format(pid),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 200


@mark.parametrize("action", [("deposit-read"), ("deposit-admin")])
def test_get_deposit_when_user_is_member_of_egroup_with_read_or_admin_acces_can_see_deposit(
        action, client, users, auth_headers_for_user, create_deposit):
    user, other_user = users['alice_user'], users['lhcb_user']
    add_role_to_user(other_user, 'some-egroup@cern.ch')
    deposit = create_deposit(user, 'alice')
    pid = deposit['_deposit']['id']
    permissions = [{
        'email': 'some-egroup@cern.ch',
        'type': 'egroup',
        'op': 'add',
        'action': action
    }]

    resp = client.get('/deposits/{}'.format(pid),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 403

    deposit.edit_permissions(permissions)

    resp = client.get('/deposits/{}'.format(pid),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 200


def test_get_deposit_with_basic_json_serializer_returns_serialized_deposit_properly(
        client, example_user, auth_headers_for_example_user, create_deposit):
    deposit = create_deposit(
        example_user, 'cms', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-v1.0.0.json',
            'basic_info': {
                'analysis_number': 'dream_team',
                'people_info': [{}]
            }
        })
    metadata = deposit.get_record_metadata()

    resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=[('Accept', 'application/basic+json')] +
                      auth_headers_for_example_user)

    assert resp.status_code == 200
    assert resp.json == {
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {
            'basic_info': {
                'people_info': [{}],
                'analysis_number': 'dream_team'
            }
        },
        'pid': deposit['_deposit']['id'],
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
    }


def test_get_deposit_with_permissions_json_serializer_returns_serialized_permissions_properly(
        client, example_user, auth_headers_for_example_user, deposit):
    resp = client.get('/deposits/{}'.format(deposit['_deposit']['id']),
                      headers=[('Accept', 'application/permissions+json')] +
                      auth_headers_for_example_user)

    assert resp.status_code == 200
    assert resp.json == {
        'permissions': {
            'deposit-admin': {
                'roles': [],
                'users': [example_user.email]
            },
            'deposit-read': {
                'roles': [],
                'users': [example_user.email]
            },
            'deposit-update': {
                'roles': [],
                'users': [example_user.email]
            }
        }
    }
