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

from pytest import raises
from mock import patch

from cap.modules.mail.utils import create_and_send


def test_create_and_send_no_recipients_fails(app):
    with raises(AssertionError):
        create_and_send(None, None, 'Test subject', [])


@patch('cap.modules.mail.utils.current_user')
def test_send_mail_published(mock_user, app, users, create_deposit, create_schema):
    mock_user.email = 'test@cern.ch'
    user = users['cms_user']

    create_schema('cms-stats-questionnaire', experiment='CMS', version="0.0.1")

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
                experiment='CMS',
                publish=True
            )

            # hypernews mail needs to be sent as plain text
            hypernews_mail = outbox[0]
            standard_mail = outbox[1]

            # subject is the same in both
            assert hypernews_mail.subject == \
                   standard_mail.subject == \
                   'Questionnaire for ABC-11-111 - New Published Analysis | CERN Analysis Preservation'

            # hypernews
            # message
            assert 'Title: test analysis' in hypernews_mail.body
            assert 'Submitted by test@cern.ch' in hypernews_mail.body
            assert f'Questionnaire URL : http://analysispreservation.cern.ch/published/{deposit["control_number"]}' \
                   in hypernews_mail.body
            assert 'https://cms.cern.ch/iCMS/analysisadmin/cadi?ancode=ABC-11-111' in hypernews_mail.body
            # recipients
            assert 'ml-conveners-test@cern0.ch' not in hypernews_mail.bcc
            assert 'hn-cms-ABC-11-111@cern0.ch' in hypernews_mail.bcc

            # standard
            # message
            assert 'Title: test analysis' in standard_mail.html
            assert 'Submitted by test@cern.ch' in standard_mail.html
            assert f'Questionnaire URL : http://analysispreservation.cern.ch/published/{deposit["control_number"]}' \
                   in standard_mail.html
            assert 'https://cms.cern.ch/iCMS/analysisadmin/cadi?ancode=ABC-11-111' in standard_mail.html
            # recipients
            assert 'test@cern.ch' in standard_mail.bcc
            assert 'ml-conveners-test@cern0.ch' in standard_mail.bcc
            assert 'ml-conveners-jira-test@cern0.ch' in standard_mail.bcc
            assert 'hn-cms-ABC-11-111@cern0.ch' not in standard_mail.bcc
