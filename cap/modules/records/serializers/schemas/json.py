from __future__ import absolute_import, print_function

from marshmallow import Schema, fields


CAP_RECORD_MAPPINGS = dict(
    LHCbAnalysis=dict(
        general_title='_metadata.basic_info.analysis_name'
    ),
    CMSAnalysis=dict(
        general_title='_metadata.basic_info.analysis_number'
    ),
    CMSQuestionnaire=dict(),
    ATLASWorkflows=dict(
        general_title='_metadata.basic_info.title'
    ),
)


class MetadataSchemaV1(Schema):
    """Schema for metadata."""

    creator = fields.Str()
    collections = fields.List(fields.Str())
    _metadata = fields.Raw()
    general_title = fields.Method('get_general_title')

    def get_general_title(self, obj):
        """Get type title."""
        collection = obj.get('collections', [None])[0]
        collection_mappings = CAP_RECORD_MAPPINGS.get(collection, None)
        if collection_mappings:
            return resolve(obj, collection_mappings.get("general_title", ""))


class RecordSchemaJSONV1(Schema):
    """Schema for records v1 in JSON."""

    id = fields.Integer(attribute='pid.pid_value')
    _created = fields.Str()
    _updated = fields.Str()
    created = fields.Str()
    updated = fields.Str()
    metadata = fields.Nested(MetadataSchemaV1)
    revision = fields.Integer()


def resolve(obj, attrspec):
    for attr in attrspec.split("."):
        try:
            obj = obj[attr]
        except (TypeError, KeyError):
            obj = getattr(obj, attr)
    return obj
