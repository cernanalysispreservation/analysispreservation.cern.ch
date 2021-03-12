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
from mock import patch

from cap.modules.mail.utils import get_cms_stat_recipients, get_review_recipients


@patch('cap.modules.mail.utils.current_user')
@patch('cap.modules.mail.utils.path_value_equals')
def test_subject_and_message_on_publish(mock_path_value, mock_user, app, default_config, users, create_deposit):
    mock_path_value.return_value = 'key'
    mock_user.email = 'test@cern.ch'
    user = users['cms_user']
    host_url = 'https://analysispreservation.cern.ch/'
    config = {
        "type": "method",
        "method": "get_cms_stat_recipients",
        "email_subject": "CMS Statistics Committee - "
    }

    # with cadi id
    record = create_deposit(
        user,
        'cms-analysis',
        {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v1.0.0.json',
            'analysis_context': {
                'cadi_id': 'ABC-11-111'
            },
            'general_title': 'test analysis'
        },
        experiment='CMS',
        publish=True
    )
    subject, message, _ = get_cms_stat_recipients(record, host_url, config)

    assert subject == "Questionnaire for ABC-11-111 - "
    assert 'Title: test analysis' in message
    assert 'CADI URL: https://cms.cern.ch/' \
           'iCMS/analysisadmin/cadi?ancode=ABC-11-111' in message
    assert 'Submitted by test@cern.ch' in message

    # without cadi id
    record = create_deposit(
        user,
        'cms-analysis',
        {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v1.0.0.json',
            'general_title': 'test analysis'
        },
        experiment='CMS',
        publish=True
    )
    subject, message, _ = get_cms_stat_recipients(record, host_url, config)

    assert subject == 'CMS Statistics Committee - '
    assert 'CADI URL: https://cms.cern.ch/iCMS/analysisadmin/cadi?ancode=None' in message


@patch('cap.modules.mail.utils.current_user')
def test_subject_and_message_on_review(mock_user, app, default_config, users, create_deposit):
    mock_user.email = 'test@cern.ch'
    user = users['cms_user']
    host_url = 'https://analysispreservation.cern.ch/'
    config = {
        "type": "method",
        "method": "get_review_recipients",
        "email_subject": "CMS Statistics Questionnaire - "
    }

    # with cadi id
    deposit = create_deposit(
        user,
        'cms-analysis',
        {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v1.0.0.json',
            'analysis_context': {
                'cadi_id': 'ABC-11-111'
            },
            'general_title': 'test analysis'
        },
        experiment='CMS',
        publish=True
    )

    subject, message, _ = get_review_recipients(deposit, host_url, config)

    assert subject == "Questionnaire for ABC-11-111 - "
    assert 'Title: test analysis' in message
    assert 'CADI URL: https://cms.cern.ch/' \
           'iCMS/analysisadmin/cadi?ancode=ABC-11-111' in message
    assert 'Submitted by cms_user@cern.ch, and reviewed by test@cern.ch.' in message

    # without cadi id
    deposit = create_deposit(
        user,
        'cms-analysis',
        {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v1.0.0.json',
            'general_title': 'test analysis'
        },
        experiment='CMS',
        publish=True
    )

    subject, message, _ = get_review_recipients(deposit, host_url, config)
    assert subject == "CMS Statistics Questionnaire - "
    assert 'Title: test analysis' in message
    assert 'CADI URL: https://cms.cern.ch/iCMS/analysisadmin/cadi?ancode=None' in message
