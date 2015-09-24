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

from invenio_base.config import EXTENSIONS as _EXTENSIONS, \
    PACKAGES as _PACKAGES, \
    PACKAGES_EXCLUDE as _PACKAGES_EXCLUDE

from invenio_oauthclient.contrib import cern

EXTENSIONS = _EXTENSIONS + [
    "invenio_deposit.url_converters",
    "invenio_ext.es",
]

PACKAGES = [
    "invenio_data.base",
    "invenio_data.modules.*",
] + _PACKAGES + [
    "invenio_jsonschemas",
]

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

DEF_DEMO_USER_ROLES = (
    ('maneuman', 'superadmin'),
    ('pfokiano', 'superadmin'),
    ('simko', 'superadmin'),
)

DEF_DEMO_ROLES = (
    ('superadmin', 'superuser with all rights', 'deny any'),
    ('webaccessadmin', 'WebAccess administrator', 'deny any'),
    ('anyuser', 'Any user', 'allow any'),
    ('loanusers', 'Users who can use loans', 'allow any'),
    ('groupusers', 'Users who can use groups', 'allow any'),
    ('messageusers', 'Users who can use messages', 'allow any'),
    ('holdingsusers', 'Users who can view holdings', 'allow any'),
    ('statisticsusers', 'Users who can view statistics', 'allow any'),
    ('claimpaperusers', 'Users who can perform changes to their own paper attributions without the need for an operator\'s approval', 'allow any'),
    ('claimpaperoperators', 'Users who can perform changes to _all_ paper attributions without the need for an operator\'s approval', 'deny any'),
    ('paperclaimviewers', 'Users who can view "claim my paper" facilities.', 'allow all'),
    ('paperattributionviewers', 'Users who can view "attribute this paper" facilities', 'allow all'),
    ('paperattributionlinkviewers', 'Users who can see attribution links in the search', 'allow all'),
    ('holdingpenusers', 'Users who can view Holding Pen', 'deny all'),
    ('depositusers', 'Users who can use a deposit type', "allow groups 'DAPF-development'\ndeny any"),
    ('deposituserscms', 'Users who can use a CMS deposit type', "allow groups 'cms-members'\ndeny any"),
)

DEF_DEMO_AUTHS = (
    ('loanusers', 'useloans', {}),
    ('groupusers', 'usegroups', {}),
    ('messageusers', 'usemessages', {}),
    ('holdingsusers', 'viewholdings', {}),
    ('statisticsusers', 'viewstatistics', {}),
    ('claimpaperusers', 'claimpaper_view_pid_universe', {}),
    ('claimpaperoperators', 'claimpaper_view_pid_universe', {}),
    ('claimpaperusers', 'claimpaper_claim_own_papers', {}),
    ('claimpaperoperators', 'claimpaper_claim_own_papers', {}),
    ('claimpaperoperators', 'claimpaper_claim_others_papers', {}),
    ('claimpaperusers', 'claimpaper_change_own_data', {}),
    ('claimpaperoperators', 'claimpaper_change_own_data', {}),
    ('claimpaperoperators', 'claimpaper_change_others_data', {}),
    ('holdingpenusers', 'viewholdingpen', {}),
    ('depositusers', 'usedeposit', {}),
    ('deposituserscms', 'usedeposit', {'type': 'cms'}),
    ('deposituserscms', 'usedeposit', {'type': 'questions'}),
    ('deposituserscms', 'usedeposit', {'type': 'questions2'}),
)

CFG_SITE_ADMIN_EMAIL = 'analysis-preservation-support@cern.ch'
CFG_SITE_SUPPORT_EMAIL = 'analysis-preservation-support@cern.ch'
