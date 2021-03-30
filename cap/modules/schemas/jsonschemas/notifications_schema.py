notifications_schema = {
    "type": "object",
    "title": "Notification Configuration",
    "additionalProperties": False,
    "properties": {
        "actions": {
            "type": "object",
            "title": "Notification Actions",
            "additionalProperties": False,
            "patternProperties": {
                "^(publish|review)$": {
                    "type": "array",
                    "title": "Publish Options",
                    "items": {
                        "type": "object",
                        "title": "Mail Config/Options",
                        "required": ["recipients"],
                        "minItems": 1,
                        "properties": {
                            "ctx": {"$ref": "#/definitions/ctx"},
                            "subject": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "title": "Mail String Template Subject",
                                        "additionalProperties": False,
                                        "properties": {
                                            "template": {
                                                "type": "string",
                                                "title": "Template string (Jinja format)",  # noqa
                                            },
                                            "ctx": {
                                                "$ref": "#/definitions/ctx"
                                            },
                                            "method": {
                                                "type": "string",
                                                "title": "Method name",
                                            },
                                        },
                                    },
                                    {
                                        "type": "object",
                                        "title": "Mail Template File Subject",
                                        "additionalProperties": False,
                                        "properties": {
                                            "template_file": {
                                                "type": "string",
                                                "title": "Template file (path)",
                                            },
                                            "ctx": {
                                                "$ref": "#/definitions/ctx"
                                            },
                                            "method": {
                                                "type": "string",
                                                "title": "Method name",
                                            },
                                        },
                                    },
                                ]
                            },
                            "body": {
                                "anyOf": [
                                    {
                                        "type": "object",
                                        "title": "Mail Message",
                                        "additionalProperties": False,
                                        "properties": {
                                            "template_file": {
                                                "type": "string",
                                                "title": "Template file (path)",  # noqa
                                            },
                                            "ctx": {
                                                "$ref": "#/definitions/ctx"
                                            },
                                            "base_template": {
                                                "type": "string",
                                                "title": "Base Template",
                                            },
                                            "plain": {
                                                "type": "boolean",
                                                "title": "Plain text or HTML",
                                            },
                                        },
                                    },
                                    {
                                        "type": "object",
                                        "title": "Mail Message",
                                        "additionalProperties": False,
                                        "properties": {
                                            "template": {
                                                "type": "string",
                                                "title": "Template type (string/path)",  # noqa
                                            },
                                            "ctx": {
                                                "$ref": "#/definitions/ctx"
                                            },
                                            "base_template": {
                                                "type": "string",
                                                "title": "Base Template",
                                            },
                                            "plain": {
                                                "type": "boolean",
                                                "title": "Plain text or HTML",
                                            },
                                        },
                                    },
                                ]
                            },
                            "recipients": {
                                "type": "object",
                                "title": "Mail Recipients",
                                "minProperties": 1,
                                "patternProperties": {
                                    "^(bcc|cc|recipients)$": {
                                        "type": "array",
                                        "title": "List of BCC recipients",
                                        "uniqueItems": True,
                                        "minItems": 1,
                                        "items": {
                                            "oneOf": [
                                                {"type": "string"},
                                                {
                                                    "additionalProperties": False,  # noqa
                                                    "type": "object",
                                                    "properties": {
                                                        "op": {
                                                            "type": "string",
                                                            "title": "AND/OR",
                                                        },
                                                        "checks": {
                                                            "type": "array",
                                                            "items": {
                                                                "oneOf": [
                                                                    {
                                                                        "$ref": "#/definitions/checks"  # noqa
                                                                    },
                                                                    {
                                                                        "$ref": "#/definitions/condition"  # noqa
                                                                    },
                                                                ]
                                                            },
                                                        },
                                                        "mails": {
                                                            "$ref": "#/definitions/mails"  # noqa
                                                        },
                                                        "method": {
                                                            "oneOf": [
                                                                {
                                                                    "title": "Method",  # noqa
                                                                    "type": "string",  # noqa
                                                                },
                                                                {
                                                                    "type": "array",  # noqa
                                                                    "items": {
                                                                        "title": "Method",  # noqa
                                                                        "type": "string",  # noqa
                                                                    },
                                                                },
                                                            ]
                                                        },
                                                    },
                                                },
                                            ]
                                        },
                                    }
                                },
                            },
                        },
                    },
                }
            },
        }
    },
}
