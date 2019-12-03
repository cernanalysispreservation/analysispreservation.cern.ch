# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2007 CERN.
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
"""Integration tests for files methods for deposits."""

import json

from flask import current_app
from pytest import mark
from six import BytesIO


#########################################
# api/deposits/{pid}/files [GET]
#########################################
def test_deposit_files_when_owner_can_see_files_list(client, users,
                                                     auth_headers_for_user,
                                                     create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']

    resp = client.get('/deposits/{}/files'.format(pid),
                      headers=auth_headers_for_user(owner))

    assert resp.status_code == 200
    bucket = resp.json

    assert bucket['id'] == str(deposit.files.bucket)
    assert bucket['locked'] is False
    assert bucket['contents'] == []


def test_deposit_files_when_other_user_returns_404(client, users,
                                                   auth_headers_for_user,
                                                   create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']

    resp = client.get('/deposits/{}/files'.format(pid),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 404


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-admin"),
])
def test_deposit_files_when_user_has_read_or_admin_permission_can_see_files_list(
        action, client, users, auth_headers_for_user, json_headers,
        create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    client.post('/deposits/{}/actions/permissions'.format(pid),
                headers=auth_headers_for_user(owner) + json_headers,
                data=json.dumps(permissions))

    resp = client.get('/deposits/{}/files'.format(pid),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 200


#########################################
# api/deposits/{pid}/files/{filekey} [GET]
#########################################
def test_file_read_when_given_nonexisting_filekey_returns_404(
        client, users, auth_headers_for_user, create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner,
                             'test-analysis-v0.0.1',
                             files={'file_1.txt': BytesIO(b'Hello world!')})
    pid = deposit['_deposit']['id']

    resp = client.get('/deposits/{}/files/non-existing.txt'.format(pid),
                      headers=auth_headers_for_user(owner))

    assert resp.status_code == 404


def test_file_read_when_owner_of_deposit_can_access_file(
        client, users, auth_headers_for_user, create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner,
                             'test-analysis-v0.0.1',
                             files={'file_1.txt': BytesIO(b'Hello world!')})
    pid = deposit['_deposit']['id']

    resp = client.get('/deposits/{}/files/file_1.txt'.format(pid),
                      headers=auth_headers_for_user(owner))

    assert resp.status_code == 200
    assert resp.data == 'Hello world!'


def test_file_read_when_other_user_returns_404(client, users,
                                               auth_headers_for_user,
                                               create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    resp = client.get('/files/{}/file_1.txt'.format(bucket),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 404


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-update"),
    ("deposit-admin"),
])
def test_file_read_when_user_has_read_update_or_admin_access_can_access(
        action, client, users, auth_headers_for_user, create_deposit,
        json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    pid = deposit['_deposit']['id']
    bucket = deposit.files.bucket
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    client.post('/deposits/{}/actions/permissions'.format(pid),
                headers=auth_headers_for_user(owner) + json_headers,
                data=json.dumps(permissions))

    resp = client.get('/files/{}/file_1.txt'.format(bucket),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 200


#########################################
# api/deposits/{pid}/files/{filekey} [PUT]
#########################################
def test_file_upload_when_key_already_exists_returns_400(
        client, users, auth_headers_for_user, create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner,
                         'test-analysis-v0.0.1',
                         files={'file_1.txt': BytesIO(b'Hello world!')
                                })['_deposit']['id']

    resp = client.put('/deposits/{}/files/file_1.txt'.format(pid),
                      input_stream=BytesIO(b'Updated Hello world!'),
                      headers=auth_headers_for_user(owner))

    assert resp.status_code == 200

    resp = client.get('/deposits/{}/files/file_1.txt'.format(pid),
                      headers=auth_headers_for_user(owner))

    assert resp.status_code == 200
    assert resp.data == 'Updated Hello world!'


def test_file_upload_when_other_user_returns_404(client, users,
                                                 auth_headers_for_user,
                                                 create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    pid = create_deposit(owner,
                         'test-analysis-v0.0.1',
                         files={'file_1.txt': BytesIO(b'Hello world!')
                                })['_deposit']['id']

    resp = client.put('/deposits/{}/files/file_1.txt'.format(pid),
                      input_stream=BytesIO(b'Hello world!'),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 404


def test_file_upload_when_owner_of_deposit_can_upload(client, users,
                                                      auth_headers_for_user,
                                                      create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']

    resp = client.put('/deposits/{}/files/file_1.txt'.format(pid),
                      input_stream=BytesIO(b'Hello world!'),
                      headers=auth_headers_for_user(owner))

    assert resp.status_code == 200


@mark.parametrize("action", [
    ("deposit-update"),
    ("deposit-admin"),
])
def test_file_upload_when_user_has_update_or_admin_access_can_upload(
        action, client, users, auth_headers_for_user, create_deposit,
        json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    client.post('/deposits/{}/actions/permissions'.format(pid),
                headers=auth_headers_for_user(owner) + json_headers,
                data=json.dumps(permissions))

    resp = client.put('/deposits/{}/files/file_1.txt'.format(pid),
                      input_stream=BytesIO(b'Hello world!'),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 200


def test_file_upload_when_user_has_only_read_access_returns_404(
        client, users, auth_headers_for_user, create_deposit, json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-read'
    }]

    client.post('/deposits/{}/actions/permissions'.format(pid),
                headers=auth_headers_for_user(owner) + json_headers,
                data=json.dumps(permissions))

    resp = client.put('/deposits/{}/files/file_1.txt'.format(pid),
                      input_stream=BytesIO(b'Hello world!'),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 404


def test_put_header_tags(client, users, auth_headers_for_user, create_deposit):
    """Test upload of an object with tags in the headers."""
    headers = [
        (current_app.config['FILES_REST_FILE_TAGS_HEADER'],
         'key1=val1;key2=val2;key3=val3'),
    ]

    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']

    resp = client.put(
        '/deposits/{}/files/file_1.txt'.format(pid),
        input_stream=BytesIO(b'updated_content'),
        headers=headers + auth_headers_for_user(owner),
    )

    assert resp.status_code == 200

    resp = client.get(
        'deposits/{}/files/'.format(pid),
        headers=auth_headers_for_user(owner),
    )

    tags = resp.json.get('contents', [{}])[0].get('tags', {})

    assert tags['key1'] == 'val1'
    assert tags['key2'] == 'val2'
    assert tags['key3'] == 'val3'


def test_put_header_invalid_tags(client, users, auth_headers_for_user,
                                 create_deposit):
    """Test upload of an object with tags in the headers."""
    header_name = current_app.config['FILES_REST_FILE_TAGS_HEADER']
    # We don't test zero-length values/keys, because they are filtered out
    # from parse_qsl
    invalid = [
        ('a' * 256, 'valid'),
        ('valid', 'b' * 256),
    ]

    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']

    # Invalid key or values
    for k, v in invalid:
        resp = client.put('/deposits/{}/files/file_1.txt'.format(pid),
                          input_stream=BytesIO(b'updated_content'),
                          headers=[(header_name, '{}={}'.format(k, v))] +
                          auth_headers_for_user(owner))

        assert resp.status_code == 400

    # Duplicate key
    resp = client.put('/deposits/{}/files/file_1.txt'.format(pid),
                      input_stream=BytesIO(b'updated_content'),
                      headers=[(header_name, 'a=1&a=2')] +
                      auth_headers_for_user(owner))

    assert resp.status_code == 400


#########################################
# api/deposits/{pid}/files/{filekey} [DELETE]
#########################################
def test_file_delete_when_key_doesnt_exist_returns_404(client, users,
                                                       auth_headers_for_user,
                                                       create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner, 'test-analysis-v0.0.1')['_deposit']['id']

    resp = client.delete('/deposits/{}/files/nonexisting.txt'.format(pid),
                         headers=auth_headers_for_user(owner))

    assert resp.status_code == 404


def test_file_delete_when_owner_of_deposit_can_delete(client, users,
                                                      auth_headers_for_user,
                                                      create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner,
                         'test-analysis-v0.0.1',
                         files={'file_1.txt': BytesIO(b'Hello world!')
                                })['_deposit']['id']

    resp = client.delete('/deposits/{}/files/file_1.txt'.format(pid),
                         headers=auth_headers_for_user(owner))

    assert resp.status_code == 204


@mark.parametrize("action,status_code", [
    ("deposit-update", 204),
    ("deposit-admin", 204),
    ("deposit-read", 403),
])
def test_file_delete_when_user_has_update_admin_or_read_access(
        action, status_code, client, users, auth_headers_for_user,
        create_deposit, json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    pid = create_deposit(owner,
                         'test-analysis-v0.0.1',
                         files={'file_1.txt': BytesIO(b'Hello world!')
                                })['_deposit']['id']
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    client.post('/deposits/{}/actions/permissions'.format(pid),
                headers=auth_headers_for_user(owner) + json_headers,
                data=json.dumps(permissions))

    resp = client.delete('/deposits/{}/files/file_1.txt'.format(pid),
                         headers=auth_headers_for_user(other_user))

    assert resp.status_code == status_code


def test_file_delete_deletes_successfully(client, users, auth_headers_for_user,
                                          create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner,
                         'test-analysis-v0.0.1',
                         files={'file_1.txt': BytesIO(b'Hello world!')
                                })['_deposit']['id']

    resp = client.delete('/deposits/{}/files/file_1.txt'.format(pid),
                         headers=auth_headers_for_user(owner))

    assert resp.status_code == 204

    resp = client.get('/deposits/{}/files/file_1.txt'.format(pid),
                      headers=auth_headers_for_user(owner))

    assert resp.status_code == 404


#########################################
# /api/deposits/${draft_id}/actions/upload [POST]
#########################################
@mark.parametrize("type", ["url", "repo"])
def test_upload_file_in_deposit_via_external_url_returns_400_when_url_is_not_correct(
        type, client, users, auth_headers_for_user, json_headers,
        create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner, 'test-analysis-v0.0.1')['_deposit']['id']
    data = {'url': 'https://dream.team', 'type': type}

    resp = client.post('/deposits/{}/actions/upload'.format(pid),
                       headers=auth_headers_for_user(owner) + json_headers,
                       data=json.dumps(data))

    assert resp.status_code == 400
