# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file
# for more details.
"""Default configuration for CERN Analysis Preservation."""

from __future__ import absolute_import, print_function

import copy
import os
from datetime import timedelta
from os.path import dirname, join

import requests
from flask import request
from flask_principal import RoleNeed
from invenio_deposit import config as deposit_config
from invenio_deposit.config import DEPOSIT_REST_SORT_OPTIONS
from invenio_deposit.scopes import write_scope
from invenio_deposit.utils import check_oauth2_scope
from invenio_oauthclient.contrib.cern import REMOTE_APP as CERN_REMOTE_APP
from invenio_records_rest.config import RECORDS_REST_ENDPOINTS
from invenio_records_rest.facets import terms_filter
from invenio_records_rest.utils import allow_all, deny_all
from jsonresolver import JSONResolver
from jsonresolver.contrib.jsonref import json_loader_factory

from cap.modules.deposit.permissions import (AdminDepositPermission,
                                             CreateDepositPermission,
                                             ReadDepositPermission)
from cap.modules.oauthclient.contrib.cern import disconnect_handler
from cap.modules.oauthclient.rest_handlers import (authorized_signup_handler,
                                                   signup_handler)
from cap.modules.records.permissions import ReadRecordPermission
from cap.modules.search.facets import nested_filter, prefix_filter


def _(x):
    """Identity function used to trigger string extraction."""
    return x


# Rate limiting
# =============
#: Storage for ratelimiter.
RATELIMIT_STORAGE_URL = 'redis://localhost:6379/3'

# I18N
# ====
#: Default language
BABEL_DEFAULT_LANGUAGE = 'en'
#: Default time zone
BABEL_DEFAULT_TIMEZONE = 'Europe/Zurich'
#: Other supported languages (do not include the default language in list).
I18N_LANGUAGES = [('fr', _('French'))]

# Email configuration
# ===================
#: Email address for support.
SUPPORT_EMAIL = "analysis-preservation-support@cern.ch"
#: Disable email sending by default.
MAIL_DEBUG = False
MAIL_SUPPRESS_SEND = True

# Accounts
# ========
#: Allow user to confirm their email address.
SECURITY_CONFIRMABLE = False
"""Allow users to login without first confirming their email address."""
SECURITY_LOGIN_WITHOUT_CONFIRMATION = True
"""Disable sending registration email."""
SECURITY_SEND_REGISTER_EMAIL = False
#: Email address used as sender of account registration emails.
SECURITY_EMAIL_SENDER = SUPPORT_EMAIL
#: Email subject for account registration emails.
SECURITY_EMAIL_SUBJECT_REGISTER = _("Welcome to CERN Analysis Preservation!")
#: Redis session storage URL.
ACCOUNTS_SESSION_REDIS_URL = 'redis://localhost:6379/1'

# Celery configuration
# ====================
BROKER_URL = 'amqp://guest:guest@localhost:5672/'
#: URL of message broker for Celery (default is RabbitMQ).
CELERY_BROKER_URL = 'amqp://guest:guest@localhost:5672/'
#: URL of backend for result storage (default is Redis).
CELERY_RESULT_BACKEND = 'redis://localhost:6379/2'
#: Scheduled tasks configuration (aka cronjobs).
CELERY_BEAT_SCHEDULE = {
    'indexer': {
        'task': 'invenio_indexer.tasks.process_bulk_queue',
        'schedule': timedelta(minutes=5),
    },
    'accounts': {
        'task': 'invenio_accounts.tasks.clean_session_table',
        'schedule': timedelta(minutes=60),
    },
    'cadi_sync': {
        'task': 'cap.modules.experiments.tasks.cms.synchronize_with_cadi',
        'schedule': timedelta(days=1),
    },
    'api_status_check': {
        'task': 'cap.modules.services.views.status_checks.status_check',
        'schedule': timedelta(hours=12),
    },
    'api_status_check_table_cleanup': {
        'task': 'cap.modules.services.views.status_checks.clear_status_table',
        'schedule': timedelta(days=3),
    },
    'ping_webhooks': {
        'task': 'cap.modules.repoimporter.tasks.ping_webhooks',
        'schedule': timedelta(hours=12),
    }
}
#: Accepted content types, used for serializing objects
#: when sending tasks to Celery (json default in 4.0)
# CELERY_ACCEPT_CONTENT = ['pickle', 'json']

# Database
# ========
#: Database URI including user and password
SQLALCHEMY_DATABASE_URI = os.environ.get(
    'APP_SQLALCHEMY_DATABASE_URI',
    'postgresql+psycopg2://cap:cap@localhost/cap')

# JSONSchemas
# ===========
#: Hostname used in URLs for local JSONSchemas.
JSONSCHEMAS_HOST = 'analysispreservation.cern.ch'

SCHEMAS_DEPOSIT_PREFIX = 'deposits/records/'
SCHEMAS_RECORD_PREFIX = 'records/'
SCHEMAS_OPTIONS_PREFIX = 'options/'

# Flask configuration
# ===================
# See details on
# http://flask.pocoo.org/docs/0.12/config/#builtin-configuration-values

#: Secret key - each installation (dev, production, ...) needs a separate key.
#: It should be changed before deploying.
SECRET_KEY = 'CHANGE_ME'
#: Max upload size for form data via application/mulitpart-formdata.
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MiB
#: Sets cookie with the secure flag by default
SESSION_COOKIE_SECURE = False
#: Since HAProxy and Nginx route all requests no matter the host header
#: provided, the allowed hosts variable is set to localhost. In production it
#: should be set to the correct host and it is strongly recommended to only
#: route correct hosts to the application.
APP_ALLOWED_HOSTS = [
    'localhost', 'analysispreservation.web.cern.ch',
    'analysispreservation.cern.ch', 'analysispreservation-dev.web.cern.ch',
    'analysispreservation-dev.cern.ch', 'analysispreservation-qa.web.cern.ch',
    'analysispreservation-qa.cern.ch'
]

if os.environ.get('DEV_HOST', False):
    APP_ALLOWED_HOSTS.append(os.environ.get('DEV_HOST'))

# OAI-PMH
# =======
OAISERVER_ID_PREFIX = 'oai:analysispreservation.cern.ch:'

# Debug
# =====
# Flask-DebugToolbar is by default enabled when the application is running in
# debug mode. More configuration options are available at
# https://flask-debugtoolbar.readthedocs.io/en/latest/#configuration

#: Switches off incept of redirects by Flask-DebugToolbar.
DEBUG_TB_INTERCEPT_REDIRECTS = False

# =======================================================================
# =======================================================================
# =======================================================================

DEBUG_MODE = os.environ.get('DEBUG_MODE', False)
if DEBUG_MODE == 'True':
    DEBUG = True
else:
    DEBUG = False

if DEBUG:
    REST_ENABLE_CORS = True
    APP_ENABLE_SECURE_HEADERS = False

# Path to app root dir
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

# Cache
# =========
#: Cache key prefix
CACHE_KEY_PREFIX = "cache::"
#: Host
CACHE_REDIS_HOST = "localhost"
#: Port
CACHE_REDIS_PORT = 6379
#: DB
CACHE_REDIS_DB = 0
#: URL of Redis db.
CACHE_REDIS_URL = "redis://{0}:{1}/{2}".format(CACHE_REDIS_HOST,
                                               CACHE_REDIS_PORT,
                                               CACHE_REDIS_DB)
#: Default cache type.
CACHE_TYPE = "redis"
#: Default cache URL for sessions.
ACCESS_SESSION_REDIS_HOST = os.environ.get('APP_ACCESS_SESSION_REDIS_HOST',
                                           'localhost')
ACCOUNTS_SESSION_REDIS_URL = "redis://localhost:6379/2"
#: Cache for storing access restrictions
ACCESS_CACHE = 'cap.modules.cache:current_cache'

#: E-Groups for superuser rights
SUPERUSER_EGROUPS = [
    RoleNeed('analysis-preservation-support@cern.ch'),
    RoleNeed('data-preservation-admins@cern.ch'),
]

# Records
# =======
#: Records sort/facets options
RECORDS_REST_SORT_OPTIONS = dict(records=dict(
    bestmatch=dict(
        title=_('Best match'),
        fields=['_score'],
        order=1,
    ),
    mostrecent=dict(
        title=_('Most recent'),
        fields=['_updated'],
        default_order='desc',
        order=2,
    ),
))

RECORDS_REST_SORT_OPTIONS.update(DEPOSIT_REST_SORT_OPTIONS)

#: Record search facets.
# for aggregations, only ones starting with facet_ will be displayed on a page
CAP_FACETS = {
    'aggs': {
        'facet_type': {
            'terms': {
                'field': '_type'
            }
        },
        'facet_cadi_status': {
            'terms': {
                'field': 'cadi_status'
            }
        },
        'facet_publication_status': {
            'terms': {
                'field': 'publication_status.keyword'
            }
        },
        'facet_cms_working_group': {
            'terms': {
                "script": "doc.containsKey('cadi_id') ? doc['cadi_id'].value?.substring(0,3) : null"  # noqa
            }
        },
        "particles": {
            "nested": {
                "path": "main_measurements.signal_event_selection"
                        ".physics_objects"
            },
            "aggs": {
                "facet_physics_objects": {
                    "terms": {
                        "field": "main_measurements.signal_event_selection"
                                 ".physics_objects.object",
                        "exclude": ""
                    },
                    "aggs": {
                        "doc_count": {
                            "reverse_nested": {}
                        },
                        "facet_physics_objects_type": {
                            "terms": {
                                "field": "main_measurements"
                                         ".signal_event_selection"
                                         ".physics_objects"
                                         ".object_type.keyword"
                            },
                            "aggs": {
                                "doc_count": {
                                    "reverse_nested": {}
                                }
                            }
                        }
                    }
                },
            }
        },
    },
    'post_filters': {
        'type': terms_filter('_type'),
        'cms_working_group': prefix_filter('cadi_id'),
        'publication_status': terms_filter('publication_status.keyword'),
        'cadi_status': terms_filter('cadi_status'),
        'conference': terms_filter('conference'),
        'physics_objects': nested_filter(
            'main_measurements.signal_event_selection.physics_objects',
            'main_measurements.signal_event_selection'
            '.physics_objects.object'),
        'physics_objects_type': nested_filter(
            'main_measurements.signal_event_selection.physics_objects',
            'main_measurements.signal_event_selection.physics_objects'
            '.object_type.keyword')
    }
}

RECORDS_REST_FACETS = {'deposits': CAP_FACETS, 'records': CAP_FACETS}

#: Records REST API endpoints.
RECORDS_REST_ENDPOINTS = copy.deepcopy(RECORDS_REST_ENDPOINTS)

RECORDS_REST_ENDPOINTS['recid'].update({
    'record_class': 'cap.modules.records.api:CAPRecord',
    'pid_fetcher': 'cap_record_fetcher',
    'search_class': 'cap.modules.records.search:CAPRecordSearch',
    'search_factory_imp': 'cap.modules.search.query:cap_search_factory',
    'record_serializers': {
        'application/json': ('cap.modules.records.serializers'
                             ':record_json_v1_response'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_response'),
        'application/form+json': ('cap.modules.records.serializers'
                                  ':record_form_json_v1_response'),
    },
    'search_serializers': {
        'application/json': ('cap.modules.records.serializers'
                             ':record_json_v1_search'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_search'),
    },
    'read_permission_factory_imp': check_oauth2_scope(
        lambda record: ReadRecordPermission(record).can(), write_scope.id),
    'links_factory_imp': 'cap.modules.records.links:links_factory',
})

#: Default api endpoint for LHCb db
GRAPHENEDB_URL = 'http://datadependency.cern.ch:7474'

#: Account-REST Configuration
ACCOUNTS_REST_READ_ROLE_PERMISSION_FACTORY = deny_all
"""Default get role permission factory: reject any request."""

ACCOUNTS_REST_UPDATE_ROLE_PERMISSION_FACTORY = deny_all
"""Default update role permission factory: reject any request."""

ACCOUNTS_REST_DELETE_ROLE_PERMISSION_FACTORY = deny_all
"""Default delete role permission factory: reject any request."""

ACCOUNTS_REST_READ_ROLES_LIST_PERMISSION_FACTORY = deny_all
"""Default list roles permission factory: reject any request."""

ACCOUNTS_REST_CREATE_ROLE_PERMISSION_FACTORY = deny_all
"""Default create role permission factory: reject any request."""

ACCOUNTS_REST_ASSIGN_ROLE_PERMISSION_FACTORY = deny_all
"""Default assign role to user permission factory: reject any request."""

ACCOUNTS_REST_UNASSIGN_ROLE_PERMISSION_FACTORY = deny_all
"""Default unassign role from user permission factory: reject any request."""

ACCOUNTS_REST_READ_USER_ROLES_LIST_PERMISSION_FACTORY = deny_all
"""Default list users roles permission factory: reject any request."""

ACCOUNTS_REST_READ_USER_PROPERTIES_PERMISSION_FACTORY = allow_all
"""Default read user properties permission factory: reject any request."""

ACCOUNTS_REST_UPDATE_USER_PROPERTIES_PERMISSION_FACTORY = deny_all
"""Default modify user properties permission factory: reject any request."""

ACCOUNTS_REST_READ_USERS_LIST_PERMISSION_FACTORY = allow_all
"""Default list users permission factory: reject any request."""

# Search
# ======
#: Default API endpoint for search UI.
SEARCH_UI_SEARCH_API = '/api/deposits/'

#: Default ElasticSearch hosts
es_user = os.environ.get('ELASTICSEARCH_USER')
es_password = os.environ.get('ELASTICSEARCH_PASSWORD')
if es_user and es_password:
    es_params = dict(
        http_auth=(es_user, es_password),
        use_ssl=str(os.environ.get('ELASTICSEARCH_USE_SSL')).lower() == 'true',
        verify_certs=str(
            os.environ.get('ELASTICSEARCH_VERIFY_CERTS')).lower() == 'true',
        url_prefix=os.environ.get('ELASTICSEARCH_URL_PREFIX', ''),
    )
else:
    es_params = {}

SEARCH_ELASTIC_HOSTS = [
    dict(host=os.environ.get('ELASTICSEARCH_HOST', 'localhost'),
         port=int(os.environ.get('ELASTICSEARCH_PORT', '9200')),
         **es_params)
]

SEARCH_GET_MAPPINGS_IMP = 'cap.modules.schemas.imp.get_mappings'

# Admin
# ========
ADMIN_PERMISSION_FACTORY =  \
    'cap.modules.access.permissions.admin_permission_factory'

# Logging
# =======
#: CERN OAuth configuration
CERN_APP_CREDENTIALS = {
    'consumer_key': os.environ.get('INVENIO_CERN_APP_CREDENTIALS_KEY'),
    'consumer_secret': os.environ.get('INVENIO_CERN_APP_CREDENTIALS_SECRET')
}

# Update CERN OAuth handlers - due to REST - mostly only redirect urls
# and error flashing
CERN_REMOTE_APP.update(
    dict(
        authorized_handler=authorized_signup_handler,
        disconnect_handler=disconnect_handler,
    ))

CERN_REMOTE_APP['signup_handler']['view'] = signup_handler

#: Defintion of OAuth client applications.
OAUTHCLIENT_REMOTE_APPS = dict(cern=CERN_REMOTE_APP, )

# JSON Schemas
# ============
#: Path to where JSON metadata exist
JSON_METADATA_PATH = "/_metadata"
JSONSCHEMAS_ENDPOINT = '/schemas'

JSONSCHEMAS_RESOLVE_SCHEMA = True

JSONSCHEMAS_LOADER_CLS = json_loader_factory(
    JSONResolver(plugins=[
        'cap.modules.schemas.resolvers', 'cap.modules.schemas.resolvers_api'
    ], ))

# WARNING: Do not share the secret key - especially do not commit it to
# version control.
SECRET_KEY = "changeme"

# LHCb
# ========
#: Ana's database
LHCB_ANA_DB = 'http://datadependency.cern.ch'
LHCB_GETCOLLISIONDATA_URL = '{0}/getRecoStripSoft?propass='.format(LHCB_ANA_DB)
LHCB_GETPLATFORM_URL = '{0}/getPlatform?app='.format(LHCB_ANA_DB)

# CMS
# ========
#: Kerberos credentials
CMS_USER_PRINCIPAL = os.environ.get('APP_CMS_USER_PRINCIPAL')
CMS_USER_KEYTAB = os.environ.get('APP_CMS_USER_KEYTAB')
#: CADI database
CADI_AUTH_URL = 'https://icms.cern.ch/tools/api/cadiLine/BPH-13-009'
CADI_GET_CHANGES_URL = 'https://icms.cern.ch/tools/api/updatedCadiLines/'
CADI_GET_ALL_URL = 'https://icms.cern.ch/tools/api/viewCadiLines'
CADI_GET_RECORD_URL = 'https://icms.cern.ch/tools/api/cadiLine/{id}'

# ATLAS
# ========
#: Glance database
GLANCE_CLIENT_ID = os.environ.get('APP_GLANCE_CLIENT_ID')
GLANCE_CLIENT_PASSWORD = os.environ.get('APP_GLANCE_CLIENT_PASSWORD')
#: Glance API URLs
GLANCE_GET_TOKEN_URL = \
    'https://oraweb.cern.ch/ords/atlr/atlas_authdb/oauth/token'
GLANCE_GET_ALL_URL = \
    'https://oraweb.cern.ch/ords/atlr/atlas_authdb/atlas/analysis/analysis/?client_name=cap'  # noqa
GLANCE_GET_BY_ID_URL = \
    'https://oraweb.cern.ch/ords/atlr/atlas_authdb/atlas/analysis/analysis/?client_name=cap&id={id}'  # noqa

# Deposit
# ============
#: Default jsonschema for deposit
DEPOSIT_DEFAULT_JSONSCHEMA = 'deposits/records/lhcb-v0.0.1.json'
#: Default schemanform for deposit
DEPOSIT_DEFAULT_SCHEMAFORM = 'json/deposits/records/lhcb-v0.0.1.json'
#: Search api url for deposit
DEPOSIT_SEARCH_API = '/api/deposits/'
#: Files api url for deposit
DEPOSIT_FILES_API = '/api/files'

DEPOSIT_PID_MINTER = 'cap_record_minter'

DEPOSIT_REST_ENDPOINTS = copy.deepcopy(deposit_config.DEPOSIT_REST_ENDPOINTS)
_PID = 'pid(depid,record_class="cap.modules.deposit.api:CAPDeposit")'

DEPOSIT_UI_SEARCH_INDEX = '*'

# DEPOSIT_PID_MINTER is used on publish method in deposit class
DEPOSIT_REST_ENDPOINTS['depid'].update({
    'pid_type': 'depid',
    'pid_minter': 'cap_deposit_minter',
    'pid_fetcher': 'cap_deposit_fetcher',
    'record_class': 'cap.modules.deposit.api:CAPDeposit',
    'record_loaders': {
        'application/json': 'cap.modules.deposit.loaders:json_v1_loader',
        'application/json-patch+json': lambda: request.get_json(force=True),
    },
    'record_serializers': {
        'application/json': ('cap.modules.deposit.serializers'
                             ':deposit_json_v1_response'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_response'),
        'application/permissions+json': ('cap.modules.records.serializers'
                                         ':permissions_json_v1_response'),
        'application/form+json': ('cap.modules.deposit.serializers'
                                  ':deposit_form_json_v1_response')
    },
    'search_serializers': {
        'application/json': ('cap.modules.deposit.serializers'
                             ':deposit_json_v1_search'),
        'application/basic+json': ('cap.modules.records.serializers'
                                   ':basic_json_v1_search')
    },
    'files_serializers': {
        'application/json': ('cap.modules.deposit.serializers:files_response'),
    },
    'search_class': 'cap.modules.deposit.search:CAPDepositSearch',
    'search_factory_imp': 'cap.modules.search.query:cap_search_factory',
    'item_route': '/deposits/<{0}:pid_value>'.format(_PID),
    'file_list_route': '/deposits/<{0}:pid_value>/files'.format(_PID),
    'file_item_route':
        '/deposits/<{0}:pid_value>/files/<path:key>'.format(_PID),
    'create_permission_factory_imp': check_oauth2_scope(
        lambda record: CreateDepositPermission(record).can(), write_scope.id),
    'read_permission_factory_imp': check_oauth2_scope(
        lambda record: ReadDepositPermission(record).can(), write_scope.id),
    'update_permission_factory_imp': allow_all,
    'delete_permission_factory_imp': check_oauth2_scope(
        lambda record: AdminDepositPermission(record).can(), write_scope.id),
    'links_factory_imp': 'cap.modules.deposit.links:links_factory',
})

# Datadir
# =======
DATADIR = join(dirname(__file__), 'data')

# Files
# ===========
FILES_REST_PERMISSION_FACTORY = \
    'cap.modules.deposit.permissions:files_permission_factory'

# Grab files max size
FILES_URL_MAX_SIZE = (2**20) * 5000

# Header for updating file tags
FILES_REST_FILE_TAGS_HEADER = 'X-CAP-File-Tags'

# Indexer
# =======
#: Flag for not replacing refs when creating deposit
INDEXER_REPLACE_REFS = False

# LHCB DB files location
# ======================
LHCB_DB_FILES_LOCATION = os.environ.get(
    'APP_LHCB_FILES_LOCATION',
    os.path.join(APP_ROOT, 'modules/experiments/static/example_lhcb/'))

# Disable JWT token
ACCOUNTS_JWT_ENABLE = False

# Github and Gitlab oauth tokens
# ==============================
GITHUB_OAUTH_ACCESS_TOKEN = os.environ.get('APP_GITHUB_OAUTH_ACCESS_TOKEN')
GITLAB_OAUTH_ACCESS_TOKEN = os.environ.get('APP_GITLAB_OAUTH_ACCESS_TOKEN')

# Reana server url
# ================
REANA_ACCESS_TOKEN = {
    'ATLAS': os.environ.get('APP_REANA_ATLAS_ACCESS_TOKEN'),
    'ALICE': os.environ.get('APP_REANA_ALICE_ACCESS_TOKEN'),
    'CMS': os.environ.get('APP_REANA_CMS_ACCESS_TOKEN'),
    'LHCb': os.environ.get('APP_REANA_LHCb_ACCESS_TOKEN')
}

# Keytabs
KEYTABS_LOCATION = os.environ.get('APP_KEYTABS_LOCATION', '/etc/keytabs')

KRB_PRINCIPALS = {'CADI': (CMS_USER_PRINCIPAL, CMS_USER_KEYTAB)}

CERN_CERTS_PEM = os.environ.get('APP_CERN_CERTS_PEM')

# Zenodo
# ======
ZENODO_SERVER_URL = os.environ.get('APP_ZENODO_SERVER_URL',
                                   'https://zenodo.org/api')

ZENODO_ACCESS_TOKEN = os.environ.get('APP_ZENODO_ACCESS_TOKEN', 'CHANGE_ME')

# Endpoints
# =========
DEPOSIT_UI_ENDPOINT = '{scheme}://{host}/drafts/{pid_value}'
RECORDS_UI_ENDPOINT = '{scheme}://{host}/published/{pid_value}'

# Webhooks & ngrok init
# =====================
# In order to debug webhooks, we need a tunnel to our local instance
# so we make sure that we have an ngrok tunnel running, and add it
# to the allowed hosts (to enable requests)
TEST_WITH_NGROK = os.environ.get('CAP_TEST_WITH_NGROK', False)
if DEBUG_MODE == 'True' and TEST_WITH_NGROK is True:
    try:
        resp = requests.get('http://localhost:4040/api/tunnels',
                            headers={'Content-Type': 'application/json'})
        NGROK_HOST = resp.json()['tunnels'][0]['public_url']
        APP_ALLOWED_HOSTS.append(NGROK_HOST.split('//')[-1])
        WEBHOOK_NGROK_URL = '{}/repos/event'.format(NGROK_HOST)
        print('* Webhook url at {}'.format(WEBHOOK_NGROK_URL))
    except (IndexError, KeyError):
        print('Ngrok is not running.')

WEBHOOK_ENDPOINT = 'cap_repos.get_webhook_event'
