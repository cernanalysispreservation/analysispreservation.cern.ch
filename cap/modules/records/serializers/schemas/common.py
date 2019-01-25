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

from invenio_access.models import ActionRoles, ActionUsers
from invenio_search import current_search
from invenio_search.utils import schema_to_index
from marshmallow import Schema, ValidationError, fields, validates_schema


def schema_prefix(schema):
    """Get index prefix for a given schema."""
    if not schema:
        return None
    index, doctype = schema_to_index(
        schema, index_names=current_search.mappings.keys())
    return index.split('-')[0]


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


class CommonRecordSchemaV1(Schema, StrictKeysMixin):
    """Common record schema."""

    id = fields.Str(attribute='pid.pid_value', dump_only=True)

    schema = fields.Str(attribute='metadata.$schema', dump_only=True)
    status = fields.Str(attribute='metadata._deposit.status', dump_only=True)
    published = fields.Raw(attribute='metadata._deposit.pid', dump_only=True)
    owners = fields.List(fields.Integer,
                         attribute='metadata.owners',
                         dump_only=True)

    created = fields.Str(dump_only=True)
    links = fields.Raw()

    files = fields.Raw(dump_only=True)

    access = fields.Method('get_access', dump_only=True)

    def get_access(self, obj):
        """Return access object."""
        _uuid = obj.get('pid', None)
        if _uuid is not None:
            _uuid = _uuid.object_uuid

        action_users = ActionUsers.query.filter(
            ActionUsers.argument == str(_uuid)).all()

        action_roles = ActionRoles.query.filter(
            ActionRoles.argument == str(_uuid)).all()

        _access = []
        for au in action_users:
            i = {
                "type": "user",
                "identity": au.user.email,
                "action": au.action
            }
            _access.append(i)

        for ar in action_roles:
            i = {
                "type": "egroup",
                "identity": ar.role.name,
                "action": ar.action
            }
            _access.append(i)

        return _access
