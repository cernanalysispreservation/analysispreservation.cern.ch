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

from pytest import mark
from six import BytesIO


#########################################
# api/deposits/{pid}/files [GET]
#########################################
def test_deposit_files_when_owner_can_see_files_list(app, users,
                                                     auth_headers_for_user,
                                                     json_headers,
                                                     create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1', publish=True)
    pid = deposit['_deposit']['id']

    with app.test_client() as client:
        resp = client.get('/deposits/{}/files'.format(pid),
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 200


def test_deposit_files_when_superuser_can_see_files_list(app, users,
                                                         auth_headers_for_superuser,
                                                         json_headers,
                                                         create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1', publish=True)
    pid = deposit['_deposit']['id']

    with app.test_client() as client:
        resp = client.get('/deposits/{}/files'.format(pid),
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 200


def test_deposit_files_when_other_user_returns_403(app, users,
                                                   auth_headers_for_user,
                                                   json_headers,
                                                   create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1', publish=True)
    pid = deposit['_deposit']['id']

    with app.test_client() as client:
        resp = client.get('/deposits/{}/files'.format(pid),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 403


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-admin"),
])
def test_deposit_files_when_user_has_read_or_admin_permission_can_see_files_list(action,
                                                                                 app,
                                                                                 users,
                                                                                 auth_headers_for_user,
                                                                                 create_deposit,
                                                                                 json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1', publish=True)
    pid = deposit['_deposit']['id']
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

        resp = client.get('/deposits/{}/files'.format(pid),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 200


def test_deposit_files_when_no_files_returns_empty_list(app, users,
                                                        auth_headers_for_user,
                                                        json_headers,
                                                        create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']

    with app.test_client() as client:
        resp = client.get('/deposits/{}/files'.format(pid),
                          headers=auth_headers_for_user(owner))

        assert resp.json == []


def test_deposit_files_returns_list_with_files_info(app, users,
                                                    auth_headers_for_user,
                                                    json_headers,
                                                    create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    deposit.files['file_2.txt'] = BytesIO(b'Hello brave new world!')
    pid = deposit['_deposit']['id']

    with app.test_client() as client:
        resp = client.get('/deposits/{}/files'.format(pid),
                          headers=auth_headers_for_user(owner))
        files = resp.json

        assert files[0]["filename"] == 'file_1.txt'
        assert files[0]["filesize"] == 12

        assert files[1]["filename"] == 'file_2.txt'
        assert files[1]["filesize"] == 22


#########################################
# api/files/{bucket_id} [GET]
#########################################
def test_bucket_read_when_nonexisting_bucket_returns_404(app, users,
                                                         auth_headers_for_user,
                                                         create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')

    with app.test_client() as client:
        resp = client.get('/files/nonexistingbucketid',
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 404


def test_bucket_read_when_owner_of_deposit_can_access(app, users,
                                                      auth_headers_for_user,
                                                      create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.get('/files/{}'.format(bucket),
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 200


def test_bucket_read_when_superuser_can_access(app, users,
                                               auth_headers_for_superuser,
                                               create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.get('/files/{}'.format(bucket),
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 200


def test_bucket_read_when_other_user_returns_404(app, users,
                                                 auth_headers_for_user,
                                                 json_headers,
                                                 create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.get('/files/{}'.format(bucket),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 404


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-update"),
    ("deposit-admin"),
])
def test_bucket_read_when_user_has_read_update_or_admin_access_can_access(action,
                                                                   app,
                                                                   users,
                                                                   auth_headers_for_user,
                                                                   create_deposit,
                                                                   json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']
    bucket = deposit.files.bucket
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

        resp = client.get('/files/{}'.format(bucket),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 200


#########################################
# api/files/{bucket_id}/{filekey} [GET]
#########################################
def test_file_read_when_given_nonexisting_filekey_returns_404(app, users,
                                                              auth_headers_for_user,
                                                              create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.get('/files/{}/non-existing.txt'.format(bucket),
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 404

def test_file_read_when_owner_of_deposit_can_access_file(app, users,
                                                         auth_headers_for_user,
                                                         create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.get('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 200


def test_file_read_when_superuser_can_access_file(app, users,
                                                  auth_headers_for_superuser,
                                                  create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.get('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 200


def test_file_read_when_other_user_returns_404(app, users,
                                               auth_headers_for_user,
                                               json_headers,
                                               create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.get('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 404


@mark.parametrize("action", [
    ("deposit-read"),
    ("deposit-update"),
    ("deposit-admin"),
])
def test_file_read_when_user_has_read_update_or_admin_access_can_access(action,
                                                                 app,
                                                                 users,
                                                                 auth_headers_for_user,
                                                                 create_deposit,
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

    with app.test_client() as client:
        client.post('/deposits/{}/actions/permissions'.format(pid),
                    headers=auth_headers_for_user(owner) + json_headers,
                    data=json.dumps(permissions))

        resp = client.get('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 200


#########################################
# api/files/{bucket_id}/{filekey} [PUT]
#########################################
@mark.skip
def test_file_upload_when_key_already_exists_returns_400(app, users,
                                                         auth_headers_for_user,
                                                         create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.put('/files/{}/file_1.txt'.format(bucket),
                          input_stream= BytesIO(b'Hello world!'),
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 400

def test_file_upload_when_owner_of_deposit_can_upload(app, users,
                                                         auth_headers_for_user,
                                                         create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.put('/files/{}/file_1.txt'.format(bucket),
                          input_stream= BytesIO(b'Hello world!'),
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 200


def test_file_upload_when_superuser_can_upload(app, users,
                                               auth_headers_for_superuser,
                                               create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.put('/files/{}/file_1.txt'.format(bucket),
                          input_stream= BytesIO(b'Hello world!'),
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 200


def test_file_upload_when_other_user_returns_404(app, users,
                                                 auth_headers_for_user,
                                                 json_headers,
                                                 create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.put('/files/{}/file_1.txt'.format(bucket),
                          input_stream= BytesIO(b'Hello world!'),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 404


@mark.parametrize("action", [
    ("deposit-update"),
    ("deposit-admin"),
])
def test_file_upload_when_user_has_update_or_admin_access_can_upload(action,
                                                                     app,
                                                                     users,
                                                                     auth_headers_for_user,
                                                                     create_deposit,
                                                                     json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']
    bucket = deposit.files.bucket
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

        resp = client.put('/files/{}/file_1.txt'.format(bucket),
                          input_stream= BytesIO(b'Hello world!'),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 200


def test_file_upload_when_user_has_only_read_access_returns_404(app,
                                                                  users,
                                                                  auth_headers_for_user,
                                                                  create_deposit,
                                                                  json_headers):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']
    bucket = deposit.files.bucket
    permissions = [{
        'email': other_user.email,
        'type': 'user',
        'op': 'add',
        'action': 'deposit-read'
    }]

    with app.test_client() as client:
        client.post('/deposits/{}/actions/permissions'.format(pid),
                    headers=auth_headers_for_user(owner) + json_headers,
                    data=json.dumps(permissions))

        resp = client.put('/files/{}/file_1.txt'.format(bucket),
                          input_stream= BytesIO(b'Hello world!'),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 404


def test_file_upload_uploads_successfully(app, users,
                                          auth_headers_for_user,
                                          create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        client.put('/files/{}/file_1.txt'.format(bucket),
                   input_stream= BytesIO(b'Hello world!'),
                   headers=auth_headers_for_user(owner))

        resp = client.get('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_user(owner))


        assert resp.status_code == 200
        assert resp.data == 'Hello world!'


#########################################
# api/files/{bucket_id}/{filekey} [DELETE]
#########################################
def test_file_delete_when_key_doesnt_exist_returns_404(app, users,
                                                       auth_headers_for_user,
                                                       create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.delete('/files/{}/nonexisting.txt'.format(bucket),
                             headers=auth_headers_for_user(owner))

        assert resp.status_code == 404

def test_file_delete_when_owner_of_deposit_can_delete(app, users,
                                                         auth_headers_for_user,
                                                         create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.delete('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 204


def test_file_delete_when_superuser_can_delete(app, users,
                                               auth_headers_for_superuser,
                                               create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.delete('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 204


def test_file_delete_when_other_user_returns_404(app, users,
                                                 auth_headers_for_user,
                                                 json_headers,
                                                 create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        resp = client.delete('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 404


@mark.parametrize("action", [
    ("deposit-update"),
    ("deposit-admin"),
])
def test_file_delete_when_user_has_update_or_admin_access_can_delete(action,
                                                                     app,
                                                                     users,
                                                                     auth_headers_for_user,
                                                                     create_deposit,
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

    with app.test_client() as client:
        client.post('/deposits/{}/actions/permissions'.format(pid),
                    headers=auth_headers_for_user(owner) + json_headers,
                    data=json.dumps(permissions))

        resp = client.delete('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 204


def test_file_delete_when_user_has_only_read_access_returns_403(app,
                                                                  users,
                                                                  auth_headers_for_user,
                                                                  create_deposit,
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
        'action': 'deposit-read'
    }]

    with app.test_client() as client:
        client.post('/deposits/{}/actions/permissions'.format(pid),
                    headers=auth_headers_for_user(owner) + json_headers,
                    data=json.dumps(permissions))

        resp = client.delete('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_user(other_user))

        assert resp.status_code == 403


def test_file_delete_delets_successfully(app, users,
                                          auth_headers_for_user,
                                          create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    bucket = deposit.files.bucket

    with app.test_client() as client:
        client.delete('/files/{}/file_1.txt'.format(bucket),
                   headers=auth_headers_for_user(owner))

        resp = client.get('/files/{}/file_1.txt'.format(bucket),
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 404
