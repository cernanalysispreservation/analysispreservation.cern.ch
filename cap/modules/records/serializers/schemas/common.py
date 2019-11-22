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
"""CAP Marshmallow Schemas."""

from flask_login import current_user
from invenio_accounts.models import Role, User
from marshmallow import Schema, ValidationError, fields, validates_schema

from cap.modules.schemas.resolvers import resolve_schema_by_url
from cap.modules.user.utils import get_role_name_by_id, get_user_email_by_id


class StrictKeysMixin(object):
    """Ensure only defined keys exists in data."""
    @validates_schema(pass_original=True)
    def check_unknown_fields(self, data, original_data):
        """Check for unknown keys."""
        if not isinstance(original_data, list):
            items = [original_data]
        else:
            items = original_data
        for original_data in items:
            for key in original_data:
                if key not in self.fields:
                    raise ValidationError(
                        'Unknown field name.'.format(key),
                        field_names=[key],
                    )


class CommonRecordSchema(Schema, StrictKeysMixin):
    """Base record schema."""

    id = fields.Str(attribute='pid.pid_value', dump_only=True)

    schema = fields.Method('get_schema', dump_only=True)

    experiment = fields.Str(attribute='metadata._experiment', dump_only=True)
    status = fields.Str(attribute='metadata._deposit.status', dump_only=True)
    created_by = fields.Method('get_created_by', dump_only=True)
    is_owner = fields.Method('is_current_user_owner', dump_only=True)

    metadata = fields.Method('get_metadata', dump_only=True)

    links = fields.Raw(dump_only=True)
    files = fields.Method('get_files', dump_only=True)

    access = fields.Method('get_access', dump_only=True)

    created = fields.Str(dump_only=True)
    updated = fields.Str(dump_only=True)

    revision = fields.Integer(dump_only=True)

    def is_current_user_owner(self, obj):
        user_id = obj['metadata']['_deposit'].get('created_by')
        if user_id and current_user:
            return user_id == current_user.id
        return False

    def get_files(self, obj):
        return obj['metadata'].get('_files', [])

    def get_schema(self, obj):
        schema = resolve_schema_by_url(obj['metadata']['$schema'])
        result = {'name': schema.name, 'version': schema.version}
        return result

    def get_metadata(self, obj):
        result = {
            k: v
            for k, v in obj.get('metadata', {}).items()
            if k not in [
                'control_number', '$schema', '_deposit', '_experiment',
                '_access', '_files'
            ]
        }
        return result

    def get_created_by(self, obj):
        user_id = obj['metadata']['_deposit'].get('created_by')
        if user_id:
            user = User.query.filter_by(id=user_id).one()
            return user.email
        return None

    def get_access(self, obj):
        """Return access object."""
        access = obj['metadata']['_access']

        for permission in access.values():
            if permission['users']:
                for index, user_id in enumerate(permission['users']):
                    permission['users'][index] = get_user_email_by_id(user_id)
            if permission['roles']:
                for index, role_id in enumerate(permission['roles']):
                    permission['roles'][index] = get_role_name_by_id(role_id)

        return access
