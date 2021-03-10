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
def test_recipients_on_publish(mock_path_value, mock_user, app, default_config):
    mock_path_value.return_value = 'key'
    mock_user.email = 'test@cern.ch'

    record = {
        'test-data': 'test'
    }
    _, recipients = get_cms_stat_recipients(record, {})
    assert default_config['PDF_FORUM_MAIL'] not in recipients
    assert default_config['CONVENERS_ML_MAIL'] not in recipients

    record = {
        'parton_distribution_functions': 'test'
    }
    _, recipients = get_cms_stat_recipients(record, {})
    assert default_config['PDF_FORUM_MAIL'] in recipients

    record = {
        'multivariate_discriminants': {
            'use_of_centralized_cms_apps': {
                'options': ['Yes']
            }
        }
    }
    _, recipients = get_cms_stat_recipients(record, {})
    assert default_config['CONVENERS_ML_MAIL'] in recipients

    record = {
        'multivariate_discriminants': {
            'mva_use': 'test'
        }
    }
    _, recipients = get_cms_stat_recipients(record, {})
    assert default_config['CONVENERS_ML_MAIL'] in recipients

    record = {
        'ml_app_use': ['not empty']
    }
    _, recipients = get_cms_stat_recipients(record, {})
    assert default_config['CONVENERS_ML_MAIL'] in recipients

    record = {
        'ml_survey': {
            'options': 'Yes'
        }
    }
    _, recipients = get_cms_stat_recipients(record, {})
    assert default_config['CONVENERS_ML_MAIL'] in recipients

    # test well-formed cadi id for recipients
    record = {
        'analysis_context': {
            'cadi_id': 'ABC-11-111'
        }
    }
    _, recipients = get_cms_stat_recipients(record, {})
    assert default_config['CMS_HYPERNEWS_EMAIL_FORMAT'].format('ABC-11-111') in recipients

    record = {
        'analysis_context': {
            'cadi_id': 'AB0-11-111'
        }
    }
    _, recipients = get_cms_stat_recipients(record, {})
    assert default_config['CMS_HYPERNEWS_EMAIL_FORMAT'].format('AB0-11-111') not in recipients

    # current user mail should be in every time
    assert 'test@cern.ch' in recipients


@patch('cap.modules.mail.utils.current_user')
def test_recipients_on_review(mock_user, app, default_config, users, create_deposit):
    mock_user.email = 'test@cern.ch'
    user = users['cms_user']
    deposit = create_deposit(
        user,
        'cms-analysis',
        {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v1.0.0.json',
            'analysis_context': {
                'cadi_id': 'ABC-11-111'
            }
        },
        experiment='CMS',
        publish=True
    )

    _, recipients = get_review_recipients(deposit, {})

    # owner / reviewer
    assert 'test@cern.ch' in recipients
    assert 'cms_user@cern.ch' in recipients
