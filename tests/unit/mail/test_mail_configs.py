# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2020 CERN.
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
"""Tests for mail configs."""

from pytest import mark
from data.mail_configs import NESTED_CONDITION_WITH_ERRORS_CONFIG, CONDITION_THAT_DOESNT_EXIST_CONFIG, \
    EMPTY_CONFIG, NO_RECIPIENTS_CONFIG, SUBJECT_METHOD_DOESNT_EXIST_CONFIG, SUBJECT_MISSING_CONFIG, \
    SIMPLE_CONFIG, BODY_MISSING_CONFIG, MULTIPLE_RECIPIENTS_CONFIG, CTX_METHOD_MISSING_CONFIG


TEST_DATA = {
    '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/'
               'records/cms-stats-questionnaire-v0.0.1.json',
    'general_title': 'test analysis',
    'analysis_context': {
        'cadi_id': 'ABC-11-111'
    }
}


def test_send_mail_simple_config(
        app, users, create_deposit, create_schema, client, auth_headers_for_user):
    user = users['cms_user']
    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1",
                  config=SIMPLE_CONFIG)

    with app.app_context():
        with app.extensions['mail'].record_messages() as outbox:
            deposit = create_deposit(user, 'cms-analysis', TEST_DATA, experiment='CMS')
            resp = client.post(
                f"/deposits/{deposit['_deposit']['id']}/actions/publish",
                headers=auth_headers_for_user(user)
            )

            assert resp.status_code == 202
            assert len(outbox) == 1
            assert outbox[0].subject == 'Questionnaire for ABC-11-111 published.'
            assert 'Message with cadi id: ABC-11-111.' in outbox[0].html



def test_send_mail_no_body_success(
        app, users, create_deposit, create_schema, client, auth_headers_for_user):
    user = users['cms_user']
    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1",
                  config=BODY_MISSING_CONFIG)

    with app.app_context():
        with app.extensions['mail'].record_messages() as outbox:
            deposit = create_deposit(user, 'cms-analysis', TEST_DATA, experiment='CMS')
            resp = client.post(
                f"/deposits/{deposit['_deposit']['id']}/actions/publish",
                headers=auth_headers_for_user(user)
            )

            assert resp.status_code == 202
            assert len(outbox) == 1
            assert outbox[0].html
            assert not outbox[0].body


def test_send_mail_multiple(
        app, users, create_deposit, create_schema, client, auth_headers_for_user):
    user = users['cms_user']
    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1",
                  config=MULTIPLE_RECIPIENTS_CONFIG)

    with app.app_context():
        with app.extensions['mail'].record_messages() as outbox:
            deposit = create_deposit(user, 'cms-analysis', TEST_DATA, experiment='CMS')
            resp = client.post(
                f"/deposits/{deposit['_deposit']['id']}/actions/publish",
                headers=auth_headers_for_user(user)
            )

            assert resp.status_code == 202
            assert len(outbox) == 2
            assert outbox[0].recipients == ['test-recipient@cern0.ch']
            assert outbox[1].bcc == ['test-recipient-bcc@cern0.ch']


def test_send_mail_when_ctx_method_doesnt_exist(
        app, users, create_deposit, create_schema, client, auth_headers_for_user):
    user = users['cms_user']
    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1",
                  config=CTX_METHOD_MISSING_CONFIG)

    with app.app_context():
        with app.extensions['mail'].record_messages() as outbox:
            deposit = create_deposit(user, 'cms-analysis', TEST_DATA, experiment='CMS')
            resp = client.post(
                f"/deposits/{deposit['_deposit']['id']}/actions/publish",
                headers=auth_headers_for_user(user)
            )

            assert resp.status_code == 202
            assert len(outbox) == 1
            assert 'Message with cadi id: ABC-11-111 and val ' in outbox[0].html


@mark.parametrize('config', [
    EMPTY_CONFIG,
    NESTED_CONDITION_WITH_ERRORS_CONFIG,
    CONDITION_THAT_DOESNT_EXIST_CONFIG,
    NO_RECIPIENTS_CONFIG
])
def test_configs_where_mail_is_not_sent(
        config, app, users, create_deposit, create_schema, client, auth_headers_for_user):
    user = users['cms_user']
    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1", config=config)

    with app.app_context():
        with app.extensions['mail'].record_messages() as outbox:
            deposit = create_deposit(user, 'cms-analysis', TEST_DATA, experiment='CMS')
            resp = client.post(
                f"/deposits/{deposit['_deposit']['id']}/actions/publish",
                headers=auth_headers_for_user(user)
            )

            assert resp.status_code == 202
            assert len(outbox) == 0


@mark.parametrize('config', [
    SUBJECT_METHOD_DOESNT_EXIST_CONFIG,
    SUBJECT_MISSING_CONFIG
])
def test_send_mail_when_subject_method_doesnt_exist_or_subject_missing_returns_default(
        config, app, users, create_deposit, create_schema, client, auth_headers_for_user):
    user = users['cms_user']
    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1", config=config)

    with app.app_context():
        with app.extensions['mail'].record_messages() as outbox:
            deposit = create_deposit(user, 'cms-analysis', TEST_DATA, experiment='CMS')
            resp = client.post(
                f"/deposits/{deposit['_deposit']['id']}/actions/publish",
                headers=auth_headers_for_user(user)
            )

            assert resp.status_code == 202
            assert len(outbox) == 1
            assert outbox[0].subject == 'New Published Analysis | CERN Analysis Preservation'
