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

"""Unit tests Cap Deposit api."""

from __future__ import absolute_import, print_function

import json

from invenio_search import current_search


def test_example(app, users, auth_headers_for_user):
    """ Example test to show how to set up tests for API calls."""
    with app.test_client() as client:
        headers = auth_headers_for_user(users['superuser'])
        resp = client.get('/ping', headers=headers)

        assert resp.status_code == 200
        assert "Pong" in resp.data


def test_get_deposits_when_user_not_logged_in_returns_403(app, users, json_headers):
    with app.test_client() as client:
        resp = client.get('/deposits/', headers=json_headers)

        assert resp.status_code == 403


def test_get_deposits_when_superuser_returns_all_deposits(app, users,
                                                          auth_headers_for_superuser,
                                                          create_deposit):
    with app.test_client() as client:
        deposits = [
            create_deposit(users['cms_user'], 'cms-analysis-v0.0.1'),
            create_deposit(users['cms_user'], 'cms-questionnaire-v0.0.1'),
            create_deposit(users['cms_user'], 'cms-auxiliary-measurements-v0.0.1'),
            create_deposit(users['lhcb_user'], 'lhcb-v0.0.1'),
            create_deposit(users['alice_user'], 'alice-analysis-v0.0.1'),
            create_deposit(users['atlas_user'], 'atlas-analysis-v0.0.1'),
            create_deposit(users['atlas_user'], 'atlas-workflows-v0.0.1'),
        ]

        resp = client.get('/deposits/', headers=auth_headers_for_superuser)
        hits = json.loads(resp.data)['hits']['hits']

        assert resp.status_code == 200
        assert len(hits) == len(deposits)


def test_get_deposits_when_normal_user_returns_only_his_deposits(app, db, users,
                                                                 auth_headers_for_user,
                                                                 create_deposit):
    with app.test_client() as client:
        user_deposits_ids = [x['_deposit']['id'] for x in [
            create_deposit(users['cms_user'], 'cms-analysis-v0.0.1'),
            create_deposit(users['cms_user'], 'cms-questionnaire-v0.0.1'),
            create_deposit(users['cms_user'], 'cms-auxiliary-measurements-v0.0.1'),
        ]]

        create_deposit(users['cms_user2'], 'cms-analysis-v0.0.1'),
        create_deposit(users['lhcb_user'], 'lhcb-v0.0.1'),
        create_deposit(users['alice_user'], 'alice-analysis-v0.0.1'),

        resp = client.get('/deposits/', headers=auth_headers_for_user(users['cms_user']))
        hits = json.loads(resp.data)['hits']['hits']

        assert resp.status_code == 200
        assert len(hits) == 3
        for x in hits:
            assert x['metadata']['_deposit']['id'] in user_deposits_ids


#def test_get_deposits_when_published_other_member_can_see_it(app, users,
#                                                             auth_headers_for_user,
#                                                             create_deposit):
#    with app.test_client() as client:
#        deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1')
#
#        # other members of collaboration cant see it
#        resp = client.get('/deposits/', headers=auth_headers_for_user(users['lhcb_user2']))
#        hits = json.loads(resp.data)['hits']['hits']
#
#        assert len(hits) == 0
#
#        resp = client.get('/records/', headers=auth_headers_for_user(users['lhcb_user2']))
#        hits = json.loads(resp.data)['hits']['hits']
#
#        assert len(hits) == 0
#
#        # once deposit has been published other members can see it under api/records
#        deposit.publish()
#        current_search.flush_and_refresh(index='_all')
#        import ipdb; ipdb.set_trace()
#
#        resp = client.get('/deposits/', headers=auth_headers_for_user(users['lhcb_user2']))
#        hits = json.loads(resp.data)['hits']['hits']
#
#        assert len(hits) == 0
#
#        resp = client.get('/records/', headers=auth_headers_for_user(users['lhcb_user']))
#        hits = json.loads(resp.data)['hits']['hits']
#
#        assert len(hits) == 1
