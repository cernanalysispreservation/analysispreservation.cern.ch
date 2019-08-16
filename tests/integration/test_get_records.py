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
"""Integration tests for searching records."""


###########################################
# api/records/ [GET]
###########################################
def test_get_records_when_user_not_logged_in_returns_401(client, users, es):
    resp = client.get('/records/')

    assert resp.status_code == 401


def test_get_records_when_superuser_returns_all_records(
        client, users, auth_headers_for_user, auth_headers_for_superuser,
        create_deposit):
    create_deposit(users['lhcb_user'], 'lhcb-v0.2.0')
    published = create_deposit(users['cms_user'],
                               'cms-analysis-v0.0.1',
                               experiment='CMS',
                               publish=True)

    resp = client.get('/records/', headers=auth_headers_for_superuser)

    found_pids = set(hit['metadata']['_deposit']['id']
                     for hit in resp.json['hits']['hits'])

    assert resp.status_code == 200

    assert len(found_pids) == 1
    assert published['_deposit']['id'] in found_pids


def test_get_records_when_owner_can_see_his_record(client, db, users,
                                                   auth_headers_for_user,
                                                   auth_headers_for_superuser,
                                                   create_deposit):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1', publish=True)

    resp = client.get('/records/',
                      headers=auth_headers_for_user(users['lhcb_user']))

    found_pids = set(hit['metadata']['_deposit']['id']
                     for hit in resp.json['hits']['hits'])

    assert resp.status_code == 200

    assert deposit['_deposit']['id'] in found_pids


def test_get_records_when_member_of_exp_can_see_all_experiments_records(
        client, db, users, auth_headers_for_user, auth_headers_for_superuser,
        create_deposit):
    create_deposit(users['lhcb_user'],
                   'lhcb-v0.0.1',
                   experiment='LHCb',
                   publish=True)
    cms_deposits = [
        create_deposit(users['cms_user'],
                       'cms-v0.0.1',
                       experiment='CMS',
                       publish=True),
        create_deposit(users['cms_user2'],
                       'cms-v0.0.1',
                       experiment='CMS',
                       publish=True),
    ]

    resp = client.get('/records/',
                      headers=auth_headers_for_user(users['cms_user']))

    found_pids = set(hit['metadata']['_deposit']['id']
                     for hit in resp.json['hits']['hits'])
    cms_deposits_pids = set(deposit['_deposit']['id']
                            for deposit in cms_deposits)

    assert resp.status_code == 200

    assert found_pids == cms_deposits_pids


###########################################
# api/records/{pid} [GET]
###########################################
def test_get_record_when_user_not_logged_in_returns_401(
        client, users, create_deposit):
    deposit = create_deposit(users['lhcb_user'], 'lhcb-v0.0.1', publish=True)

    resp = client.get('/records/{}'.format(deposit['control_number']))

    assert resp.status_code == 401


def test_get_record_when_owner_returns_record(client, users,
                                              auth_headers_for_user,
                                              create_deposit):
    owner = users['alice_user']
    deposit = create_deposit(owner,
                             'alice-analysis-v0.0.1',
                             experiment='ALICE',
                             publish=True)

    resp = client.get('/records/{}'.format(deposit['control_number']),
                      headers=auth_headers_for_user(owner))

    assert resp.status_code == 200


def test_get_record_when_superuser_returns_record(client, users,
                                                  auth_headers_for_superuser,
                                                  create_deposit):
    deposit = create_deposit(users['alice_user'],
                             'alice-analysis-v0.0.1',
                             publish=True)

    resp = client.get('/records/{}'.format(deposit['control_number']),
                      headers=auth_headers_for_superuser)

    assert resp.status_code == 200


def test_get_record_when_other_member_of_collaboration_returns_record(
        client, users, auth_headers_for_user, create_deposit):
    owner, other_user = users['alice_user'], users['alice_user2']
    deposit = create_deposit(owner,
                             'alice-analysis-v0.0.1',
                             experiment='ALICE',
                             publish=True)

    resp = client.get('/records/{}'.format(deposit['control_number']),
                      headers=auth_headers_for_user(other_user))

    assert resp.status_code == 200


def test_get_record_when_user_is_not_member_of_collaboration_returns_403(
        client, users, auth_headers_for_user, create_deposit):
    deposit = create_deposit(users['alice_user'],
                             'alice-analysis-v0.0.1',
                             experiment='ALICE',
                             publish=True)

    resp = client.get('/records/{}'.format(deposit['control_number']),
                      headers=auth_headers_for_user(users['cms_user']))

    assert resp.status_code == 403
