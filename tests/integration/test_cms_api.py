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

from flask import current_app
from mock import patch


################
# api/cms/cadi
################
def test_get_cms_cadi_when_user_from_outside_cms_returns_403(app, users,
                                                             auth_headers_for_user):
    with app.test_client() as client:
        user_headers = auth_headers_for_user(users['lhcb_user'])
        resp = client.get('/cms/cadi/EXO-17-023',
                          headers=user_headers)

        assert resp.status_code == 403


@patch('requests.get')
def test_get_cms_cadi_when_non_existing_cadi_number_returns_empty_object(mock_requests, app,
                                                                         auth_headers_for_superuser):
    class MockedResp:
        def json(self):
            return {
                'data': []
            }

    with app.test_client() as client:
        mock_requests.return_value = MockedResp()
        resp = client.get('/cms/cadi/non-existing',
                          headers=auth_headers_for_superuser)

        assert json.loads(resp.data) == {}


@patch('requests.get')
def test_get_cms_cadi_when_existing_cadi_number_returns_object_with_ana_data(mock_requests, app,
                                                                             auth_headers_for_superuser):
    ana_data = {
        'code': 'dAna-Num',
        'conferences': []
    }

    class MockedResp:
        def json(self):
            return {
                'data': [ana_data]
            }

    with app.test_client() as client:
        mock_requests.return_value = MockedResp()
        resp = client.get('/cms/cadi/Ana-Num',
                          headers=auth_headers_for_superuser)

        assert json.loads(resp.data) == ana_data


@patch('requests.get')
def test_get_cms_cadi_calls_cadi_api_with_correct_url(mock_requests, app,
                                                      auth_headers_for_superuser):
    api_url = current_app.config['CADI_GET_RECORD_URL']
    ana_num = 'Ana-Num'
    with app.test_client() as client:
        client.get('/cms/cadi/{}'.format(ana_num),
                   headers=auth_headers_for_superuser)

        mock_requests.assert_called_with(url=api_url + ana_num.upper())
