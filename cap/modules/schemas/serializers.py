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
import copy

from flask import url_for
from invenio_jsonschemas.proxies import current_jsonschemas
from marshmallow import Schema, ValidationError, fields, pre_load, validate
from six import iteritems

from cap.utils import url_to_api_url

from .validators import JSONSchemaValidator

EDITABLE_FIELDS = [
    'fullname',
    'use_deposit_as_record',
    'deposit_mapping',
    'record_mapping',
    'deposit_options',
    'record_options',
    'config',
]


class SchemaSerializer(Schema):
    """Default schema JSON serializer."""

    name = fields.Str(required=True)
    version = fields.Str(
        required=True, validate=validate.Regexp(regex=r"(\d+).(\d+).(\d+)")
    )
    fullname = fields.Str()
    is_indexed = fields.Boolean(default=False)
    use_deposit_as_record = fields.Boolean(default=False)

    deposit_schema = fields.Dict(validate=JSONSchemaValidator())
    deposit_options = fields.Dict()
    deposit_mapping = fields.Dict()

    record_schema = fields.Dict(validate=JSONSchemaValidator())
    record_options = fields.Dict()
    record_mapping = fields.Dict()

    @pre_load
    def filter_out_fields_that_cannot_be_updated(self, data, **kwargs):
        """Remove non editable fields from serialized data."""
        if not data:
            raise ValidationError('Empty data')
        return data


class SchemaResponseSerializer(SchemaSerializer):
    links = fields.Method('build_links', dump_only=True)

    def build_links(self, obj):
        """Construct schema links."""
        deposit_path = url_for(
            'invenio_jsonschemas.get_schema',
            schema_path=obj.deposit_path,
            _external=True,
        )
        record_path = url_for(
            'invenio_jsonschemas.get_schema',
            schema_path=obj.record_path,
            _external=True,
        )

        links = {
            'deposit': url_to_api_url(deposit_path),
            'record': url_to_api_url(record_path),
        }
        links['self'] = url_to_api_url(
            url_for(
                'cap_schemas.schemas',
                name=obj.name,
                version=obj.version,
                _method='PUT',
                _external=True,
            )
        )

        return links


class PatchedSchemaSerializer(Schema):
    """Schema serializer for patching jsonschemas."""

    fullname = fields.Str()
    use_deposit_as_record = fields.Boolean(default=False)
    config = fields.Dict()

    deposit_options = fields.Dict()
    deposit_mapping = fields.Dict()

    record_options = fields.Dict()
    record_mapping = fields.Dict()


class SchemaPayloadSerializer(SchemaSerializer):
    """Schema serializer with resolved jsonschemas."""

    config = fields.Dict()


class UpdateSchemaPayloadSerializer(SchemaPayloadSerializer):
    """Schema serializer with resolved jsonschemas."""

    @pre_load
    def filter_out_fields_that_cannot_be_updated(self, data, **kwargs):
        """Remove non editable fields from serialized data."""
        data = {k: v for k, v in iteritems(data) if k in EDITABLE_FIELDS}
        if not data:
            raise ValidationError('Empty data')
        return data


class ResolvedSchemaResponseSerializer(SchemaResponseSerializer):
    """Schema serializer with resolved jsonschemas."""

    deposit_schema = fields.Method(
        'get_resolved_deposit_schema', dump_only=True
    )
    record_schema = fields.Method('get_resolved_record_schema', dump_only=True)

    def get_resolved_deposit_schema(self, obj):
        """Resolve refs in deposit schema."""
        schema = current_jsonschemas.get_schema(
            obj.deposit_path, with_refs=True, resolved=True
        )
        return copy.deepcopy(schema)  # so all the JSONRefs get resoved

    def get_resolved_record_schema(self, obj):
        """Resolve refs in record schema."""
        schema = current_jsonschemas.get_schema(
            obj.record_path, with_refs=True, resolved=True
        )
        return copy.deepcopy(schema)  # so all the JSONRefs get resoved


class ConfigResolvedSchemaSerializer(ResolvedSchemaResponseSerializer):
    config = fields.Dict()
    experiment = fields.Str(required=False)


class CreateConfigPayload(SchemaResponseSerializer):
    config = fields.Dict()
    experiment = fields.Str(required=False)


class UpdateSchemaSerializer(ConfigResolvedSchemaSerializer):
    """Schema serializer with resolved jsonschemas."""

    @pre_load
    def filter_out_fields_that_cannot_be_updated(self, data, **kwargs):
        """Remove non editable fields from serialized data."""
        data = {k: v for k, v in iteritems(data) if k in EDITABLE_FIELDS}
        if not data:
            raise ValidationError('Empty data')

        return data


class CollectionSerializer(Schema):
    """Serializer for the collection endpoint."""

    name = fields.Str(required=True)
    version = fields.Str(
        required=True, validate=validate.Regexp(regex=r"(\d+).(\d+).(\d+)")
    )
    fullname = fields.Str()
    config = fields.Method("generate_schema_config", dump_only=True)

    def generate_schema_config(self, obj):
        return dict(permissions=obj.get_schema_permissions(), **obj.config)

    versions = fields.Method("get_schema_versions", dump_only=True)

    def get_schema_versions(self, obj):
        versions = obj.get_versions()
        return versions


class LinkSerializer(Schema):
    """Serializer to return all versions endpoint."""

    version = fields.Str()
    links = fields.Method('build_links', dump_only=True)

    def build_links(self, obj):
        """Construct schema links."""
        deposit_path = url_for(
            'invenio_jsonschemas.get_schema',
            schema_path=obj.deposit_path,
            _external=True,
        )
        record_path = url_for(
            'invenio_jsonschemas.get_schema',
            schema_path=obj.record_path,
            _external=True,
        )

        links = {
            'deposit': url_to_api_url(deposit_path),
            'record': url_to_api_url(record_path),
        }
        links['self'] = url_to_api_url(
            url_for(
                'cap_schemas.schemas',
                name=obj.name,
                version=obj.version,
                _method='PUT',
                _external=True,
            )
        )

        return links


schema_serializer = SchemaResponseSerializer()
resolved_schemas_serializer = ResolvedSchemaResponseSerializer()
patched_schema_serializer = PatchedSchemaSerializer()
update_schema_serializer = UpdateSchemaSerializer()
config_resolved_schemas_serializer = ConfigResolvedSchemaSerializer()
create_config_payload = CreateConfigPayload()
collection_serializer = CollectionSerializer()
link_serializer = LinkSerializer()
schema_payload_serializer = SchemaPayloadSerializer()
update_payload_schema_serializer = UpdateSchemaPayloadSerializer()
