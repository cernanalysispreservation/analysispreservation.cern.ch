from cap.modules.schemas.jsonschemas.definitions import definitions_schema
from cap.modules.schemas.jsonschemas.notifications_schema import (
    notifications_schema,
)
from cap.modules.schemas.jsonschemas.repositories_schema import (
    repositories_schema,
)

SCHEMA_CONFIG_JSONSCHEMA_V1 = {
    "title": "Deposit/Record Schema Configuration",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "definitions": definitions_schema,
    "properties": {
        "pid": {
            "type": "object",
            "properties": {
                "format": {"type": "string"},
                "copy_to": {
                    "type": "array",
                    "items": {"type": "array", "items": {"type": "string"}},
                },
            },
        },
        "x-cap-permission": {"type": "boolean"},
        "notifications": notifications_schema,
        "reviewable": {"type": "boolean"},
        "ergoups": {"type": "boolean"},
        "repositories": repositories_schema,
        "readme": {"type": "string"},
    },
    "additionalProperties": False,
}
