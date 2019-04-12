# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
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

"""Tests for atlas utils methods."""
from __future__ import absolute_import, print_function

import base64

import responses
from flask import current_app

from cap.modules.experiments.views.atlas import get_glance_token


@responses.activate
def test_get_glance_token(app):
    client_id = current_app.config.get('GLANCE_CLIENT_ID')
    client_token = current_app.config.get('GLANCE_CLIENT_PASSWORD')
    basic_auth = base64.b64encode('{}:{}'.format(client_id, client_token))
    access_token = 'some-token'
    responses.add(responses.POST,
                  current_app.config.get('GLANCE_GET_TOKEN_URL'),
                  status=200,
                  json = {
                      'access_token': access_token,
                      'token_type': 'bearer',
                      'expires_in': 3600
                  })

    assert get_glance_token() == access_token

    assert responses.calls[0].request.body == 'grant_type=client_credentials'
    assert responses.calls[0].request.headers['Authorization'] == \
        'Basic {}'.format(basic_auth)


@responses.activate
def test_get_glance_token_when_glance_server_down_returns_503(app):
    access_token = 'some-token'
    responses.add(responses.POST,
                  current_app.config.get('GLANCE_GET_TOKEN_URL'),
                  status=500)

    assert get_glance_token() == None
