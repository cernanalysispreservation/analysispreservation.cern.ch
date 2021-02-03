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

"""Integration tests for CERN OIDC api."""

from cap.modules.auth.config import OIDC_API
import responses
from mock import patch


@patch('cap.modules.services.views.cern.get_oidc_token')
@responses.activate
def test_get_users_by_name(mock_token, app, auth_headers_for_superuser):
    endpoint = OIDC_API['ACCOUNT']
    mock_token.return_value = 'test-token'
    responses.add(
        responses.GET,
        f'{endpoint}?filter=displayName:contains:test',
        json={
            "pagination": {
                "total": 1,
                "offset": 0,
                "limit": 1000
            },
            "data": [{
                'personId': None,
                'displayName': 'Ilias Koutsakis',
                'uniqueIdentifier': 'ilkoutsa',
                'identityId': 'f69e214c-4339-4744-83f1-94feefd46812',
                'accountProviderId': 'f0000000-0000-0000-0000-000000000011',
                'emailAddress': 'ilias.koutsakis@cern.ch',
                'resetPasswordRequired': False,
                'resourceCategory': 'Personal',
                'reassignable': False,
                'autoReassign': False,
                'id': '9c72b121-1dd2-4374-a0c6-aae975140b37'}]
        },
        status=200)

    with app.test_client() as client:
        resp = client.get('services/oidc/user?query=test',
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 200
        assert len(resp.json) == 1
        assert resp.json == ['ilias.koutsakis@cern.ch']


@patch('cap.modules.services.views.cern.get_oidc_token')
@responses.activate
def test_get_users_by_name_no_query_exception(mock_token, app, auth_headers_for_superuser):
    mock_token.return_value = 'test-token'

    with app.test_client() as client:
        resp = client.get('services/oidc/user?query=',
                          headers=auth_headers_for_superuser)
        assert resp.json == []


@patch('cap.modules.services.views.cern.get_oidc_token')
@responses.activate
def test_get_groups_by_name(mock_token, app, auth_headers_for_superuser):
    endpoint = OIDC_API['GROUP']
    mock_token.return_value = 'test-token'
    responses.add(
        responses.GET,
        f'{endpoint}?filter=displayName:contains:test',
        json={
            "pagination": {
                "total": 2,
                "offset": 0,
                "limit": 1000,
            },
            "data": [{
                "groupIdentifier": "do-32489-rcs-sis-firms",
                "displayName": "rcs-sis-test",
                "description": "DO-32489-RCS-SIS-Firms",
                "ownerId": "c66cc763-b14b-45ea-bec5-59715bf882da",
                "administratorsId": "08d779a7-252c-7b7d-763c-2d1597f3f71e",
                "source": "cern",
                "syncType": "Slave",
                "id": "08d7fcbf-66eb-4664-80e9-a3aef2671d7d"
            }]
        },
        status=200)

    with app.test_client() as client:
        resp = client.get('services/oidc/group?query=test',
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 200
        assert len(resp.json) == 1
        assert resp.json == ['do-32489-rcs-sis-firms@cern.ch']


@patch('cap.modules.services.views.cern.get_oidc_token')
@responses.activate
def test_get_groups_by_name_no_query_exception(mock_token, app, auth_headers_for_superuser):
    mock_token.return_value = 'test-token'

    with app.test_client() as client:
        resp = client.get('services/oidc/group?query=',
                          headers=auth_headers_for_superuser)
        assert resp.json == []


@patch('cap.modules.services.views.cern.get_oidc_token')
@responses.activate
def test_no_token_access_denied(mock_token, app, auth_headers_for_superuser):
    endpoint = OIDC_API['GROUP']
    mock_token.return_value = None
    responses.add(
        responses.GET,
        f'{endpoint}?filter=displayName:contains:test',
        status=401)

    with app.test_client() as client:
        resp = client.get('services/oidc/group?query=test',
                          headers=auth_headers_for_superuser)
        assert resp.status_code == 401


@patch('cap.modules.services.views.cern.get_oidc_token')
@responses.activate
def test_exception_thrown_on_api_error(mock_token, app, auth_headers_for_superuser):
    endpoint = OIDC_API['GROUP']
    mock_token.return_value = 'test-token'
    responses.add(responses.GET,
                  f'{endpoint}?filter=displayName:contains:test',
                  status=503)

    with app.test_client() as client:
        resp = client.get('services/oidc/group?query=test',
                          headers=auth_headers_for_superuser)
    assert resp.status_code == 503


@responses.activate
def test_get_token_server_error(app, auth_headers_for_superuser):
    responses.add(responses.POST,
                  OIDC_API['TOKEN'],
                  status=500)

    with app.test_client() as client:
        resp = client.get('services/oidc/user?query=test',
                          headers=auth_headers_for_superuser)
        assert resp.status_code == 500
