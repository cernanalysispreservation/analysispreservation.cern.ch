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

import json


def test_disconnect_webhook(client, deposit, auth_headers_for_example_user,
                            github_release_webhook_sub, json_headers):
    pid = deposit['_deposit']['id']

    assert github_release_webhook_sub.status == 'active'

    resp = client.post(f'/deposits/{pid}/actions/disconnect_webhook',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps(
                           {'subscriber_id': github_release_webhook_sub.id}))

    assert resp.status_code == 201
    assert github_release_webhook_sub.status == 'deleted'


def test_disconnect_webhook_when_non_existing_subscriber_id_provided_returns_400(
        client, deposit, auth_headers_for_example_user, github_release_webhook_sub,
        json_headers):
    pid = deposit['_deposit']['id']

    resp = client.post(f'/deposits/{pid}/actions/disconnect_webhook',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({'subscriber_id': 10000}))

    assert resp.status_code == 400


def test_disconnect_webhook_when_no_subscriber_id_provided_returns_400(
        client, deposit, auth_headers_for_example_user, github_release_webhook_sub,
        json_headers):
    pid = deposit['_deposit']['id']

    resp = client.post(f'/deposits/{pid}/actions/disconnect_webhook',
                       headers=auth_headers_for_example_user + json_headers,
                       data=json.dumps({}))

    assert resp.status_code == 400
