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
from invenio_search import current_search
from mock import patch


#############
# EXAMPLE
#############
def test_example(app, users, auth_headers_for_user, json_headers):
    """ Example test to show how to set up tests for API calls."""
    with app.test_client() as client:
        auth_headers = auth_headers_for_user(users['superuser'])
        headers = auth_headers 

        resp = client.get('/ping', headers=headers)

        assert resp.status_code == 200
        assert resp.data == 'Pong'


########################################
# api/deposits/{pid}/actions/publish
########################################
def test_get_deposits_when_published_other_member_can_see_it(app, db, users,
                                                             auth_headers_for_user,
                                                             json_headers,
                                                             create_deposit):
    with app.test_client() as client:
        user_headers = auth_headers_for_user(users['lhcb_user']) + json_headers
        other_user_headers = auth_headers_for_user(users['lhcb_user2']) + json_headers
        deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
        pid = deposit['_deposit']['id']

        # creator can see it
        resp = client.get('/deposits/{}'.format(pid),
                          headers=user_headers)

        assert resp.status_code == 200

        # other members of collaboration cant see it
        resp = client.get('/deposits/{}'.format(pid),
                          headers=other_user_headers)

        assert resp.status_code == 403

        # publish
        pid = deposit['_deposit']['id']
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=user_headers)

        # creator can see published one under api/records
        resp = client.get('/records/{}'.format(deposit['_deposit']['pid']['value']),
                          headers=user_headers)

        assert resp.status_code == 200

        # once deposit has been published other members can see it as well
        resp = client.get('/records/{}'.format(deposit['_deposit']['pid']['value']),
                          headers=other_user_headers)

        assert resp.status_code == 200


def test_deposit_when_published_status_changed_and_record_created(app, db, location, users,
                                                                  auth_headers_for_user,
                                                                  create_deposit):
    with app.test_client() as client:
        user_headers = auth_headers_for_user(users['lhcb_user'])
        deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
        pid = deposit['_deposit']['id']

        # publish a deposit
        resp = client.post('/deposits/{}/actions/publish'.format(pid),
                           headers=user_headers)

        resp = client.get('/records/{}'.format(deposit['_deposit']['pid']['value']),
                          headers=user_headers)

        res = json.loads(resp.data)

        assert resp.status_code == 200

        assert 'control_number' in res['metadata']

        assert 'published' in res['metadata']['_deposit']['status']
