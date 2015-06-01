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

from invenio.base.config import PACKAGES as _PACKAGES

PACKAGES = [
    "invenio_data.base",
    "invenio_data.modules.*",
] + _PACKAGES

from invenio.base.config import EXTENSIONS as _EXTENSIONS

DEPOSIT_TYPES = [
    'invenio_data.modules.deposit.workflows.cms.cms',
    'invenio_data.modules.deposit.workflows.alice.alice',
    'invenio_data.modules.deposit.workflows.lhcb.lhcb',
]

CFG_SITE_URL = 'http://data-demo.cern.ch'
CFG_SITE_SECURE_URL = 'https://data-demo.cern.ch'

CFG_SITE_NAME = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL = {}
CFG_SITE_NAME_INTL['en'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['fr'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['de'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['es'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['ca'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['pt'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['it'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['ru'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['sk'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['cs'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['no'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['sv'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['el'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['uk'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['ja'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['pl'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['bg'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['hr'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['zh_CN'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['zh_TW'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['hu'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['af'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['gl'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['ro'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['rw'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['ka'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['lt'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['ar'] = 'Data Analysis Preservation Platform Demo'
CFG_SITE_NAME_INTL['fa'] = 'Data Analysis Preservation Platform Demo'

CFG_WEBSEARCH_DISPLAY_NEAREST_TERMS = 0

from invenio.modules.oauthclient.contrib import cern
OAUTHCLIENT_REMOTE_APPS = dict(
        cern=cern.REMOTE_APP,
)

CERN_APP_CREDENTIALS = dict(
        consumer_key="changeme",
        consumer_secret= "changeme",
)
