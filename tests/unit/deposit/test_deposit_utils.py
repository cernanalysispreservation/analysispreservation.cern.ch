# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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
# or submit itself to any jurisdiction.

"""Unit tests Cap Deposit utils."""

from __future__ import absolute_import, print_function
from pytest import mark

from cap.modules.deposit.utils import (
    clean_empty_values,
    parse_schema_permission_info,
)


def test_cleaning_of_empty_values():
    """Test cleaning of values."""
    model = {
        "_deposit": {
            "created_by": 7,
            "id": "914f01bd513a4428be3289aeb587e742",
            "owners": [
                7
            ],
            "status": "draft"
        },
        "_experiment": "CMS",
        "_files": [

        ],
        "dream_team": '',
        "the_best_dream_team": "thor_team",
        "testing": {
            "test_inner": "hello"
        },
        "additional_resources": {
            "documentations": [
                {

                }
            ],
            "internal_discussions": [
                {

                }
            ],
            "presentations": [
                {

                }
            ],
            "publications": [
                {
                    "persistent_identifiers": [

                    ]
                }
            ]
        },
        "basic_info": {
            "people_info": [
                {

                }
            ]
        },
        "cms_questionnaire": {},
        "general_title": "Created 12/04/2017, 15:08:08",
    }
    result = clean_empty_values(model)
    assert "additional_resources" not in result
    assert "cms_questionnaire" not in result
    assert "the_best_dream_team" in result
    assert "testing" in result


@mark.parametrize(
    "name, version, schema, expected",
    [
        (
            "obj_with_properties",
            "1",
            {
                "title": "deposit-test-schema",
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "x-cap-permission": {"users": ["test@test.com"]},
                    },
                    "date": {
                        "type": "string",
                        "x-cap-permission": {"users": ["test_user@test.com"]},
                    },
                    "test": {
                        "type": "array",
                        "items": {
                            "properties": {
                                "title": {
                                    "type": "string",
                                    "x-cap-permission": {"users": ["test@test.com"]},
                                },
                                "date": {
                                    "type": "string",
                                    "x-cap-permission": {
                                        "users": ["test_user@test.com"]
                                    },
                                },
                            },
                            "type": "object",
                        },
                    },
                },
            },
            [
                {"path": ["properties", "title"], "value": {"users": ["test@test.com"]}},
                {"path": ["properties", "date"], "value": {"users": ["test_user@test.com"]}},
                {
                    "path": ["properties", "test", "items", "properties", "title"],
                    "value": {"users": ["test@test.com"]},
                },
                {
                    "path": ["properties", "test", "items", "properties", "date"],
                    "value": {"users": ["test_user@test.com"]},
                },
            ],
        ),
        (
            "obj_without_properties",
            "1",
            {
                "title": "deposit-test-schema",
                "type": "object",
                "x-cap-permission": {"users": ["test@test.com"]},
            },
            [{'path': [], 'value': {'users': ['test@test.com']}}],
        ),
        (
            "array_with_properties",
            "1",
            {
                "title": "deposit-test-schema-one",
                "type": "array",
                "items": {
                    "properties": {
                        "title": {
                            "type": "string",
                            "x-cap-permission": {"users": ["test@test.com"]},
                        },
                        "date": {
                            "type": "string",
                            "x-cap-permission": {"users": ["test_user@test.com"]},
                        },
                    },
                    "type": "object",
                },
            },
            [
                {"path": ["items", "properties", "title"], "value": {"users": ["test@test.com"]}},
                {
                    "path": ["items", "properties", "date"],
                    "value": {"users": ["test_user@test.com"]},
                },
            ],
        ),
        (
            "array_without_properties",
            "1",
            {
                "title": "deposit-test-schema-one",
                "type": "array",
                "items": {
                    "type": "string",
                    "x-cap-permission": {"users": ["test@test.com"]},
                },
            },
            [{'path': ['items'], 'value': {'users': ['test@test.com']}}],
        ),
        (
            "string",
            "1",
            {
                "title": "deposit-test-schema-two",
                "type": "string",
                "x-cap-permission": {"users": ["test_user@test.com"]},
            },
            [{'path': [], 'value': {'users': ['test_user@test.com']}}],
        ),
        (
            "obj_with_string_and_obj",
            "1",
            {
                "title": "deposit-test-schema-two",
                "type": "object",
                "properties": {
                    "basic_info": {
                        "properties": {
                            "status": {
                                "properties": {
                                    "main_status": {
                                        "type": "string",
                                        "x-cap-permission": {
                                            "users": ["test_user@test.com"]
                                        },
                                    }
                                }
                            },
                            "analysis_people": {
                                "x-cap-permission": {"users": ["test_user@test.com"]},
                                "items": {"type": "string"},
                            },
                        }
                    }
                },
                "x-cap-permission": {"users": ["test_user@test.com"]},
            },
            [
                {
                    "path": [
                        "properties",
                        "basic_info",
                        "properties",
                        "status",
                        "properties",
                        "main_status",
                    ],
                    "value": {"users": ["test_user@test.com"]},
                },
                {
                    "path": ["properties", "basic_info", "properties", "analysis_people"],
                    "value": {"users": ["test_user@test.com"]},
                },
                {"path": [], "value": {"users": ["test_user@test.com"]}},
            ],
        ),
        (
            "obj_with_bool",
            "1",
            {
                "title": "deposit-test-schema-fs",
                "additionalProperties": True, 
                "type": "object",
                "properties": {
                    "basic_info": {
                        "properties": {
                            "status": {
                                "properties": {
                                    "main_status": {
                                        "type": "string",
                                        "x-cap-permission": {
                                            "users": ["test_user@test.com"]
                                        },
                                    }
                                }
                            },
                            "analysis_people": {
                                "x-cap-permission": {"users": ["test_user@test.com"]},
                                "items": {"type": "string"},
                            },
                        }
                    }
                },
                "x-cap-permission": {"users": ["test_user@test.com"]},
            },
            [
                {
                    "path": [
                        "properties",
                        "basic_info",
                        "properties",
                        "status",
                        "properties",
                        "main_status",
                    ],
                    "value": {"users": ["test_user@test.com"]},
                },
                {
                    "path": ["properties", "basic_info", "properties", "analysis_people"],
                    "value": {"users": ["test_user@test.com"]},
                },
                {"path": [], "value": {"users": ["test_user@test.com"]}},
            ],
        ),
        (
            "obj_with_array",
            "1",
            {
                "title": "deposit-test-schema-fs",
                "additionalProperties": True,
                "type": "object",
                "dependencies": {
                    "object": {
                        "oneOf": [
                            {
                                "properties": {
                                    "object": {
                                        "enum": ["electron"],
                                        "x-cap-permission": {"users": ["test_user@test.com"]},
                                    },
                                    "electron_type": {
                                        "enum": ["GsfElectron"],
                                        "type": "string",
                                        "title": "Electron type",
                                        "x-cap-permission": {"users": ["test_user@test.com"]},
                                    },
                                }
                            },
                            {
                                "properties": {
                                    "object": {"enum": ["muon"]},
                                    "muon_type": {
                                        "enum": ["PFMuon", "GlobalMuon", "TrackerMuon"],
                                        "type": "string",
                                        "title": "Muon type",
                                        "x-cap-permission": {"users": ["test_user@test.com"]},
                                    },
                                }
                            },
                        ]
                    }
                },
                "properties": {
                    "basic_info": {
                        "properties": {
                            "status": {
                                "properties": {
                                    "main_status": {
                                        "type": "string",
                                        "x-cap-permission": {"users": ["test_user@test.com"]},
                                    }
                                }
                            },
                            "analysis_people": {
                                "x-cap-permission": {"users": ["test_user@test.com"]},
                                "items": {"type": "string"},
                            },
                        }
                    }
                },
                "x-cap-permission": {"users": ["test_user@test.com"]},
            },
            [
                {
                    "path": ["dependencies", "object", "oneOf", 0, "properties", "object"],
                    "value": {"users": ["test_user@test.com"]},
                },
                {
                    "path": ["dependencies", "object", "oneOf", 0, "properties", "electron_type"],
                    "value": {"users": ["test_user@test.com"]},
                },
                {
                    "path": ["dependencies", "object", "oneOf", 1, "properties", "muon_type"],
                    "value": {"users": ["test_user@test.com"]},
                },
                {
                    "path": [
                        "properties",
                        "basic_info",
                        "properties",
                        "status",
                        "properties",
                        "main_status",
                    ],
                    "value": {"users": ["test_user@test.com"]},
                },
                {
                    "path": ["properties", "basic_info", "properties", "analysis_people"],
                    "value": {"users": ["test_user@test.com"]},
                },
                {"path": [], "value": {"users": ["test_user@test.com"]}},
            ]
        )
    ],
)
def test_parse_schema_permission_info(name, version, schema, expected):
    result = parse_schema_permission_info(name, version, schema)
    assert result == expected
