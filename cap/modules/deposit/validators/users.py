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
"""Deposit validators."""

from flask_login import current_user
from flask_principal import RoleNeed
from invenio_access.permissions import Permission
from jsonschema.exceptions import ValidationError


# Validate for schema field permissions
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
            Permission(RoleNeed(_role)).can() for _role in allowed_roles
        )
        error = False if user_allowed else True

    if error:
        yield ValidationError(error_message)


def find_field_copy(validator, value, instance, schema, **kwargs):
    yield ValidationError("x-cap-copy")
