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
#

"""Authentication utils for CAP."""

from __future__ import absolute_import, print_function

import requests
from flask import current_app, abort
from flask_login import current_user

from .config import OIDC_API
from .models import OAuth2Token


def _create_or_update_token(name, token):
    _token = OAuth2Token.get(name=name, user_id=current_user.id)
    if not _token:
        _token = OAuth2Token(name=name, user_id=current_user.id)
    _token.token_type = token.get('token_type', 'bearer')
    _token.access_token = token.get('access_token')
    _token.refresh_token = token.get('refresh_token')
    _token.expires_at = token.get('expires_at')

    return _token


def get_oidc_token():
    """Retrieve the token in order to use the CAP OIDC client to get info."""
    resp = requests.post(
        url=OIDC_API['TOKEN'],
        headers={
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data={
            'client_id': current_app.config.get('CERN_CLIENT_ID'),
            'client_secret': current_app.config.get('CERN_CLIENT_SECRET'),
            'grant_type': 'client_credentials',
            'audience': 'authorization-service-api'
        }
    )

    if not resp.ok:
        abort(resp.status_code, 'Error on retrieving the app token.')

    return resp.json()['access_token']
