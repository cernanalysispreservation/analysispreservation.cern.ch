# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2020 CERN.
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

"""Integration tests for Zenodo Upload API."""
import json
import re
from flask import current_app
from invenio_pidstore.resolver import Resolver

import responses
from mock import patch

from cap.modules.deposit.api import CAPDeposit


@patch('cap.modules.deposit.api._fetch_token', return_value='test-token')
@responses.activate
def test_create_and_upload_to_zenodo(mock_token, app, users, deposit_with_file,
                                     auth_headers_for_user, json_headers):
    user = users['cms_user']
    headers = auth_headers_for_user(user) + json_headers
    zenodo_server_url = current_app.config.get('ZENODO_SERVER_URL')
    pid = deposit_with_file['_deposit']['id']
    bucket = deposit_with_file.files.bucket

    # MOCK RESPONSES FROM ZENODO SERVER
    # first the deposit creation
    responses.add(responses.POST,
                  f'{zenodo_server_url}/deposit/depositions',
                  json={
                      'id': 111,
                      'record_id': 111,
                      'title': '',
                      'links': {
                          'bucket': 'http://zenodo-test.com/test-bucket',
                          'html': 'https://sandbox.zenodo.org/deposit/111',
                          'publish': 'https://sandbox.zenodo.org/api/deposit/depositions/111/actions/publish',
                          'self': 'https://sandbox.zenodo.org/api/deposit/depositions/111'
                      },
                      'files': [],
                      'created': '2020-11-20T11:49:39.147767+00:00'
                  },
                  status=200)

    # then the file upload
    responses.add(responses.PUT,
                  'http://zenodo-test.com/test-bucket/test-file.txt',
                  json={
                      'mimetype': 'application/octet-stream',
                      'links': {
                          'self': 'https://sandbox.zenodo.org/api/files/test-bucket/test-file.txt',
                          'uploads': 'https://sandbox.zenodo.org/api/files/test-bucket/test-file.txt?uploads'
                      },
                      'key': 'test-file.txt',
                      'size': 100
                  },
                  status=200)

    # fix because responses makes request to ES, and deposit.commit() won't work without it
    responses.add_callback(
        responses.PUT,
        re.compile(r'http://localhost:9200/deposits-records-test-schema-v1\.0\.0/'
                   r'test-schema-v1\.0\.0/(.*)?version=(.*)&version_type=external_gte'),
        callback=lambda req: (200, {}, json.dumps({})),
        content_type='application/json',
    )

    # create the zenodo deposit
    with app.test_client() as client:
        resp = client.post(f'/deposits/{pid}/actions/upload',
                           data=json.dumps(dict(target='zenodo',
                                                bucket=str(bucket),
                                                files=['test-file.txt'])),
                           headers=headers)
        assert resp.status_code == 201

        resolver = Resolver(pid_type='depid',
                            object_type='rec',
                            getter=lambda x: x)
        _, uuid = resolver.resolve(pid)
        record = CAPDeposit.get_record(uuid)

        assert len(record['_zenodo']) == 1
        assert record['_zenodo'][0]['id'] == 111
        assert record['_zenodo'][0]['title'] == None
        assert record['_zenodo'][0]['created'] == '2020-11-20T11:49:39.147767+00:00'


@patch('cap.modules.deposit.api._fetch_token', return_value='test-token')
@responses.activate
def test_create_and_upload_to_zenodo_with_data(mock_token, app, users, deposit_with_file,
                                               auth_headers_for_user, json_headers):
    user = users['cms_user']
    headers = auth_headers_for_user(user) + json_headers
    zenodo_server_url = current_app.config.get('ZENODO_SERVER_URL')
    pid = deposit_with_file['_deposit']['id']
    bucket = deposit_with_file.files.bucket

    # MOCK RESPONSES FROM ZENODO SERVER
    # first the deposit creation
    responses.add(responses.POST,
                  f'{zenodo_server_url}/deposit/depositions',
                  json={
                      'id': 111,
                      'record_id': 111,
                      'submitted': False,
                      'title': '',
                      'links': {
                          'bucket': 'http://zenodo-test.com/test-bucket',
                          'html': 'https://sandbox.zenodo.org/deposit/111',
                          'publish': 'https://sandbox.zenodo.org/api/deposit/depositions/111/actions/publish',
                          'self': 'https://sandbox.zenodo.org/api/deposit/depositions/111'
                      },
                      'metadata': {
                          'description': 'This is my first upload',
                          'title': 'test-title'
                      },
                      'files': [],
                      'created': '2020-11-20T11:49:39.147767+00:00'
                  },
                  status=200)

    # then the file upload
    responses.add(responses.PUT,
                  'http://zenodo-test.com/test-bucket/test-file.txt',
                  json={
                      'mimetype': 'application/octet-stream',
                      'links': {
                          'self': 'https://sandbox.zenodo.org/api/files/test-bucket/test-file.txt',
                          'uploads': 'https://sandbox.zenodo.org/api/files/test-bucket/test-file.txt?uploads'
                      },
                      'key': 'test-file.txt',
                      'size': 100
                  },
                  status=200)

    # fix because responses makes request to ES, and deposit.commit() won't work without it
    responses.add_callback(
        responses.PUT,
        re.compile(r'http://localhost:9200/deposits-records-test-schema-v1\.0\.0/'
                   r'test-schema-v1\.0\.0/(.*)?version=(.*)&version_type=external_gte'),
        callback=lambda req: (200, {}, json.dumps({})),
        content_type='application/json',
    )

    # create the zenodo deposit
    with app.test_client() as client:
        resp = client.post(f'/deposits/{pid}/actions/upload',
                           data=json.dumps(dict(target='zenodo',
                                                bucket=str(bucket),
                                                files=['test-file.txt'],
                                                zenodo_data={
                                                    'title': 'test-title',
                                                    'description': 'This is my first upload'
                                                })),
                           headers=headers)
        assert resp.status_code == 201

        resolver = Resolver(pid_type='depid',
                            object_type='rec',
                            getter=lambda x: x)
        _, uuid = resolver.resolve(pid)
        record = CAPDeposit.get_record(uuid)

        assert len(record['_zenodo']) == 1
        assert record['_zenodo'][0]['id'] == 111
        assert record['_zenodo'][0]['title'] == 'test-title'
        assert record['_zenodo'][0]['created'] == '2020-11-20T11:49:39.147767+00:00'


@patch('cap.modules.deposit.api._fetch_token', return_value='test-token')
@responses.activate
def test_create_deposit_with_wrong_data(mock_token, app, users, deposit_with_file,
                                     auth_headers_for_user, json_headers):
    user = users['cms_user']
    headers = auth_headers_for_user(user) + json_headers
    zenodo_server_url = current_app.config.get('ZENODO_SERVER_URL')
    pid = deposit_with_file['_deposit']['id']
    bucket = deposit_with_file.files.bucket

    responses.add(responses.POST,
                  f'{zenodo_server_url}/deposit/depositions',
                  json={
                      'status': 400,
                      'message': 'Validation error.',
                      'errors': [
                          {'field': 'test', 'message': 'Unknown field name.'}
                      ]},
                  status=400)

    with app.test_client() as client:
        resp = client.post(f'/deposits/{pid}/actions/upload',
                           data=json.dumps(dict(target='zenodo',
                                                bucket=str(bucket),
                                                files=['test-file.txt'],
                                                zenodo_data={'test': 'test'})),
                           headers=headers)
        assert resp.status_code == 400
        assert resp.json['message'] == 'Validation error on creating the Zenodo deposit.'
        assert resp.json['errors'] == [{'field': 'test', 'message': 'Unknown field name.'}]


@patch('cap.modules.deposit.api._fetch_token', return_value='test-token')
@responses.activate
def test_zenodo_upload_authorization_failure(mock_token, app, users, deposit_with_file,
                                             auth_headers_for_user, json_headers):
    user = users['cms_user']
    headers = auth_headers_for_user(user) + json_headers
    zenodo_server_url = current_app.config.get('ZENODO_SERVER_URL')
    pid = deposit_with_file['_deposit']['id']
    bucket = deposit_with_file.files.bucket

    responses.add(responses.POST,
                  f'{zenodo_server_url}/deposit/depositions',
                  json={},
                  status=401)

    with app.test_client() as client:
        resp = client.post(f'/deposits/{pid}/actions/upload',
                           data=json.dumps(dict(target='zenodo',
                                                bucket=str(bucket),
                                                files=['test-file.txt'])),
                           headers=headers)
        assert resp.status_code == 401
        assert resp.json['message'] == 'Authorization to Zenodo failed. Please reconnect.'


@patch('cap.modules.deposit.api._fetch_token', return_value='test-token')
@responses.activate
def test_zenodo_upload_deposit_not_created_error(mock_token, app, users, deposit_with_file,
                                                 auth_headers_for_user, json_headers):
    user = users['cms_user']
    headers = auth_headers_for_user(user) + json_headers
    zenodo_server_url = current_app.config.get('ZENODO_SERVER_URL')
    pid = deposit_with_file['_deposit']['id']
    bucket = deposit_with_file.files.bucket

    responses.add(responses.POST,
                  f'{zenodo_server_url}/deposit/depositions',
                  json={},
                  status=500)

    with app.test_client() as client:
        resp = client.post(f'/deposits/{pid}/actions/upload',
                           data=json.dumps(dict(target='zenodo',
                                                bucket=str(bucket),
                                                files=['test-file.txt'])),
                           headers=headers)
        assert resp.status_code == 400
        assert resp.json['message'] == 'Something went wrong, Zenodo deposit not created.'


@patch('cap.modules.deposit.api._fetch_token', return_value='test-token')
@responses.activate
def test_zenodo_upload_file_not_uploaded_error(mock_token, app, users, deposit_with_file,
                                               auth_headers_for_user, json_headers, capsys):
    user = users['cms_user']
    headers = auth_headers_for_user(user) + json_headers
    zenodo_server_url = current_app.config.get('ZENODO_SERVER_URL')
    pid = deposit_with_file['_deposit']['id']
    bucket = deposit_with_file.files.bucket

    responses.add(responses.POST,
                  f'{zenodo_server_url}/deposit/depositions',
                  json={
                      'id': 111,
                      'record_id': 111,
                      'submitted': False,
                      'title': '',
                      'links': {
                          'bucket': 'http://zenodo-test.com/test-bucket',
                          'html': 'https://sandbox.zenodo.org/deposit/111',
                          'publish': 'https://sandbox.zenodo.org/api/deposit/depositions/111/actions/publish',
                          'self': 'https://sandbox.zenodo.org/api/deposit/depositions/111'
                      },
                      'files': [],
                      'created': '2020-11-20T11:49:39.147767+00:00'
                  },
                  status=200)

    responses.add(responses.PUT,
                  'http://zenodo-test.com/test-bucket/test-file.txt',
                  json={},
                  status=500)

    responses.add_callback(
        responses.PUT,
        re.compile(r'http://localhost:9200/deposits-records-test-schema-v1\.0\.0/'
                   r'test-schema-v1\.0\.0/(.*)?version=(.*)&version_type=external_gte'),
        callback=lambda req: (200, {}, json.dumps({})),
        content_type='application/json',
    )

    with app.test_client() as client:
        resp = client.post(f'/deposits/{pid}/actions/upload',
                           data=json.dumps(dict(target='zenodo',
                                                bucket=str(bucket),
                                                files=['test-file.txt'])),
                           headers=headers)
        assert resp.status_code == 201

        captured = capsys.readouterr()
        assert 'Uploading file test-file.txt to deposit 111 failed with 500' \
               in captured.err


@patch('cap.modules.deposit.api._fetch_token', return_value='test-token')
@responses.activate
def test_zenodo_upload_empty_files(mock_token, app, users, deposit_with_file,
                                   auth_headers_for_user, json_headers):
    user = users['cms_user']
    zenodo_server_url = current_app.config.get('ZENODO_SERVER_URL')
    headers = auth_headers_for_user(user) + json_headers
    pid = deposit_with_file['_deposit']['id']
    bucket = deposit_with_file.files.bucket

    responses.add(responses.POST,
                  f'{zenodo_server_url}/deposit/depositions',
                  json={
                      'id': 111,
                      'record_id': 111,
                      'submitted': False,
                      'title': '',
                      'links': {
                          'bucket': 'http://zenodo-test.com/test-bucket',
                          'html': 'https://sandbox.zenodo.org/deposit/111',
                          'publish': 'https://sandbox.zenodo.org/api/deposit/depositions/111/actions/publish',
                          'self': 'https://sandbox.zenodo.org/api/deposit/depositions/111'
                      },
                      'files': []
                  },
                  status=200)

    with app.test_client() as client:
        resp = client.post(f'/deposits/{pid}/actions/upload',
                           data=json.dumps(dict(target='zenodo',
                                                bucket=str(bucket),
                                                files=[])),
                           headers=headers)
        assert resp.status_code == 400
        assert resp.json['message'] == 'You cannot create an empty Zenodo deposit. Please add some files.'


@patch('cap.modules.deposit.api._fetch_token', return_value=None)
def test_zenodo_upload_no_token(mock_token, app, users, deposit_with_file,
                                auth_headers_for_user, json_headers):
    user = users['cms_user']
    headers = auth_headers_for_user(user) + json_headers
    pid = deposit_with_file['_deposit']['id']
    bucket = deposit_with_file.files.bucket

    with app.test_client() as client:
        resp = client.post(f'/deposits/{pid}/actions/upload',
                           data=json.dumps(dict(target='zenodo',
                                                bucket=str(bucket),
                                                files=['test-file.txt'])),
                           headers=headers)
        assert resp.status_code == 400
        assert resp.json['message'] == 'Please connect your Zenodo account before creating a deposit.'


@patch('cap.modules.deposit.api._fetch_token', return_value='test-token')
def test_zenodo_upload_no_access(mock_token, app, users, deposit_with_file,
                                 auth_headers_for_user, json_headers):
    user = users['lhcb_user']
    headers = auth_headers_for_user(user) + json_headers
    pid = deposit_with_file['_deposit']['id']
    bucket = deposit_with_file.files.bucket

    with app.test_client() as client:
        resp = client.post(f'/deposits/{pid}/actions/upload',
                           data=json.dumps(dict(target='zenodo',
                                                bucket=str(bucket),
                                                files=['test-file.txt'])),
                           headers=headers)
        assert resp.status_code == 403
