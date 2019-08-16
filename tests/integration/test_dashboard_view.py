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
"""Integration tests for dashboard views."""
from __future__ import absolute_import, print_function

import json

from invenio_search import current_search
from pytest import mark


def test_dashboard_view_returns_user_drafts(client, users, create_deposit,
                                            auth_headers_for_user):
    my_deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.2.0')
    user_published_deposit = create_deposit(users['lhcb_user'],
                                            'lhcb-v0.2.0',
                                            publish=True)
    other_user_deposit = create_deposit(users['lhcb_user2'], 'lhcb-v1.2.0')

    resp = client.get('/dashboard',
                      headers=auth_headers_for_user(users['lhcb_user']))
    user_drafts = [x['id'] for x in resp.json['user_drafts']]

    assert len(user_drafts) == 1
    assert my_deposit['_deposit']['id'] in user_drafts
    assert user_published_deposit['_deposit']['id'] not in user_drafts
    assert other_user_deposit['_deposit']['id'] not in user_drafts


def test_dashboard_view_returns_user_published_analysis(
        client, users, create_deposit, auth_headers_for_user):
    my_deposit = create_deposit(users['lhcb_user'],
                                'lhcb-v0.2.0',
                                experiment='LHCb')
    user_published_deposit = create_deposit(users['lhcb_user'],
                                            'lhcb-v0.2.0',
                                            experiment='LHCb',
                                            publish=True)
    other_user_deposit = create_deposit(users['lhcb_user2'],
                                        'lhcb-v1.2.0',
                                        experiment='LHCb')
    other_user_published_deposit = create_deposit(users['lhcb_user2'],
                                                  'lhcb-v0.2.0',
                                                  experiment='LHCb',
                                                  publish=True)

    resp = client.get('/dashboard',
                      headers=auth_headers_for_user(users['lhcb_user']))
    user_published = [x['id'] for x in resp.json['user_published']]

    assert len(user_published) == 1
    assert user_published_deposit['control_number'] in user_published
    assert my_deposit['_deposit']['id'] not in user_published
    assert other_user_deposit['_deposit']['id'] not in user_published
    assert other_user_published_deposit['control_number'] not in user_published


def test_dashboard_view_returns_published_by_collaboration(
        client, users, create_deposit, auth_headers_for_user):
    my_deposit = create_deposit(users['lhcb_user'],
                                'lhcb-v0.2.0',
                                experiment='LHCb')
    user_published_deposit = create_deposit(users['lhcb_user'],
                                            'lhcb-v0.2.0',
                                            publish=True,
                                            experiment='LHCb')
    published_by_member_of_collab = create_deposit(users['lhcb_user2'],
                                                   'lhcb-v1.2.0',
                                                   publish=True,
                                                   experiment='LHCb')
    published_by_another_collab = create_deposit(users['cms_user'],
                                                 'cms-v1.2.0',
                                                 publish=True,
                                                 experiment='CMS')

    resp = client.get('/dashboard',
                      headers=auth_headers_for_user(users['lhcb_user']))
    published_by_collab = [x['id'] for x in resp.json['published_by_collab']]

    assert len(published_by_collab) == 2
    assert my_deposit['_deposit']['id'] not in published_by_collab
    assert user_published_deposit['control_number'] in published_by_collab
    assert published_by_member_of_collab[
        'control_number'] in published_by_collab
    assert published_by_another_collab[
        'control_number'] not in published_by_collab


def test_dashboard_view_returns_published_by_collaboration(
        client, users, create_deposit, auth_headers_for_user):
    my_deposit = create_deposit(users['lhcb_user'],
                                'lhcb-v0.2.0',
                                experiment='LHCb')
    user_published_deposit = create_deposit(users['lhcb_user'],
                                            'lhcb-v0.2.0',
                                            publish=True)
    published_by_member_of_collab = create_deposit(users['lhcb_user2'],
                                                   'lhcb-v0.2.0',
                                                   publish=True)
    published_by_another_collab = create_deposit(users['cms_user'],
                                                 'cms-v0.2.0',
                                                 publish=True)

    resp = client.get('/dashboard',
                      headers=auth_headers_for_user(users['lhcb_user']))
    published_by_collab = [x['id'] for x in resp.json['published_by_collab']]

    assert len(published_by_collab) == 2
    assert my_deposit['_deposit']['id'] not in published_by_collab
    assert user_published_deposit['control_number'] in published_by_collab
    assert published_by_member_of_collab[
        'control_number'] in published_by_collab
    assert published_by_another_collab[
        'control_number'] not in published_by_collab


@mark.parametrize("action", [("deposit-read"), ("deposit-admin")])
def test_dashboard_view_returns_shared_with_user(action, client, users,
                                                 create_deposit, json_headers,
                                                 auth_headers_for_user):
    user, other_user = users['lhcb_user'], users['lhcb_user2']
    my_deposit = create_deposit(user, 'lhcb-v1.0.0', experiment='LHCb')
    user_published_deposit = create_deposit(user, 'lhcb-v1.0.0', publish=True)
    other_user_deposit = create_deposit(other_user, 'lhcb-v1.0.0')
    permissions = [{
        'email': user.email,
        'type': 'user',
        'op': 'add',
        'action': action
    }]

    client.post('/deposits/{}/actions/permissions'.format(
        other_user_deposit['_deposit']['id']),
                headers=auth_headers_for_user(other_user) + json_headers,
                data=json.dumps(permissions))
    current_search.flush_and_refresh('deposits')

    resp = client.get('/dashboard', headers=auth_headers_for_user(user))
    shared_with_user = [x['id'] for x in resp.json['shared_with_user']]

    assert len(shared_with_user) == 1
    assert my_deposit['_deposit']['id'] not in shared_with_user
    assert user_published_deposit['control_number'] not in shared_with_user
    assert other_user_deposit['_deposit']['id'] in shared_with_user


def test_dashboard_view_returns_user_counts_properly(client, users,
                                                     create_deposit,
                                                     auth_headers_for_user):
    create_deposit(users['lhcb_user'], 'lhcb-v0.2.0', experiment='LHCb')
    create_deposit(users['lhcb_user'], 'lhcb-v0.2.0', experiment='LHCb')
    create_deposit(users['lhcb_user'], 'lhcb-v1.2.0', experiment='LHCb')
    create_deposit(users['lhcb_user'],
                   'lhcb-v1.2.0',
                   publish=True,
                   experiment='LHCb')
    create_deposit(users['lhcb_user2'], 'lhcb-v1.2.0', experiment='LHCb')
    create_deposit(users['lhcb_user2'],
                   'lhcb-v1.2.0',
                   experiment='LHCb',
                   publish=True)

    resp = client.get('/dashboard',
                      headers=auth_headers_for_user(users['lhcb_user']))

    assert resp.json['user_drafts_count'] == 3
    assert resp.json['user_published_count'] == 1
