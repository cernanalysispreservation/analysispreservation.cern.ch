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
"""Unit tests for Cap Deposit class."""

import json

from uuid import uuid4

from flask_security import login_user
from invenio_access.models import ActionRoles, ActionUsers
from pytest import raises
from sqlalchemy.exc import IntegrityError

from cap.modules.deposit.api import CAPDeposit as Deposit
from cap.modules.deposit.errors import DepositValidationError
from conftest import _datastore


default_headers = [('Content-Type', 'application/json'),
                   ('Accept', 'application/form+json')]

def test_deposit_review(
    client, db, users, auth_headers_for_user, create_deposit, create_schema):
    # SETUP
    owner, other_user = users['cms_user'], users['cms_user2']
    schema = create_schema('cms-analysis', experiment='CMS')
    schema2 = create_schema('cms-stats-questionnaire', experiment='CMS')

    not_reviewable_deposit_deposit = create_deposit(owner, 'cms',{
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v1.0.0.json',
            'basic_info': {
                'analysis_number': 'dream_team',
                'people_info': [{}]
            }
        })
    not_reviewable_deposit_deposit_id = \
        not_reviewable_deposit_deposit["_deposit"]["id"]

    reviewable_deposit_deposit = create_deposit(owner, 'cms', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-stats-questionnaire-v1.0.0.json',
            'basic_info': {
                'analysis_number': 'dream_team',
                'people_info': [{}]
            }
        })
    reviewable_deposit_deposit_id = \
        reviewable_deposit_deposit["_deposit"]["id"]

    # TESTS
    resp = client.get(f'/deposits/{not_reviewable_deposit_deposit_id}',
                      headers=[('Accept', 'application/form+json')] +
                      auth_headers_for_user(owner))

    assert resp.status_code == 200

    resp = client.post(f'/deposits/{not_reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({}),
                        headers=#[('Accept', 'application/form+json')] +
                        [('Content-Type', 'application/json'),
                         ('Accept', 'application/json')] +
                        auth_headers_for_user(owner))

    assert resp.status_code == 400


    resp = client.get(f'/deposits/{reviewable_deposit_deposit_id}',
                      headers=[('Accept', 'application/form+json')] +
                      auth_headers_for_user(owner))

    assert resp.status_code == 200

    # Wrong body - needs Content-Type
    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "type": "request_changes",
                            "body": "Please change X to Z"
                        }),
                        headers=[('Accept', 'application/form+json')] +
                        auth_headers_for_user(owner))

    assert resp.status_code == 400

    # Wrong - needs body, non empty
    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({}),
                        headers=default_headers +
                        auth_headers_for_user(owner))

    assert resp.status_code == 400
    assert "errors" in resp.json

    # Correct 1
    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "type": "request_changes",
                            "body": "Please change X to Z"
                        }),
                        headers=default_headers+
                        auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 1

    review_item = resp.json["review"][0]
    review_item_id = review_item["id"]

    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "id": review_item_id
                        }),
                        headers=default_headers+
                        auth_headers_for_user(owner))

    assert resp.status_code == 400

    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "id": review_item_id,
                            "action": "comment"
                        }),
                        headers=default_headers +
                        auth_headers_for_user(owner))

    assert resp.status_code == 201

    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "id": "wrong_id",
                            "action": "resolve"
                        }),
                        headers=default_headers +
                        auth_headers_for_user(owner))

    assert resp.status_code == 400

    #2
    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "type": "request_changes",
                            "body": "Please change X to Z 2"
                        }),
                        headers=default_headers +
                        auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 2

    review_item_to_resolve = resp.json["review"][1]
    review_item_to_resolve_id = review_item_to_resolve["id"]
    assert resp.json["review"][1]["resolved"] == False

    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "action": "resolve",
                            "id": review_item_to_resolve_id
                        }),
                        headers=default_headers +
                        auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 2
    assert resp.json["review"][1]["resolved"] == True


    #3
    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "type": "request_changes",
                            "body": "Please change X to Z 3"
                        }),
                        headers=default_headers +
                        auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 3

    #4
    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "type": "request_changes",
                            "body": "Please change X to Z 4"
                        }),
                        headers=default_headers +
                        auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 4

    review_item_to_remove = resp.json["review"][0]
    review_item_to_remove_id = review_item_to_remove["id"]

    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "action": "delete",
                            "id": review_item_to_remove_id
                        }),
                        headers=default_headers +
                        auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 3

    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({
                            "action": "delete",
                            "id": review_item_to_remove_id
                        }),
                        headers=default_headers +
                        auth_headers_for_user(owner))

    assert resp.status_code == 400

    resp = client.post(f'/deposits/{reviewable_deposit_deposit_id}'
                        '/actions/review',
                        data=json.dumps({}),
                        headers=default_headers +
                        auth_headers_for_user(other_user))

    assert resp.status_code == 403

    resp = client.get(f'/deposits/{reviewable_deposit_deposit_id}',
                      headers=[('Accept', 'application/form+json')] +
                      auth_headers_for_user(owner))

    assert resp.status_code == 200
    assert "review" in resp.json

    resp = client.get(f'/deposits/{reviewable_deposit_deposit_id}',
                      headers=[('Accept', 'application/form+json')] +
                      auth_headers_for_user(other_user))

    assert resp.status_code == 403


