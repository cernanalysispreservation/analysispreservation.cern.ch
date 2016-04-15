"""Record serialization."""

from __future__ import absolute_import, print_function

from invenio_records_rest.serializers.json import JSONSerializer
from invenio_records_rest.serializers.response import record_responsify, \
    search_responsify

from .schemas.json import RecordSchemaJSONV1

# Serializers
# ===========
#: CAP JSON serializer version 1.0.0
json_v1 = JSONSerializer(RecordSchemaJSONV1)

# Records-REST serializers
# ========================
#: JSON record serializer for individual records.
json_v1_response = record_responsify(json_v1, 'application/json')

#: JSON record serializer for search results.
json_v1_search = search_responsify(json_v1, 'application/json')
