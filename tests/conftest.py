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
from copy import deepcopy
from datetime import datetime, timedelta
from uuid import uuid4

from flask import current_app
from werkzeug.local import LocalProxy

import pytest
from cap.factory import create_api
from cap.modules.deposit.api import CAPDeposit as Deposit
from elasticsearch.exceptions import RequestError
from flask_security import login_user
from invenio_access.models import ActionUsers
from invenio_accounts.testutils import create_test_user
from invenio_admin.permissions import action_admin_access
from invenio_db import db as db_
from invenio_deposit.minters import deposit_minter
from invenio_deposit.permissions import \
    action_admin_access as deposit_admin_access
from invenio_deposit.scopes import write_scope
from invenio_files_rest.models import Location
from invenio_oauth2server.models import Client, Token
from invenio_search import current_search, current_search_client
from sqlalchemy_utils.functions import create_database, database_exists


@pytest.yield_fixture(scope='session')
def instance_path():
    """Default instance path."""
    path = tempfile.mkdtemp()

    yield path

    shutil.rmtree(path)


@pytest.fixture(scope='session')
def env_config(instance_path):
    """Default instance path."""
    os.environ.update(
        APP_INSTANCE_PATH=os.environ.get(
            'INSTANCE_PATH', instance_path),
    )

    return os.environ


@pytest.fixture(scope='session')
def default_config():
    """Default configuration."""
    return dict(
        DEBUG_TB_ENABLED=False,
        SQLALCHEMY_DATABASE_URI=os.environ.get(
            'SQLALCHEMY_DATABASE_URI', 'sqlite:///test.db'),
        TESTING=True,
    )


@pytest.yield_fixture(scope='session')
def app(env_config, default_config):
    """Flask application fixture."""
    app = create_api(**default_config)

    with app.app_context():
        yield app


@pytest.yield_fixture(scope='session')
def db(app):
    """Setup database."""
    if not database_exists(str(db_.engine.url)):
        create_database(str(db_.engine.url))
    db_.create_all()
    yield db_
    db_.session.remove()
    db_.drop_all()


@pytest.yield_fixture(scope='function')
def es(app):
    """Provide elasticsearch access."""
    try:
        list(current_search.create())
    except RequestError:
        list(current_search.delete(ignore=[400, 404]))
        list(current_search.create())
    current_search_client.indices.refresh()
    yield current_search_client
    list(current_search.delete(ignore=[404]))


def create_user_with_role(username, rolename):
    _datastore = LocalProxy(
        lambda: current_app.extensions['security'].datastore)

    user, role = _datastore._prepare_role_modify_args(username, rolename)

    if not user:
        user = create_test_user(email=username, password='pass')
    if not role:
        role = _datastore.create_role(name=rolename)

    _datastore.add_role_to_user(user, role)

    return user


@pytest.fixture(scope='session')
def users(app, db):
    """Create users."""
    users = {
        'cms_user': create_user_with_role('cms_user@cern.ch',
                                          'cms-members@cern.ch'),
        'cms_user2': create_user_with_role('cms_user2@cern.ch',
                                           'cms-members@cern.ch'),
        'alice_user': create_user_with_role('alice_user@cern.ch',
                                            'alice-member@cern.ch'),
        'alice_user2': create_user_with_role('alice_user2@cern.ch',
                                             'alice-member@cern.ch'),
        'atlas_user': create_user_with_role('atlas_user@cern.ch',
                                            'atlas-active-members-all@cern.ch'),
        'atlas_user2': create_user_with_role('atlas_user2@cern.ch',
                                             'atlas-active-members-all@cern.ch'),
        'lhcb_user': create_user_with_role('lhcb_user@cern.ch',
                                           'lhcb-general@cern.ch'),
        'lhcb_user2': create_user_with_role('lhcb_user2@cern.ch',
                                            'lhcb-general@cern.ch'),
        'superuser': create_user_with_role('superuser@cern.ch',
                                           'analysis-preservation-support@cern.ch'),
    }

    return users


@pytest.fixture
def auth_headers_for_superuser(users, auth_headers_for_user):
    return auth_headers_for_user(users['superuser'])


@pytest.fixture()
def auth_headers_for_user(app, db, es, json_headers):
    """Return method to generate write token for user."""
    def _write_token(user):
        """Return json headers with write oauth token for given user."""
        client_ = Client.query.filter_by(
            user_id=user.id
        ).first()

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

        token_ = Token.query.filter_by(
            user_id=user.id
        ).first()

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

        return bearer_auth(json_headers, dict(
            token=token_,
            auth_header=[
                ('Authorization', 'Bearer {0}'.format(token_.access_token)),
            ]
        ))

    return _write_token


@pytest.fixture
def json_headers():
    """JSON headers."""
    return [('Content-Type', 'application/json'),
            ('Accept', 'application/json')]


@pytest.yield_fixture(scope='session')
def location(db):
    """File system location."""
    tmppath = tempfile.mkdtemp()

    loc = Location(
        name='testloc',
        uri=tmppath,
        default=True
    )
    db.session.add(loc)
    db.session.commit()

    yield loc

    shutil.rmtree(tmppath)


def minimal_deposits_metadata(schema_name):
    """Returns minimal metadata for each type of schema."""
    schema_name_to_metadata = {
        'cms-analysis-v0.0.1': {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v0.0.1.json',
            'basic_info': {
                'analysis_number': 'dream_team',
                'people_info': [
                    {}
                ]
            }
        },
        'cms-questionnaire-v0.0.1': {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-questionnaire-v0.0.1.json',
        },
        'cms-auxiliary-measurements-v0.0.1': {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-auxiliary-measurements-v0.0.1.json',
        },
        'lhcb-v0.0.1': {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/lhcb-v0.0.1.json',
        },
        'alice-analysis-v0.0.1': {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/alice-analysis-v0.0.1.json',
        },
        'atlas-analysis-v0.0.1': {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/atlas-analysis-v0.0.1.json',
        },
        'atlas-workflows-v0.0.1': {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/atlas-workflows-v0.0.1.json',
        }
    }

    return schema_name_to_metadata[schema_name]


@pytest.fixture(scope='function')
def create_deposit(app, db, es, location):
    """Returns function to create a new deposit."""
    db_.session.begin_nested()

    def _create_deposit(user, schema):
        """
        Create a new deposit for given user and schema name
        e.g cms-analysis-v0.0.1,
        with minimal metadata defined for this schema type.
        """
        db_.session.begin_nested()
        with app.test_request_context():
            metadata = minimal_deposits_metadata(schema)
            login_user(user)
            id_ = uuid4()
            deposit_minter(id_, metadata)
            deposit = Deposit.create(metadata, id_=id_)
        current_search.flush_and_refresh('deposits-records-{}'.format(schema))
        return deposit

    yield _create_deposit
    db_.session.rollback()


def bearer_auth(headers, token):
    """Create authentication headers (with a valid oauth2 token)."""
    headers = deepcopy(headers)
    headers.append(
        ('Authorization', 'Bearer {0}'.format(token['token'].access_token))
    )
    return headers
