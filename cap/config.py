# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
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


"""CERN Analysis Preservation base configuration."""

from __future__ import absolute_import, print_function

import copy
import os
from os.path import dirname, join

from flask_principal import RoleNeed
from invenio_deposit import config
from invenio_deposit.config import (DEPOSIT_REST_FACETS,
                                    DEPOSIT_REST_SORT_OPTIONS)
from invenio_oauthclient.contrib import cern
from invenio_records_rest.config import (RECORDS_REST_FACETS,
                                         RECORDS_REST_SORT_OPTIONS)
from invenio_records_rest.utils import allow_all, deny_all

from cap.modules.deposit.permissions import (CreateDepositPermission,
                                             ReadDepositPermission,
                                             UpdateDepositPermission)


def _(x):
    """Identity function for string extraction"""
    return x


DEBUG = True

# Path to app root dir
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

# Mail
# ====
#: Regex for email
EMAIL_REGEX = '[^@]+@[^@]+\.[^@]+'
MAIL_SUPPRESS_SEND = True

# Language
# ========
#: Default language
BABEL_DEFAULT_LANGUAGE = 'en'
#: Default timezone
BABEL_DEFAULT_TIMEZONE = 'Europe/Zurich'
#: Other supported languages.
I18N_LANGUAGES = []

# Theme
# =====
#: Default site name.
THEME_SITENAME = _("CERN Analysis Preservation")
#: Path to logo file.
THEME_LOGO = "img/cap_logo_lrg.svg"
#: Google Site Verification ids.
THEME_GOOGLE_SITE_VERIFICATION = []
#: Base template for entire site.
BASE_TEMPLATE = "cap_theme/page.html"
#: Cover template for entire site.
COVER_TEMPLATE = "invenio_theme/page_cover.html"
#: Settings template for entire site.
SETTINGS_TEMPLATE = 'cap_theme/settings/base.html'
#: Template for 404 page.
THEME_404_TEMPLATE = "cap_theme/404.html"
#: Template for 500 page.
THEME_500_TEMPLATE = "cap_theme/500.html"
#: JavaScript file containing the require.js build configuration.
REQUIREJS_CONFIG = 'js/cap-build.js'

# Records
# =======
#: Records configuration
RECORDS_UI_DEFAULT_PERMISSION_FACTORY = "cap.modules.theme.permissions:" \
    "read_permission_factory"

#: Records sort/facets options
RECORDS_REST_SORT_OPTIONS.update(DEPOSIT_REST_SORT_OPTIONS)
RECORDS_REST_FACETS.update(DEPOSIT_REST_FACETS)

#: Endpoints for displaying records.
RECORDS_UI_ENDPOINTS = dict(
    recid=dict(
        pid_type='recid',
        route='/records/<pid_value>',
        template='records/detail.html',
        record_class='invenio_records_files.api:Record'
    ),
    recid_preview=dict(
        pid_type='recid',
        route='/records/<pid_value>/preview/<path:filename>',
        view_imp='invenio_previewer.views.preview',
        record_class='invenio_records_files.api:Record',
    ),
    recid_files=dict(
        pid_type='recid',
        route='/records/<pid_value>/files/<path:filename>',
        view_imp='invenio_files_rest.views.file_download_ui',
        record_class='invenio_records_files.api:Record',
    ),
)

#: Records REST API endpoints.
RECORDS_REST_ENDPOINTS = dict(
    recid=dict(
        pid_type='recid',
        pid_minter='cap_record_minter',
        pid_fetcher='cap_record_fetcher',
        search_index='_all',
        search_type=None,
        record_serializers={
            'application/json': ('cap.modules.records.serializers'
                                 ':json_v1_response'),
        },
        search_serializers={
            'application/json': ('cap.modules.records.serializers'
                                 ':json_v1_search'),
        },
        list_route='/records/',
        item_route='/records/<pid(recid):pid_value>',
        default_media_type='application/json',
        read_permission_factory_imp=None
    ),
)

#: Default api endpoint for LHCb db
GRAPHENEDB_URL = 'http://datadependency.cern.ch:7474'
#: Default base template.
RECORDS_UI_BASE_TEMPLATE = 'records/detail.html'
#: Default tombstone template.
RECORDS_UI_TOMBSTONE_TEMPLATE = 'records/detail.html'

# CAP collaboration groups
# ========================
#: Configuration for collaborations
CAP_COLLAB_EGROUPS = {
    "collaboration_cms": [
        RoleNeed("cms-members@cern.ch"),
    ],
    "collaboration_alice": [
        RoleNeed("alice-member@cern.ch"),
    ],
    "collaboration_atlas": [
        RoleNeed("atlas-active-members-all@cern.ch"),
    ],
    "collaboration_lhcb": [
        RoleNeed("lhcb-general@cern.ch"),
    ]
}

#: E-Groups for superuser rights
SUPERUSER_EGROUPS = [
    RoleNeed('analysis-preservation-support@cern.ch'),
    RoleNeed('data-preservation-admins@cern.ch'),
]

SUPERUSER_ROLES = [RoleNeed(i) for i in CAP_COLLAB_EGROUPS.keys()]

# Start pages for experiments
CAP_COLLAB_PAGES = {
    'collaboration_lhcb': 'cap_lhcb.lhcb_landing',
    'collaboration_atlas': 'cap_atlas.atlas_landing',
    'collaboration_cms': 'cap_cms.cms_landing',
    'collaboration_alice': 'cap_alice.alice_landing',
}

# Search
# ======
#: Default API endpoint for search UI.
SEARCH_UI_SEARCH_API = '/api/records/'

#: Default ElasticSearch hosts
SEARCH_ELASTIC_HOSTS = ["localhost:9200"]

#: Search query enhancers
SEARCH_QUERY_ENHANCERS = [
    'cap.modules.access.ext:authenticated_query'
]

# Accounts
# ========
#: Login registration template.
OAUTHCLIENT_LOGIN_USER_TEMPLATE = "access/login_user.html"
#: Login confirmation mail.
SECURITY_SEND_REGISTER_EMAIL = False

ACCOUNTS_REGISTER_BLUEPRINT = 'cap_theme'
SECURITY_RECOVERABLE = False
SECURITY_REGISTERABLE = False
SECURITY_CHANGEABLE = False
SECURITY_CONFIRMABLE = False
BLUEPRINT_NAME = 'cap_theme'

# Logging
# =======
#: CERN OAuth configuration
CERN_APP_CREDENTIALS = {
    'consumer_key': os.environ.get('APP_CERN_APP_CREDENTIALS_KEY'),
    'consumer_secret': os.environ.get('APP_CERN_APP_CREDENTIALS_SECRET')
}

OAUTHCLIENT_REMOTE_APPS = {'cern': cern.REMOTE_APP}
#: OAuth login template.
# OAUTHCLIENT_LOGIN_USER_TEMPLATE = 'access/login_user.html'

# JSON Schemas
# ============
#: Hostname for JSON Schemas.
JSONSCHEMAS_HOST = 'localhost:5000'
#: Path to where JSON metadata exist
JSON_METADATA_PATH = "/_metadata"
JSONSCHEMAS_ENDPOINT = '/schemas'

JSONSCHEMAS_VERSIONS = {
    "ATLASAnalysis": "ATLASAnalysis-v0.0.1",
    "ATLASWorkflows": "ATLASWorkflows-v0.0.1",
    "CMSAnalysis": "CMSAnalysis-v0.0.1",
    "CMSQuestionnaire": "CMSQuestionnaire-v0.0.1",
    "LHCbAnalysis": "LHCbAnalysis-v0.0.1",
}

JSONSCHEMAS_ROOT = os.path.join(APP_ROOT, 'jsonschemas')

# directories with jsonschemas
JSONSCHEMAS_DEPOSIT_DIR = 'deposits/records/'
JSONSCHEMAS_RECORDS_DIR = 'records/'

# User profile
# ============
#: Enable all the users to perform all the actions
ENABLE_SUPERPOWERS_FOR_EVERYONE = False

# WARNING: Do not share the secret key - especially do not commit it to
# version control.
SECRET_KEY = "changeme"


# Database
# ============
# SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://localhost/cap"


# Deposit
# ============
#: Default jsonschema for deposit
DEPOSIT_DEFAULT_JSONSCHEMA = 'deposits/records/lhcb-v1.0.0.json'

#: Default schemanform for deposit
DEPOSIT_DEFAULT_SCHEMAFORM = 'json/deposits/records/lhcb-v1.0.0.json'
#: Search api url for deposit
DEPOSIT_SEARCH_API = '/api/deposits/'

#: Template for deposit records API.
# DEPOSIT_RECORDS_API = '/api/deposit/depositions/{pid_value}'

DEPOSIT_GROUPS = {
    "lhcb": {
        "schema": "deposits/records/lhcb-v1.0.0.json",
        "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "schema_form": "json/deposits/records/lhcb-v1.0.0.json",
        "endpoint": "",
        "create_permission_roles": [
            'collaboration_lhcb',
        ],
        'create_permission_factory_imp': 'cap.modules.experiments.permissions.lhcb.lhcb_permission',
        'read_permission_factory_imp': 'cap.modules.experiments.permissions.lhcb.lhcb_permission',
        'update_permission_factory_imp': 'cap.modules.experiments.permissions.lhcb.lhcb_permission',
        'delete_permission_factory_imp': allow_all,
    },
    "cms-analysis": {
        "schema": "deposits/records/cms-analysis-v1.0.0.json",
        "schema_form": "json/deposits/records/cms-analysis-v1.0.0.json",
        "list_template": "cap_deposit/index.html",
        "item_new_template": "cap_deposit/edit.html",
        "endpoint": "",
        "create_permission_roles": [
            'collaboration_cms',
        ],
        'create_permission_factory_imp': 'cap.modules.experiments.permissions.cms.cms_permission',
        'read_permission_factory_imp': 'cap.modules.experiments.permissions.cms.cms_permission',
        'update_permission_factory_imp': 'cap.modules.experiments.permissions.cms.cms_permission',
        'delete_permission_factory_imp': allow_all,
    }
}

# #: Endpoints for deposit.
DEPOSIT_UI_ENDPOINT = '{scheme}://{host}/deposit/{pid_value}'
DEPOSIT_REST_ENDPOINTS = copy.deepcopy(config.DEPOSIT_REST_ENDPOINTS)
# DEPOSIT_PID = 'pid(dep,record_class="cap.modules.deposit.api:CapDeposit")'
DEPOSIT_REST_ENDPOINTS['depid'].update({
    # 'pid_type': 'depid',
    'pid_minter': 'cap_deposit_minter',
    'pid_fetcher': 'cap_deposit_fetcher',
    # 'record_serializers': {
    #     'application/json': (
    #         'cap.modules.records.serializers'
    #         ':json_v1_response')
    # },
    'create_permission_factory_imp': CreateDepositPermission,
    'read_permission_factory_imp': ReadDepositPermission,
    'update_permission_factory_imp': UpdateDepositPermission,
    # TODO update delete permission when 'discard'/'delete' is ready
    'delete_permission_factory_imp': allow_all,
    'links_factory_imp': 'cap.modules.deposit.links:links_factory',
})
DEPOSIT_UI_INDEX_TEMPLATE = "cap_deposit/index.html"
# TODO Resolve when '/deposit/new/' is removed
DEPOSIT_RECORDS_UI_ENDPOINTS = copy.deepcopy(
    config.DEPOSIT_RECORDS_UI_ENDPOINTS)
DEPOSIT_RECORDS_UI_ENDPOINTS['depid'].update({
    'template': 'cap_deposit/edit.html',
})

#: Template for <invenio-records-actions>
DEPOSIT_UI_JSTEMPLATE_ACTIONS = 'templates/cap_deposit/actions.html'

# Collections
# ===========
#: Remove signals (Only for debug mode)
COLLECTIONS_REGISTER_RECORD_SIGNALS = False

DEPOSIT_UI_ENDPOINT = '{scheme}://{host}/deposit/{pid_value}'

# Datadir
# =======
DATADIR = join(dirname(__file__), 'data')
