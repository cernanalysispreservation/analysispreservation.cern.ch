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

from flask import current_app, request, jsonify
from flask_login import current_user
from flask_principal import RoleNeed
from jsonschema import Draft4Validator
from jsonschema.validators import extend
from jsonschema.exceptions import ValidationError

from invenio_access.permissions import Permission
from invenio_records.models import RecordMetadata
from invenio_pidstore.resolver import Resolver
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_rest.errors import FieldError

from cap.modules.records.errors import get_error_path
from cap.modules.deposit.errors import DepositValidationError
from cap.modules.deposit.utils import clean_empty_values
from cap.modules.schemas.resolvers import schema_name_to_url


def json_v1_loader(data=None):
    """Load data from request and process URLs."""
    data = deepcopy(data or request.get_json())

    # remove underscore prefixed fields
    data = {k: v for k, v in data.items() if not k.startswith('_')}

    result = clean_empty_values(data)

    # Validate for schema field permissions
    if request.method == 'PUT':
        pid = request.url.split('/')[-1]
        field_schema_editing_validator_with_pid(pid, result)
    elif request.method == 'POST':
        field_schema_editing_validator_without_pid(result)
    return result


def get_field_level_schema(field, current_value=None):
    """Return the value of field from the specified data dictionary."""
    if field in current_value:
        return current_value[field]
    for _value in current_value.values():
        if isinstance(_value, dict):
            value = get_field_level_schema(field, _value)
            if value is not None:
                return value
    return None


def resolve_depid(pid):
    """Resolve the workflow id into a UUID."""
    try:
        resolver = Resolver(pid_type='depid',
                            object_type='rec',
                            getter=lambda x: x)
        _, rec_uuid = resolver.resolve(pid)
        return rec_uuid
    except PIDDoesNotExistError:
        return jsonify({'message': 'You tried to provide a non-existing record'}), 404


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
        user_allowed = any(
            Permission(RoleNeed(_role)).can()
            for _role in allowed_roles)
        error = False if user_allowed else True

    if error:
        yield ValidationError(error_message)


def get_current_value(error_path, current_value=None):
    for path in error_path:
        current_value = get_field_level_schema(path, current_value)
    return current_value


def get_validator(schema):
    """Validator for checking field level validation."""
    field_schema_editing_validator = dict()
    field_schema_editing_validator['x-cap-permission'] = validate_field_schema_editing
    field_schema_validator = extend(Draft4Validator,
                                    validators=field_schema_editing_validator,
                                    type_checker=None)
    resolver = current_app.extensions[
        'invenio-records'].ref_resolver_cls.from_schema(schema)
    validator = extend(field_schema_validator, {'required': None})
    validator = validator(schema, resolver=resolver)

    return validator


def field_schema_editing_validator_with_pid(pid, data):
    rec_uuid = resolve_depid(pid)
    _record_metadata = RecordMetadata.query.filter_by(id=rec_uuid).one_or_none()
    schema = {'$ref': _record_metadata.json.get('$schema')}
    validator = get_validator(schema)

    errors = []
    for err in validator.iter_errors(data):
        error_path = get_error_path(err)
        current_version = get_current_value(
            error_path, current_value=_record_metadata.json)
        incoming_version = get_current_value(error_path, current_value=data)
        if current_version != incoming_version:
            errors.append(FieldError(error_path, str(err.message)))

    if errors:
        raise DepositValidationError(None, errors=errors)

    return data


def field_schema_editing_validator_without_pid(data):
    if '$schema' in data:
        schema = data.get('$schema')
    elif '$ana_type' in data:
        schema = schema_name_to_url(data.get('$ana_type'))
    validator = get_validator({'$ref': schema})

    errors = []
    for err in validator.iter_errors(data):
        errors.append(FieldError(get_error_path(err), str(err.message)))
    if errors:
        raise DepositValidationError(None, errors=errors)

    return data
