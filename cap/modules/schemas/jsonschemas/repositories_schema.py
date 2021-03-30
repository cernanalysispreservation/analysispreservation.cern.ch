repositories_schema = {
    "type": "object",
    "title": "Repository configuration",
    "patternProperties": {
        "^.*$": {
            "title": "Repository Configuration",
            "type": "object",
            "description": "Add your repository",
            "required": [
                "host",
                "authentication",
                "repo_name",
                "repo_description",
                "org_name",
                "private",
                "license",
            ],
            "dependencies": {
                "host": {
                    "oneOf": [
                        {"properties": {"host": {"enum": ["github.com"]}}},
                        {
                            "properties": {
                                "host": {"enum": ["gitlab.cern.ch"]},
                                "org_id": {
                                    "title": "Unique ID of the organisation",  # noqa
                                    "type": "string",
                                },
                            },
                            "required": ["org_id"],
                        },
                    ]
                }
            },
            "properties": {
                "display_name": {"type": "string"},
                "display_description": {"type": "string"},
                "host": {
                    "title": "Host name",
                    "type": "string",
                    "enum": ["gitlab.cern.ch", "github.com"],
                },
                "org_name": {
                    "title": "Name of the organisation",
                    "type": "string",
                },
                "authentication": {
                    "title": "Authentication for repository.",
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": ["user", "cap"],
                        }
                    },
                },
                "repo_name": {
                    "title": "Name of the repository",
                    "type": "object",
                },
                "repo_description": {
                    "title": "Description of the repository",
                    "type": "object",
                },
                "private": {
                    "title": "Visibility of the repository",
                    "type": "boolean",
                },
                "license": {
                    "title": "License of the repository",
                    "type": "string",
                },
            },
        }
    },
}
