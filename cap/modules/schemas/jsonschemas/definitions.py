definitions_schema = {
    "ctx": {
        "type": "array",
        "title": "Context (ctx) Options",
        "uniqueItems": True,
        "items": {
            "anyOf": [
                {
                    "properties": {
                        "name": {"type": "string", "title": "Variable name"},
                        "path": {"type": "string", "title": "Variable Path"},
                    },
                    "required": ["name", "path"],
                },
                {
                    "properties": {
                        "method": {"type": "string", "title": "Variable Method"}
                    },
                    "required": ["method"],
                },
            ]
        },
    },
    "mails": {
        "type": "object",
        "title": "Mails",
        "properties": {
            "default": {
                "type": "array",
                "title": "Default",
                "uniqueItems": True,
                "items": {"type": "string", "title": "Mail"},
            },
            "formatted": {
                "type": "array",
                "title": "Formatted",
                "uniqueItems": True,
                "items": {
                    "type": "object",
                    "title": "Mail",
                    "properties": {
                        "template": {"type": "string", "title": "Template"},
                        "ctx": {"$ref": "#/definitions/ctx"},
                    },
                },
            },
        },
    },
    "checks": {
        "title": "Checks",
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "op": {"type": "string", "title": "AND/OR"},
            "checks": {
                "type": "array",
                "items": {
                    "oneOf": [
                        {"$ref": "#/definitions/checks"},
                        {"$ref": "#/definitions/condition"},
                    ]
                },
            },
        },
    },
    "condition": {
        "type": "object",
        "title": "Add Check",
        "additionalProperties": False,
        "properties": {
            "path": {"type": "string", "title": "Path"},
            "condition": {"type": "string", "title": "Condition"},
            "value": {"type": "string", "title": "Value"},
            "params": {"type": "object"},
        },
    },
}
