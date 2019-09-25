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
"""Pytest configuration."""

from __future__ import absolute_import, print_function

import os
import shutil
import tempfile
from datetime import datetime, timedelta
from uuid import uuid4

import pytest
from flask import current_app
from flask_principal import ActionNeed
from flask_security import login_user
from invenio_access.models import ActionRoles, ActionUsers
from invenio_accounts.testutils import create_test_user
from invenio_app.config import APP_DEFAULT_SECURE_HEADERS
from invenio_db import db as db_
from invenio_deposit.minters import deposit_minter
from invenio_deposit.scopes import write_scope
from invenio_files_rest.models import Location
from invenio_indexer.api import RecordIndexer
from invenio_jsonschemas.errors import JSONSchemaNotFound
from invenio_jsonschemas.proxies import current_jsonschemas
from invenio_oauth2server.models import Client, Token
from invenio_search import current_search, current_search_client
from invenio_pidstore.resolver import Resolver
from sqlalchemy_utils.functions import create_database, database_exists
from werkzeug.local import LocalProxy

from cap.factory import create_api
from cap.modules.deposit.api import CAPDeposit as Deposit
from cap.modules.experiments.permissions import exp_need_factory
from cap.modules.experiments.utils.cms import (
    CMS_TRIGGERS_INDEX, cache_cms_triggers_in_es_from_file)
from cap.modules.experiments.utils.das import (
    DAS_DATASETS_INDEX, cache_das_datasets_in_es_from_file)
from cap.modules.schemas.models import Schema
from cap.modules.schemas.resolvers import resolve_schema_by_url

_datastore = LocalProxy(lambda: current_app.extensions['security'].datastore)


@pytest.fixture(scope='session')
def instance_path():
    """Default instance path."""
    path = tempfile.mkdtemp()

    yield path

    shutil.rmtree(path)


@pytest.fixture(scope='session')
def env_config(instance_path):
    """Default instance path."""
    os.environ.update(APP_INSTANCE_PATH=os.environ.get('INSTANCE_PATH',
                                                       instance_path), )

    return os.environ


@pytest.fixture(scope='session')
def default_config():
    """Default configuration."""

    APP_DEFAULT_SECURE_HEADERS['force_https'] = False
    APP_DEFAULT_SECURE_HEADERS['session_cookie_secure'] = False

    return dict(DEBUG_TB_ENABLED=False,
                APP_DEFAULT_SECURE_HEADERS=APP_DEFAULT_SECURE_HEADERS,
                CELERY_ALWAYS_EAGER=True,
                CELERY_CACHE_BACKEND='memory',
                CELERY_EAGER_PROPAGATES_EXCEPTIONS=True,
                CELERY_RESULT_BACKEND='cache',
                SQLALCHEMY_DATABASE_URI='sqlite:///test.db',
                JSONSCHEMAS_HOST='analysispreservation.cern.ch',
                SERVER_NAME='analysispreservation.cern.ch',
                ACCESS_CACHE=None,
                TESTING=True,
                APP_GITLAB_OAUTH_ACCESS_TOKEN='testtoken')


@pytest.fixture(scope='session')
def app(base_app):
    """Flask application fixture."""
    yield base_app


@pytest.fixture(scope='session')
def create_app():
    return create_api


@pytest.fixture(scope='session')
def base_app(create_app, default_config, request):
    app_ = create_app(**default_config)

    with app_.app_context():
        yield app_


@pytest.fixture
def db(base_app):
    """Setup database."""
    if not database_exists(str(db_.engine.url)):
        create_database(str(db_.engine.url))
    db_.create_all()
    yield db_
    db_.session.remove()
    db_.drop_all()


@pytest.fixture
def location(db):
    """File system location."""
    tmppath = tempfile.mkdtemp()

    loc = Location(name='testloc', uri=tmppath, default=True)
    db.session.add(loc)
    db.session.commit()

    yield loc

    shutil.rmtree(tmppath)


@pytest.fixture()
def users(db):
    """Create users."""
    users = {
        'cms_user':
        create_user_with_access(db.session, 'cms_user@cern.ch', 'cms-access'),
        'cms_user2':
        create_user_with_access(db.session, 'cms_user2@cern.ch', 'cms-access'),
        'alice_user':
        create_user_with_access(db.session, 'alice_user@cern.ch',
                                'alice-access'),
        'alice_user2':
        create_user_with_access(db.session, 'alice_user2@cern.ch',
                                'alice-access'),
        'atlas_user':
        create_user_with_access(db.session, 'atlas_user@cern.ch',
                                'atlas-access'),
        'atlas_user2':
        create_user_with_access(db.session, 'atlas_user2@cern.ch',
                                'atlas-access'),
        'lhcb_user':
        create_user_with_access(db.session, 'lhcb_user@cern.ch',
                                'lhcb-access'),
        'lhcb_user2':
        create_user_with_access(db.session, 'lhcb_user2@cern.ch',
                                'lhcb-access'),
        'superuser':
        create_user_with_access(db.session, 'superuser@cern.ch',
                                'superuser-access'),
    }

    db.session.commit()

    return users


@pytest.fixture()
def superuser(db):
    "Create superuser."
    superuser = create_user_with_access(db.session, 'superuser@cern.ch',
                                        'superuser-access')

    db.session.commit()

    return superuser


@pytest.fixture
def es(base_app):
    """Provide elasticsearch access."""
    list(current_search.delete(ignore=[400, 404]))
    current_search_client.indices.delete(index='*')
    list(current_search.create())
    current_search_client.indices.refresh()
    try:
        yield current_search_client
    finally:
        current_search_client.indices.delete(index='*')


@pytest.fixture
def create_schema(db):
    """Returns function to add a schema to db."""
    resolve_schema_by_url.cache_clear()  # clear schemas resolver cache between the method calls

    def _add_schema(name,
                    deposit_schema=None,
                    is_indexed=True,
                    use_deposit_as_record=True,
                    version="1.0.0",
                    **kwargs):
        """
        Add new schema into db
        """
        default_json = {'title': {'type': 'string'}}

        try:
            schema = Schema.get(name, version)
        except JSONSchemaNotFound:
            schema = Schema(name=name,
                            version=version,
                            is_indexed=is_indexed,
                            use_deposit_as_record=use_deposit_as_record,
                            deposit_schema=deposit_schema or default_json,
                            **kwargs)
            db.session.add(schema)
            db.session.commit()

            if not schema.experiment:
                schema.add_read_access_for_all_users()
                db.session.commit()

        return schema

    yield _add_schema


def bearer_auth(token):
    """Create authentication headers (with a valid oauth2 token)."""
    return [('Authorization', 'Bearer {0}'.format(token['token'].access_token))
            ]


@pytest.fixture
def auth_headers_for_user(base_app, db):
    """Return method to generate write token for user."""
    def _write_token(user):
        """Return json headers with write oauth token for given user."""
        client_ = Client.query.filter_by(user_id=user.id).first()

        if not client_:
            client_ = Client(
                client_id=user.id,
                client_secret='client_secret_{}'.format(user.id),
                name='client_test_{}'.format(user.id),
                description='',
                is_confidential=False,
                user_id=user.id,
                _redirect_uris='',
                _default_scopes='',
            )
            db.session.add(client_)

        token_ = Token.query.filter_by(user_id=user.id).first()

        if not token_:
            token_ = Token(
                client_id=client_.client_id,
                user_id=user.id,
                access_token='dev_access_{}'.format(user.id),
                refresh_token='dev_refresh_{}'.format(user.id),
                expires=datetime.utcnow() + timedelta(hours=10),
                is_personal=False,
                is_internal=True,
                _scopes=write_scope.id,
            )
            db.session.add(token_)
        db.session.commit()

        return bearer_auth(
            dict(token=token_,
                 auth_header=[
                     ('Authorization',
                      'Bearer {0}'.format(token_.access_token)),
                 ]))

    return _write_token


@pytest.fixture
def auth_headers_for_superuser(superuser, auth_headers_for_user):
    return auth_headers_for_user(superuser)


@pytest.fixture
def json_headers():
    """JSON headers."""
    return [('Content-Type', 'application/json'),
            ('Accept', 'application/json')]


@pytest.fixture
def create_deposit(app, db, es, location, create_schema):
    """Returns function to create a new deposit."""
    def minimal_metadata(url):
        return {'$schema': url}

    def _create_deposit(user,
                        schema_name,
                        metadata=None,
                        experiment=None,
                        files={},
                        publish=False):
        """Create a new deposit for given user and schema name.

        e.g cms-analysis-v0.0.1,
        with minimal metadata defined for this schema type.
        """
        # create schema for record
        with app.test_request_context():
            schema = create_schema(schema_name, experiment=experiment)
            deposit_schema_url = current_jsonschemas.path_to_url(
                schema.deposit_path)

            metadata = metadata or minimal_metadata(deposit_schema_url)
            login_user(user)
            id_ = uuid4()
            deposit_minter(id_, metadata)
            deposit = Deposit.create(metadata, id_=id_)

            for k, v in files.items():
                deposit.files[k] = v
            if files:
                deposit.commit()

            db.session.commit()

        if publish:
            deposit.publish()
            _, record = deposit.fetch_published()
            RecordIndexer().index(record)

            current_search.flush_and_refresh(schema.record_index)

        current_search.flush_and_refresh(schema.deposit_index)

        return Deposit.get_record(deposit.id)

    yield _create_deposit


@pytest.fixture
def deposit(superuser, create_deposit):
    """New deposit with files."""
    return create_deposit(superuser, 'cms-analysis')


@pytest.fixture
def record(superuser, create_deposit):
    """Example record."""
    return create_deposit(superuser,
                          'cms-analysis-v0.0.1',
                          experiment='CMS',
                          publish=True)


@pytest.fixture
def record_metadata(deposit):
    """Example record metadata."""
    return deposit.get_record_metadata()


@pytest.fixture
def schema(db):
    """Example schema."""
    schema = Schema(name='test-schema', fullname='Test Schema')
    db.session.add(schema)
    db.session.commit()
    return schema


@pytest.fixture
def cms_user_me_data(users):
    """CMS user data returned by /me endpoint."""
    return {
        "collaborations": [
            "CMS",
        ],
        "current_experiment":
        "CMS",
        "deposit_groups": [{
            "deposit_group": "cms-questionnaire",
            "description": "Create a CMS Questionnaire",
            "name": "CMS Questionnaire"
        }, {
            "deposit_group": "cms-analysis",
            "description":
            "Create a CMS Analysis (analysis metadata, workflows, etc)",
            "name": "CMS Analysis"
        }],
        "email":
        users['cms_user'].email,
        "id":
        users['cms_user'].id
    }


@pytest.fixture
def das_datasets_index(es):
    """Example datasets under DAS datasets index."""
    source = [{
        'name': 'dataset1'
    }, {
        'name': 'dataset2'
    }, {
        'name': 'another_dataset'
    }]

    cache_das_datasets_in_es_from_file(source)

    current_search.flush_and_refresh(DAS_DATASETS_INDEX['alias'])


@pytest.fixture
def cms_triggers_index(es):
    """Example triggers under CMS triggers index."""
    source = [{
        'dataset': 'Dataset1',
        'trigger': 'Trigger1'
    }, {
        'dataset': 'Dataset1',
        'trigger': 'Trigger_2'
    }, {
        'dataset': 'Dataset1',
        'trigger': 'Another_Trigger'
    }, {
        'dataset': 'Dataset2',
        'trigger': 'Trigger1'
    }, {
        'dataset': 'Dataset2',
        'trigger': 'Trigger2'
    }, {
        'dataset': 'Dataset2',
        'trigger': 'Another_One'
    }]

    cache_cms_triggers_in_es_from_file(source)

    current_search.flush_and_refresh(CMS_TRIGGERS_INDEX['alias'])


@pytest.fixture
def get_git_attributes(app, users, auth_headers_for_user, create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1', publish=True)
    pid = deposit['_deposit']['id']
    bucket = deposit.files.bucket
    headers = auth_headers_for_user(owner)

    return owner, deposit, pid, bucket, headers


@pytest.fixture
def create_and_get_uuid(app, users, create_deposit, create_schema):
    owner = users['cms_user']
    create_schema('deposits/records/test-v0.0.1', experiment='CMS')
    deposit = create_deposit(owner, 'test-v0.0.1')
    pid = deposit['_deposit']['id']

    resolver = Resolver(pid_type='depid', object_type='rec', getter=lambda x: x)
    _, uuid = resolver.resolve(pid)
    return str(uuid)


def create_user_with_access(session, username, action):
    user = _datastore.find_user(email=username)

    if not user:
        user = create_test_user(email=username, password='pass')

    session.add(ActionUsers.allow(ActionNeed(action), user=user))

    return user


def assign_egroup_to_experiment(egroup_name, exp):
    role = _datastore.find_or_create_role(egroup_name)
    exp_need = exp_need_factory(exp)

    db_.session.add(ActionRoles.allow(exp_need, role=role))

    db_.session.commit()

    return role


def add_role_to_user(user, rolename):
    role = _datastore.find_or_create_role(rolename)

    _datastore.add_role_to_user(user, role)
