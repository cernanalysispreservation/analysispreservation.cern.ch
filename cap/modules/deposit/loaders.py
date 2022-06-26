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
"""CAP Deposit loaders."""

from copy import deepcopy

from flask import current_app, request
from flask_login import current_user
from flask_principal import RoleNeed
from invenio_access.permissions import Permission
from jsonschema import Draft4Validator
from jsonschema.validators import extend

from cap.modules.deposit.errors import XCAPPermissionValidationError
from cap.modules.deposit.utils import clean_empty_values


def json_v1_loader(data=None):
    """Load data from request and process URLs."""
    data = deepcopy(data or request.get_json())

    # remove underscore prefixed fields
    data = {k: v for k, v in data.items() if not k.startswith('_')}

    result = clean_empty_values(data)

    return result


def get_val_from_path(d, p):
    sentinel = object()
    for s in p:
        try:
            d = d.get(s, sentinel)
        except AttributeError:
            return d
        if d is sentinel:
            return None
    return d


def validate_field_schema_editing(validator, value, instance, schema):
    allowed_users = value.get('users')
    allowed_roles = value.get('roles')
    error_message = value.get('error_message', 'You cannot edit this field.')

    error = True
    if allowed_users:
        current_user_email = current_user.email
        if current_user_email in allowed_users:
            error = False

    if allowed_roles and error:
        user_allowed = any(Permission(RoleNeed(_role)).can() for _role in allowed_roles)
        error = False if user_allowed else True

    if error:
        yield XCAPPermissionValidationError(error_message)


def get_validator(schema):
    """Validator for checking field level validation."""
    field_schema_editing_validator = dict()
    field_schema_editing_validator['x-cap-permission'] = validate_field_schema_editing
    field_schema_validator = extend(
        Draft4Validator, validators=field_schema_editing_validator, type_checker=None
    )
    resolver = current_app.extensions['invenio-records'].ref_resolver_cls.from_schema(
        schema
    )
    validator = extend(field_schema_validator, {'required': None})
    validator = validator(schema, resolver=resolver)

    return validator
