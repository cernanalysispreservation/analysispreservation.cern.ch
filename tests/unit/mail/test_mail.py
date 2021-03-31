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
"""Tests for mail."""

import json
from pytest import raises

from invenio_deposit.signals import post_action


def test_send_mail_published(app, users, create_deposit, create_schema, client, auth_headers_for_user):
    config = {
        "notifications": {
            "actions": {
                "publish": [{
                    "subject": {
                        "template": 'Questionnaire for {{ cadi_id if cadi_id else "" }} {{ published_id }} - '
                                    '{{ "New Version of Published Analysis" if revision > 0 else "New Published Analysis" }} '
                                    '| CERN Analysis Preservation',
                        "ctx": [{
                            "name": "cadi_id",
                            "path": "analysis_context.cadi_id"
                        }, {
                            "method": "revision"
                        }, {
                            "method": "published_id"
                        }]
                    },
                    "body": {
                        "template_file": "mail/body/questionnaire_message_published_plain.html",
                        "ctx": [{
                            "name": "cadi_id",
                            "path": "analysis_context.cadi_id"
                        }, {
                            "name": "title",
                            "path": "general_title"
                        }, {
                            "method": "published_url"
                        }, {
                            "method": "submitter_mail"
                        }],
                        "base_template": "mail/analysis_plain_text.html",
                        "plain": True
                    },
                    "recipients": {
                        'recipients': [
                            'test-recipient@cern0.ch',
                            {
                                "checks": [{
                                    "path": "analysis_context.cadi_id",
                                    "condition": "exists"
                                }],
                                "mails": {
                                    "formatted": [{
                                        "template": "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern0.ch{% endif %}",
                                        "ctx": [{
                                            "name": "cadi_id",
                                            "type": "path",
                                            "path": "analysis_context.cadi_id"
                                        }]
                                    }]
                                }
                            }
                        ]
                    }
                }, {
                    "subject": {
                        "template_file": "mail/subject/questionnaire_subject_published.html",
                        "ctx": [{
                            "name": "cadi_id",
                            "path": "analysis_context.cadi_id"
                        }, {
                            "method": "revision"
                        }, {
                            "method": "published_id"
                        }]
                    },
                    "body": {
                        "template_file": "mail/body/questionnaire_message_published.html",
                        "ctx": [{
                            "name": "cadi_id",
                            "path": "analysis_context.cadi_id"
                        }, {
                            "name": "title",
                            "path": "general_title"
                        }, {
                            "method": "published_url"
                        }, {
                            "method": "submitter_mail"
                        }]
                    },
                    "recipients": {
                        'recipients': [
                            {"method": "get_owner"},
                            {"method": "get_submitter"}
                        ],
                        'bcc': [
                            {"method": "get_cms_stat_recipients"},
                            {
                                'op': 'and',
                                "checks": [
                                    {
                                        "path": "ml_app_use",
                                        "condition": "exists"
                                    }
                                ],
                                'mails': {
                                    'default': ["ml-conveners-test@cern0.ch", "ml-conveners-jira-test@cern0.ch"]
                                }
                            }
                        ]
                    }
                }]
            }
        }
    }
    user = users['cms_user']

    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1", config=config)

    with app.app_context():
        with app.extensions['mail'].record_messages() as outbox:
            deposit = create_deposit(
                user,
                'cms-analysis',
                {
                    '$schema': 'https://analysispreservation.cern.ch/schemas/'
                               'deposits/records/cms-stats-questionnaire-v0.0.1.json',
                    'general_title': 'test analysis',
                    'analysis_context': {
                        'cadi_id': 'ABC-11-111'
                    },
                    'ml_app_use': ['not empty']
                },
                experiment='CMS'
            )

            resp = client.post(
                f"/deposits/{deposit['_deposit']['id']}/actions/publish",
                headers=auth_headers_for_user(user)
            )
            assert resp.status_code == 202
            pid = resp.json['recid']

            # hypernews mail needs to be sent as plain text
            hypernews_mail = outbox[0]
            standard_mail = outbox[1]

            # subject is the same in both
            assert hypernews_mail.subject == \
                   standard_mail.subject == \
                   f'Questionnaire for ABC-11-111 {pid} - New Published Analysis | CERN Analysis Preservation'

            # hypernews
            # message
            assert 'Title: test analysis' in hypernews_mail.body
            assert 'Submitted by cms_user@cern.ch' in hypernews_mail.body
            assert f'Questionnaire URL: http://analysispreservation.cern.ch/published/{resp.json["recid"]}' \
                   in hypernews_mail.body
            assert 'https://cms.cern.ch/iCMS/analysisadmin/cadi?ancode=ABC-11-111' in hypernews_mail.body
            # recipients
            assert 'ml-conveners-test@cern0.ch' not in hypernews_mail.recipients
            assert 'hn-cms-ABC-11-111@cern0.ch' in hypernews_mail.recipients
            assert 'test-recipient@cern0.ch' in hypernews_mail.recipients

            # standard
            # message
            assert 'Title: test analysis' in standard_mail.html
            assert 'Submitted by cms_user@cern.ch' in standard_mail.html
            assert f'Questionnaire URL: http://analysispreservation.cern.ch/published/{resp.json["recid"]}' \
                   in standard_mail.html
            assert 'https://cms.cern.ch/iCMS/analysisadmin/cadi?ancode=ABC-11-111' in standard_mail.html
            # recipients
            assert set(standard_mail.bcc) == {'ml-conveners-jira-test@cern0.ch', 'ml-conveners-test@cern0.ch'}
            assert set(standard_mail.recipients) == {'cms_user@cern.ch'}


def test_send_mail_published_with_signal_failure(
        app, users, create_deposit, create_schema, client, auth_headers_for_user, json_headers):

    def fake_receiver(sender, action=None, pid=None, deposit=None):
        raise Exception

    user = users['cms_user']
    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1")

    with app.app_context():
        with post_action.connected_to(fake_receiver):
            deposit = create_deposit(
                user,
                'cms-analysis',
                {
                    '$schema': 'https://analysispreservation.cern.ch/schemas/'
                               'deposits/records/cms-stats-questionnaire-v0.0.1.json',
                    'general_title': 'test analysis',
                    'analysis_context': {
                        'cadi_id': 'ABC-11-111'
                    },
                    'ml_app_use': ['not empty']
                },
                experiment='CMS',
            )
            depid = deposit['_deposit']['id']

            with raises(Exception):
                resp = client.post(
                    f"/deposits/{depid}/actions/publish",
                    headers=auth_headers_for_user(user)
                )

                assert resp.status_code == 202
                assert resp.json['general_title'] == 'test analysis'
                recid = resp.json['recid']

                # assert that the record exists
                resp = client.get(
                    f'/records/{recid}',
                    headers=[('Accept', 'application/basic+json')] + auth_headers_for_user(user)
                )
                assert resp.status_code == 200
                assert resp.json['general_title'] == 'test analysis'

                # make editable
                resp = client.post(
                    f"/deposits/{depid}/actions/edit",
                    headers=auth_headers_for_user(user)
                )
                assert resp.status_code == 201

                # update the record
                resp = client.put(
                    f"/deposits/{depid}",
                    headers=auth_headers_for_user(user) + json_headers,
                    data=json.dumps({
                        '$schema': 'https://analysispreservation.cern.ch/schemas/'
                                   'deposits/records/cms-stats-questionnaire-v0.0.1.json',
                        'general_title': 'NEW TITLE',
                        'analysis_context': {
                            'cadi_id': 'ABC-11-111'
                        },
                        'ml_app_use': ['not empty']
                    })
                )

                assert resp.status_code == 200
                assert resp.json['general_title'] == 'NEW TITLE'

                # publish again
                resp = client.post(
                    f"/deposits/{depid}/actions/publish",
                    headers=auth_headers_for_user(user)
                )

                assert resp.status_code == 202
                assert resp.json['general_title'] == 'NEW TITLE'


def test_review_mail_doesnt_send_on_review_resolve(
        app, users, create_deposit, create_schema, client, auth_headers_for_user):
    config = {
        "reviewable": True,
        "notifications": {
            "actions": {
                "review": [{
                    "subject": {
                        "template": 'Questionnaire for {{ cadi_id if cadi_id else "" }} reviewed.',
                        "ctx": [{
                            "name": "cadi_id",
                            "path": "analysis_context.cadi_id"
                        }]
                    },
                    "body": {
                        "template": 'Message for review with cadi id: {{ cadi_id if cadi_id else "" }}.',
                        "ctx": [{
                            "name": "cadi_id",
                            "path": "analysis_context.cadi_id"
                        }]
                    },
                    "recipients": {'recipients': ['test-recipient@cern0.ch']}
                }]
            }
        }
    }

    user = users['cms_user']
    form_headers = [('Content-Type', 'application/json'),
                    ('Accept', 'application/form+json')]

    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1", config=config)

    with app.app_context():
        with app.extensions['mail'].record_messages() as outbox:
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

            # 1. publish deposit and make sure nothing gets sent on publish
            resp = client.post(
                f"/deposits/{deposit['_deposit']['id']}/actions/publish",
                headers=auth_headers_for_user(user)
            )
            assert len(outbox) == 0

            # 2. review, mail should be sent
            resp = client.post(f'/deposits/{depid}/actions/review',
                               data=json.dumps({
                                   "type": "request_changes",
                                   "body": "Please change X to Z"
                               }),
                               headers=auth_headers_for_user(user) + form_headers)

            assert resp.status_code == 201
            assert len(outbox) == 1

            # 3. delete review, mail should NOT be sent
            review_item = resp.json["review"][0]
            review_item_id = review_item["id"]

            resp = client.post(f'/deposits/{depid}/actions/review',
                               data=json.dumps({
                                   "id": review_item_id,
                                   "action": "resolve"
                               }),
                               headers=auth_headers_for_user(user) + form_headers)

            assert resp.status_code == 201
            assert len(outbox) == 1
