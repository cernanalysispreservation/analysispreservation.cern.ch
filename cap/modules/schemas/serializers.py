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
"""Models for schemas."""
from flask import url_for
from invenio_jsonschemas.proxies import current_jsonschemas
from marshmallow import Schema, ValidationError, fields, pre_load, validate

from cap.utils import url_to_api_url

from .validators import JSONSchemaValidator

EDITABLE_FIELDS = [
    'fullname',
    'use_deposit_as_record',
    'deposit_mapping',
    'record_mapping',
    'deposit_options',
    'record_options',
]


class SchemaSerializer(Schema):
    """Default schema JSON serializer."""

    name = fields.Str(required=True)
    version = fields.Str(required=True,
                         validate=validate.Regexp(regex=r"(\d+).(\d+).(\d+)"))
    fullname = fields.Str()
    is_indexed = fields.Boolean(default=False)
    use_deposit_as_record = fields.Boolean(default=False)

    deposit_schema = fields.Dict(validate=JSONSchemaValidator())
    deposit_options = fields.Dict()
    deposit_mapping = fields.Dict()

    record_schema = fields.Dict(validate=JSONSchemaValidator())
    record_options = fields.Dict()
    record_mapping = fields.Dict()

    links = fields.Method('build_links', dump_only=True)

    def __init__(self, called_on_update=False, *args, **kwargs):
        """Initialize SchemaSerializer.

        :param called_on_update: Serializer called during update.
        """
        self.called_on_update = called_on_update
        super(SchemaSerializer, self).__init__(*args, **kwargs)

    @pre_load
    def filter_out_fields_that_cannot_be_updated(self, data, **kwargs):
        """Remove non editable fields from serialized data."""
        if self.called_on_update:
            data = {k: v for k, v in data.iteritems() if k in EDITABLE_FIELDS}
        if not data:
            raise ValidationError('Empty data')
        return data

    def build_links(self, obj):
        """Construct schema links."""
        links = {
            'deposit': current_jsonschemas.path_to_url(obj.deposit_path),
            'record': current_jsonschemas.path_to_url(obj.record_path)
        }
        links['self'] = url_to_api_url(
            url_for('cap_schemas.schemas',
                    name=obj.name,
                    version=obj.version,
                    _method='PUT',
                    _external=True))

        return links


schema_serializer = SchemaSerializer()
update_schema_serializer = SchemaSerializer(called_on_update=True)
