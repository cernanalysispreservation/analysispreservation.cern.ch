# -*- coding: utf-8 -*-

"""cap base Invenio configuration."""

from __future__ import absolute_import, print_function
import os
import copy
from invenio_oauthclient.contrib import cern

# Identity function for string extraction
def _(x):
    return x

# Default language and timezone
BABEL_DEFAULT_LANGUAGE = 'en'
BABEL_DEFAULT_TIMEZONE = 'Europe/Zurich'
I18N_LANGUAGES = [
]

BASE_TEMPLATE = "invenio_theme/page.html"
COVER_TEMPLATE = "invenio_theme/page_cover.html"
SETTINGS_TEMPLATE = "invenio_theme/settings/content.html"

# WARNING: Do not share the secret key - especially do not commit it to
# version control.
SECRET_KEY = "changeme"

# Theme
THEME_SITENAME = _("cap")

REQUIREJS_CONFIG = 'js/cap-build.js'

RECORDS_UI_BASE_TEMPLATE = 'cap_theme/records_ui/detail.html'
RECORDS_UI_TOMBSTONE_TEMPLATE = 'cap_theme/records_ui/detail.html'

# Records configuration
RECORDS_UI_ENDPOINTS = dict(
    record=dict(
        pid_type='recid',
        route='/records/<pid_value>',
        template='cap_theme/records_ui/detail.html',
    ),
)

# Database
# SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://localhost/cap"

# ElasticSearch
ELASTICSEARCH_HOST = "localhost:9200"
SEARCH_ELASTIC_HOSTS = "localhost:9200"

# Mail
MAIL_SUPPRESS_SEND = True

CAP_COLLECTIONS = ['CMS', 'LHCb', 'ATLAS', 'ALICE']

CAP_JSON_FORMS = dict(
    CMS=dict(
        questionnaire=dict(
            name="CMS Questionnaire",
            schema="/cms/cms_questionnaire_schema.json",
            options="/static/jsonschemas/cms/cms_questionnaire_options.js"
        ),
        analysis=dict(
            name="CMS Analysis",
            schema="/cms/cap_demo_short_schema.json",
            options="/static/jsonschemas/cms/cap_analysis.js"
        ),
    ),
    LHCb=dict(
        analysis=dict(
            name="LHCb Analysis",
            schema="/lhcb/lhcb_analysis_schema.json",
            options="/static/jsonschemas/lhcb/lhcb_analysis_options.js"
        ),
    ),
)

DEBUG = True
ASSET_DEBUG = True

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
