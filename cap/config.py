# -*- coding: utf-8 -*-

"""cap base Invenio configuration."""

from __future__ import absolute_import, print_function
import os
import copy
from invenio_oauthclient.contrib import cern


# Identity function for string extraction
def _(x):
    return x

DEBUG = True

# Default language and timezone
BABEL_DEFAULT_LANGUAGE = 'en'
BABEL_DEFAULT_TIMEZONE = 'Europe/Zurich'
I18N_LANGUAGES = [
]

BASE_TEMPLATE = "invenio_theme/page.html"
COVER_TEMPLATE = "invenio_theme/page_cover.html"
SETTINGS_TEMPLATE = 'cap_theme/settings/base.html'

# WARNING: Do not share the secret key - especially do not commit it to
# version control.
SECRET_KEY = "changeme"

# Theme
THEME_SITENAME = _("CERN Analysis Preservation")
THEME_LOGO = "img/cap_logo_lrg.svg"
THEME_GOOGLE_SITE_VERIFICATION = []

REQUIREJS_CONFIG = 'js/cap-build.js'

RECORDS_UI_BASE_TEMPLATE = 'records/detail.html'
RECORDS_UI_TOMBSTONE_TEMPLATE = 'records/detail.html'

# Records configuration
RECORDS_UI_DEFAULT_PERMISSION_FACTORY = "cap.modules.theme.permissions:read_permission_factory"

RECORDS_UI_ENDPOINTS = dict(
    recid=dict(
        pid_type='recid',
        route='/records/<pid_value>',
        template='records/detail.html',
    ),
)

EMAIL_REGEX = '[^@]+@[^@]+\.[^@]+'

CAP_COLLAB_EGROUPS = dict(
    CMS=dict(
        collaboration_cms=[
            "cms-members"
        ]
    ),
    ALICE=dict(
        collaboration_alice=[
            "alice-member"
        ]
    ),
    ATLAS=dict(
        collaboration_atlas=[
            "atlas-active-members-all"
        ]
    ),
    LHCb=dict(
        collaboration_lhcb=[
            "lhcb-general"
        ]
    )
)

ACCOUNTS_REGISTER_BLUEPRINT = False
SECURITY_POST_CHANGE_VIEW = False
SECURITY_RECOVERABLE = False
SECURITY_REGISTERABLE = False
SECURITY_CHANGEABLE = False
OAUTHCLIENT_LOGIN_USER_TEMPLATE = 'access/login_user.html'

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
        item_route='/records/<pid_value>',
        default_media_type='application/json',
    ),
)

# SearchUI API endpoint.
SEARCH_UI_SEARCH_API = '/api/records/'

# Database
# SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://localhost/cap"

# ElasticSearch
SEARCH_ELASTIC_HOSTS = ["localhost:9200"]

# Path to where JSON metadata exist
JSON_METADATA_PATH = "/_metadata"

# Mail
MAIL_SUPPRESS_SEND = True

# OAuth configuration
CERN_APP_CREDENTIALS = {
    'consumer_key': os.environ.get('CERN_APP_CREDENTIALS_KEY'),
    'consumer_secret': os.environ.get('CERN_APP_CREDENTIALS_SECRET'),
}

CERN_REMOTE_APP = copy.deepcopy(cern.REMOTE_APP)
CERN_REMOTE_APP["params"].update({
    'request_token_params': {
        "scope": "Email Groups",
     }
})
OAUTHCLIENT_REMOTE_APPS = {'cern': CERN_REMOTE_APP}
SECURITY_SEND_REGISTER_EMAIL = False

BASE_TEMPLATE = "cap_theme/page.html"
SECURITY_LOGIN_USER_TEMPLATE = "access/login_user.html"
# config.setdefault(
#     'COVER_TEMPLATE', 'invenio_theme/page_cover.html')
# config.setdefault(
#     'SETTINGS_TEMPLATE', 'invenio_theme/page_settings.html')
# config.setdefault(
#     'THEME_BASE_TEMPLATE', config['BASE_TEMPLATE'])
# config.setdefault(
#     'THEME_COVER_TEMPLATE', config['COVER_TEMPLATE'])
# config.setdefault(
#     'THEME_SETTINGS_TEMPLATE', config['SETTINGS_TEMPLATE'])
# config.setdefault(
#     'THEME_ERROR_TEMPLATE', 'invenio_theme/error.html')
# config.setdefault(
#     'THEME_401_TEMPLATE', 'invenio_theme/401.html')
# config.setdefault(
#     'THEME_403_TEMPLATE', 'invenio_theme/403.html')
# config.setdefault(
#     'THEME_404_TEMPLATE', 'invenio_theme/404.html')
# config.setdefault(
#     'THEME_500_TEMPLATE', 'invenio_theme/500.html')

SEARCH_QUERY_ENHANCERS = [
    'cap.modules.access.ext:authenticated_query'
]

JSONSCHEMAS_HOST = 'https://localhost:5000'

ENABLE_SUPERPOWERS_FOR_EVERYONE = False
"""Enable all the users to perform all the actions."""
