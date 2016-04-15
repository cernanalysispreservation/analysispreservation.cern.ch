from __future__ import absolute_import, print_function

from marshmallow import Schema, fields


class MetadataSchemaV1(Schema):
    """Schema for metadata."""

    creator = fields.Str()
    _metadata = fields.Raw()


class RecordSchemaJSONV1(Schema):
    """Schema for records v1 in JSON."""

    id = fields.Integer(attribute='pid.pid_value')
    _created = fields.Str()
    _updated = fields.Str()
    created = fields.Str()
    updated = fields.Str()
    metadata = fields.Nested(MetadataSchemaV1)
    revision = fields.Integer()
