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
import json


##########
# api/me
##########
def test_me_when_user_not_logged_in_returns_401(app):
    with app.test_client() as client:
        resp = client.get('/me')

        assert resp.status_code == 401


#def test_me_when_superuser_returns_correct_user_data(app,
#                                                     auth_headers_for_superuser,
#                                                     superuser_me_data):
#    with app.test_client() as client:
#        resp = client.get('/me',
#                          headers=auth_headers_for_superuser)
#
#        assert resp.status_code == 200
#        assert json.loads(resp.data) == superuser_me_data


def test_me_when_cms_user_returns_correct_user_data(app, users,
                                                    auth_headers_for_user,
                                                    cms_user_me_data):
    with app.test_client() as client:
        user_headers = auth_headers_for_user(users['cms_user'])
        resp = client.get('/me',
                          headers=user_headers)

        assert json.loads(resp.data) == cms_user_me_data
