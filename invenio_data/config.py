# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2014, 2015 CERN.
#
# CERN Analysis Preservation Framework is free software; you can
# redistribute it and/or modify it under the terms of the GNU General
# Public License as published by the Free Software Foundation; either
# version 2 of the License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that
# it will be useful, but WITHOUT ANY WARRANTY; without even the
# implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
# PURPOSE.  See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this software; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
# 02D111-1307, USA.

import copy

from invenio.base.config import PACKAGES as _PACKAGES, PACKAGES_EXCLUDE as _PACKAGES_EXCLUDE

from invenio_oauthclient.contrib import cern

PACKAGES = [
    "invenio_data.base",
    "invenio_data.modules.*",
] + _PACKAGES

PACKAGES_EXCLUDE = [
    "invenio_annotations",
    "invenio_comments",
    "invenio.modules.documentation",
] + _PACKAGES_EXCLUDE

DEPOSIT_TYPES = [
    'invenio_data.modules.deposit.workflows.cms.cms',
    'invenio_data.modules.deposit.workflows.alice.alice',
    'invenio_data.modules.deposit.workflows.lhcb.lhcb',
    'invenio_data.modules.deposit.workflows.questions.questions',
    'invenio_data.modules.deposit.workflows.questions2.questions2',
]

CFG_SITE_URL = 'http://data-demo.cern.ch'
CFG_SITE_SECURE_URL = 'https://data-demo.cern.ch'

CFG_SITE_LANGS = ["en", "fr"]

CFG_SITE_NAME = 'CERN Analysis Preservation'
CFG_SITE_NAME_INTL = {}
CFG_SITE_NAME_INTL['en'] = 'CERN Analysis Preservation'
CFG_SITE_NAME_INTL['fr'] = 'CERN Analysis Preservation'

CFG_SITE_MISSION = 'Demo (your data will NOT be preservered!)'
CFG_SITE_MISSION_INTL = {
    'en': 'Demo (your data will NOT be preservered!)',
}

CFG_WEBSEARCH_DISPLAY_NEAREST_TERMS = 0

CERN_REMOTE_APP = copy.deepcopy(cern.REMOTE_APP)
CERN_REMOTE_APP["params"].update(dict(request_token_params={
   "resource": "analysis-preservation.cern.ch",
   "scope": "Name Email Bio Groups",
}))
OAUTHCLIENT_REMOTE_APPS = dict(
    cern=CERN_REMOTE_APP,
)

CERN_APP_CREDENTIALS = dict(
    consumer_key="changeme",
    consumer_secret="changeme",
)

JSONSCHEMAS_BASE_SCHEMA = 'base/record-v1.0.0.json'
