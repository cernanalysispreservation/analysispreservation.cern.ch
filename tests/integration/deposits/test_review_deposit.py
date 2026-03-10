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
"""Integration tests for deposit review."""

import pytest

import json
from cap.modules.deposit.api import CAPDeposit
from invenio_access.models import ActionUsers
from cap.modules.experiments.permissions import cms_pag_convener_action

default_headers = [('Content-Type', 'application/json'),
                   ('Accept', 'application/form+json')]


def test_deposit_review_create_not_reviewable(
        client, users, auth_headers_for_user, create_deposit, create_schema):
    owner = users['cms_user']
    create_schema('non-review-schema', experiment='CMS')

    deposit_not_reviewable = create_deposit(owner, 'non-review-schema', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/non-review-schema-v1.0.0.json',
            'basic_info': {
                'analysis_number': 'dream_team'
            }
        }, experiment='CMS')
    not_reviewable_id = deposit_not_reviewable["_deposit"]["id"]

    resp = client.get(f'/deposits/{not_reviewable_id}',
                      headers=[('Accept', 'application/form+json')] +
                      auth_headers_for_user(owner))

    assert resp.status_code == 200

    resp = client.post(f'/deposits/{not_reviewable_id}/actions/review',
                       data=json.dumps({}),
                       headers=[('Content-Type', 'application/json'),
                                ('Accept', 'application/json')] + auth_headers_for_user(owner)
                       )

    assert resp.status_code == 400

    resp = client.get(f'/deposits/{not_reviewable_id}',
                      headers=[('Accept', 'application/form+json')] +
                      auth_headers_for_user(owner))

    assert resp.status_code == 200


def test_deposit_review_create_reviewable(
        client, users, auth_headers_for_user, create_deposit, create_schema):
    owner, other_user = users['cms_user'], users['cms_user2']
    create_schema('review-schema', experiment='CMS',
                  config={
                      'reviewable': True
                  })

    deposit_reviewable = create_deposit(owner, 'review-schema', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/review-schema-v1.0.0.json',
            'basic_info': {
                'analysis_number': 'dream_team'
            }
        }, experiment='CMS')
    reviewable_id = deposit_reviewable["_deposit"]["id"]

    # Wrong body - needs Content-Type
    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "type": "request_changes",
                           "body": "Please change X to Z"
                       }),
                       headers=[('Accept', 'application/form+json')] +
                       auth_headers_for_user(owner))
    assert resp.status_code == 400

    # Wrong - needs body, non empty
    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({}),
                       headers=default_headers + auth_headers_for_user(owner))
    assert resp.status_code == 400
    assert "errors" in resp.json

    # Wrong - needs data
    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       headers=default_headers + auth_headers_for_user(owner))
    assert resp.status_code == 400

    # Correct 1
    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "type": "request_changes",
                           "body": "Please change X to Z"
                       }),
                       headers=default_headers + auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 1

    review_item = resp.json["review"][0]
    review_item_id = review_item["id"]

    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "id": review_item_id
                       }),
                       headers=default_headers+
                       auth_headers_for_user(owner))

    assert resp.status_code == 400

    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "id": review_item_id,
                           "action": "comment"
                       }),
                       headers=default_headers + auth_headers_for_user(owner))
    assert resp.status_code == 201

    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "id": "wrong_id",
                           "action": "resolve"
                       }),
                       headers=default_headers +
                       auth_headers_for_user(owner))
    assert resp.status_code == 400

    #2
    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "type": "request_changes",
                           "body": "Please change X to Z 2"
                       }),
                       headers=default_headers + auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 2

    review_item_to_resolve = resp.json["review"][1]
    review_item_to_resolve_id = review_item_to_resolve["id"]
    assert not resp.json["review"][1]["resolved"]

    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "action": "resolve",
                           "id": review_item_to_resolve_id
                       }),
                       headers=default_headers + auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 2
    assert resp.json["review"][1]["resolved"]

    #3
    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
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
    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "type": "request_changes",
                           "body": "Please change X to Z 4"
                       }),
                       headers=default_headers + auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 4

    review_item_to_remove = resp.json["review"][0]
    review_item_to_remove_id = review_item_to_remove["id"]

    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "action": "delete",
                           "id": review_item_to_remove_id
                       }),
                       headers=default_headers + auth_headers_for_user(owner))

    assert resp.status_code == 201
    assert "review" in resp.json
    assert len(resp.json["review"]) == 3

    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({
                           "action": "delete",
                           "id": review_item_to_remove_id
                       }),
                       headers=default_headers + auth_headers_for_user(owner))
    assert resp.status_code == 400

    resp = client.post(f'/deposits/{reviewable_id}/actions/review',
                       data=json.dumps({}),
                       headers=default_headers + auth_headers_for_user(other_user))
    assert resp.status_code == 403

    resp = client.get(f'/deposits/{reviewable_id}',
                      headers=[('Accept', 'application/form+json')] +
                      auth_headers_for_user(owner))

    assert resp.status_code == 200
    assert "review" in resp.json

    resp = client.get(f'/deposits/{reviewable_id}',
                      headers=[('Accept', 'application/form+json')] +
                      auth_headers_for_user(other_user))
    assert resp.status_code == 403


def test_review_and_published_revision_ids(
        app, users, create_deposit, create_schema, client, auth_headers_for_user):
    user = users['cms_user']
    create_schema('cms-stats-questionnaire', experiment='CMS',
                  version="0.0.1", config={"reviewable": True})

    with app.app_context():
        deposit = create_deposit(
            user,
            'cms-analysis',
            {
                '$schema': 'https://analysispreservation.cern.ch/schemas/'
                           'deposits/records/cms-stats-questionnaire-v0.0.1.json',
                'general_title': 'test analysis',
                'analysis_context': {
                    'cadi_id': 'ABC-11-111'
                }
            },
            experiment='CMS'
        )
        depid = deposit["_deposit"]["id"]

        # 1. review, revision should throw error (not published yet)
        client.post(
            f'/deposits/{depid}/actions/review',
            data=json.dumps({"type": "request_changes", "body": "test"}),
            headers=auth_headers_for_user(user) + default_headers
        )

        with pytest.raises(KeyError):
            rec = CAPDeposit.get_record(deposit.id)
            rec.fetch_published()

        # 2. publish, revision should be 0
        client.post(
            f"/deposits/{depid}/actions/publish",
            headers=auth_headers_for_user(user)
        )

        rec = CAPDeposit.get_record(deposit.id)
        _, record = rec.fetch_published()
        assert record.revision_id == 0

        # 3. review after publish, revision should be 0
        client.post(
            f'/deposits/{depid}/actions/review',
            data=json.dumps({"type": "request_changes", "body": "test"}),
            headers=auth_headers_for_user(user) + default_headers
        )

        _, record = rec.fetch_published()
        assert record.revision_id == 0

        # 4. edit, in order to publish again, on re-publish revision should be 1
        client.post(
            f"/deposits/{depid}/actions/edit",
            headers=auth_headers_for_user(user)
        )

        client.post(
            f"/deposits/{depid}/actions/publish",
            headers=auth_headers_for_user(user)
        )

        rec = CAPDeposit.get_record(deposit.id)
        _, record = rec.fetch_published()
        assert record.revision_id == 1

        # 5. review after re-publish, revision should be 1
        client.post(
            f'/deposits/{depid}/actions/review',
            data=json.dumps({"type": "request_changes", "body": "test"}),
            headers=auth_headers_for_user(user) + default_headers
        )

        _, record = rec.fetch_published()
        assert record.revision_id == 1


def test_review_questionnaire_pag_convener_all_can_review(
        app, client, db, users, auth_headers_for_user,
        create_deposit, create_schema):
    """PAG convener with 'all' access can review questionnaire deposits."""
    owner = users['cms_user']
    convener = users['cms_user2']

    create_schema('cms-stats-questionnaire', experiment='CMS',
                  version="0.0.1", config={"reviewable": True})

    deposit = create_deposit(
        owner, 'cms-analysis', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/'
                       'deposits/records/cms-stats-questionnaire-v0.0.1.json',
            'general_title': 'test questionnaire',
            'analysis_context': {'wg': 'ABC'}
        }, experiment='CMS')
    depid = deposit["_deposit"]["id"]

    # convener without pag access cannot review
    resp = client.post(
        f'/deposits/{depid}/actions/review',
        data=json.dumps({"type": "request_changes", "body": "test"}),
        headers=auth_headers_for_user(convener) + default_headers)
    assert resp.status_code == 403

    # grant pag convener access (all PAGs)
    with db.session.begin_nested():
        db.session.add(ActionUsers.allow(
            cms_pag_convener_action(None), user=convener))
    db.session.commit()

    resp = client.post(
        f'/deposits/{depid}/actions/review',
        data=json.dumps({"type": "request_changes", "body": "test"}),
        headers=auth_headers_for_user(convener) + default_headers)
    assert resp.status_code == 201


def test_review_questionnaire_pag_convener_wg_can_review(
        app, client, db, users, auth_headers_for_user,
        create_deposit, create_schema):
    """PAG convener with matching WG access can review questionnaire."""
    owner = users['cms_user']
    convener = users['cms_user2']

    create_schema('cms-stats-questionnaire', experiment='CMS',
                  version="0.0.1", config={"reviewable": True})

    deposit = create_deposit(
        owner, 'cms-analysis', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/'
                       'deposits/records/cms-stats-questionnaire-v0.0.1.json',
            'general_title': 'test questionnaire',
            'analysis_context': {'wg': 'ABC'}
        }, experiment='CMS')
    depid = deposit["_deposit"]["id"]

    # grant pag convener access for specific WG
    with db.session.begin_nested():
        db.session.add(ActionUsers.allow(
            cms_pag_convener_action('abc'), user=convener))
    db.session.commit()

    resp = client.post(
        f'/deposits/{depid}/actions/review',
        data=json.dumps({"type": "request_changes", "body": "test"}),
        headers=auth_headers_for_user(convener) + default_headers)
    assert resp.status_code == 201


def test_review_questionnaire_pag_convener_wrong_wg_cannot_review(
        app, client, db, users, auth_headers_for_user,
        create_deposit, create_schema):
    """PAG convener with different WG access cannot review questionnaire."""
    owner = users['cms_user']
    convener = users['cms_user2']

    create_schema('cms-stats-questionnaire', experiment='CMS',
                  version="0.0.1", config={"reviewable": True})

    deposit = create_deposit(
        owner, 'cms-analysis', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/'
                       'deposits/records/cms-stats-questionnaire-v0.0.1.json',
            'general_title': 'test questionnaire',
            'analysis_context': {'wg': 'ABC'}
        }, experiment='CMS')
    depid = deposit["_deposit"]["id"]

    # grant pag convener access for a different WG
    with db.session.begin_nested():
        db.session.add(ActionUsers.allow(
            cms_pag_convener_action('xyz'), user=convener))
    db.session.commit()

    resp = client.post(
        f'/deposits/{depid}/actions/review',
        data=json.dumps({"type": "request_changes", "body": "test"}),
        headers=auth_headers_for_user(convener) + default_headers)
    assert resp.status_code == 403


def test_review_non_questionnaire_no_extra_needs(
        app, client, db, users, auth_headers_for_user,
        create_deposit, create_schema):
    """Non-questionnaire deposits don't get extra PAG convener needs."""
    owner = users['cms_user']
    other_user = users['cms_user2']

    create_schema('other-schema', experiment='CMS',
                  config={"reviewable": True})

    deposit = create_deposit(
        owner, 'other-schema', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/'
                       'deposits/records/other-schema-v1.0.0.json',
            'general_title': 'test',
            'analysis_context': {'wg': 'ABC'}
        }, experiment='CMS')
    depid = deposit["_deposit"]["id"]

    # PAG convener access should NOT grant review on non-questionnaire
    with db.session.begin_nested():
        db.session.add(ActionUsers.allow(
            cms_pag_convener_action(None), user=other_user))
    db.session.commit()

    resp = client.post(
        f'/deposits/{depid}/actions/review',
        data=json.dumps({"type": "request_changes", "body": "test"}),
        headers=auth_headers_for_user(other_user) + default_headers)
    assert resp.status_code == 403
