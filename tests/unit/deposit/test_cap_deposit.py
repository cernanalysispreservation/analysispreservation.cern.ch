# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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
# or submit itself to any jurisdiction.

"""Unit tests for Cap Deposit class."""

from uuid import uuid4

from cap.modules.deposit.api import CAPDeposit as Deposit
from cap.modules.deposit.errors import EmptyDepositError, WrongJSONSchemaError
from flask_security import login_user
from jsonschema.exceptions import ValidationError
from pytest import raises


def test_create_deposit_with_non_object_data_returns_wrong_schema_error(app,
                                                                        users,
                                                                        location,
                                                                        jsonschemas_host):
    with app.test_request_context():
        metadata = 5
        login_user(users['superuser'])
        id_ = uuid4()
        with raises(EmptyDepositError):
            Deposit.create(metadata, id_=id_)


def test_create_deposit_with_empty_data_returns_wrong_schema_error(app,
                                                                   users,
                                                                   location,
                                                                   jsonschemas_host):
    with app.test_request_context():
        metadata = {}
        login_user(users['superuser'])
        id_ = uuid4()
        with raises(EmptyDepositError):
            Deposit.create(metadata, id_=id_)


def test_create_deposit_with_empty_schema_returns_wrong_schema_error(app,
                                                                     users,
                                                                     location,
                                                                     jsonschemas_host):
    with app.test_request_context():
        metadata = {'$schema': ''}
        login_user(users['superuser'])
        id_ = uuid4()
        with raises(WrongJSONSchemaError):
            Deposit.create(metadata, id_=id_)


def test_create_deposit_with_wrong_schema_returns_wrong_schema_error(app,
                                                                     users,
                                                                     location,
                                                                     jsonschemas_host):
    with app.test_request_context():
        metadata = {
            '$schema': 'https://{}/schemas/deposits/records/lhcb-wrong.json'.format(jsonschemas_host)}
        login_user(users['superuser'])
        id_ = uuid4()
        with raises(WrongJSONSchemaError):
            Deposit.create(metadata, id_=id_)


def test_create_deposit_with_wrong_data_returns_validation_error(app,
                                                                 users,
                                                                 location,
                                                                 jsonschemas_host
                                                                 ):
    with app.test_request_context():
        metadata = {
            '$schema': 'https://{}/schemas/deposits/records/lhcb-v0.0.1.json'.format(jsonschemas_host),
            'general_title': ['I am an array, not a string']
        }
        login_user(users['superuser'])
        id_ = uuid4()
        with raises(ValidationError):
            Deposit.create(metadata, id_=id_)
