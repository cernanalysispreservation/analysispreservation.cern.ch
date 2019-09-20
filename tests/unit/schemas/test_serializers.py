# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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
"""Unit tests for schemas serializers."""
from cap.modules.schemas.serializers import schema_serializer


def test_schema_serializer_validators_errors():
    schema, errors = schema_serializer.load(
        dict(
            version='wrong-version.format',
            deposit_schema={
                'dependencies': [],
                'properties': []
            },
            deposit_options={'title': 'deposit_options'},
            record_schema={
                'dependencies': [],
            },
            record_options={'title': 'record_options'},
            record_mapping={
                'doc': {
                    'properties': {
                        "title": {
                            "type": "text"
                        }
                    }
                }
            },
            deposit_mapping={
                'doc': {
                    'properties': {
                        "keyword": {
                            "type": "keyword"
                        }
                    }
                }
            },
            is_indexed=True,
        ))

    assert errors == {
        'deposit_schema': [{
            'dependencies': ["[] is not of type u'object'"],
            'properties': ["[] is not of type u'object'"]
        }],
        'name': ['Missing data for required field.'],
        'record_schema': [{
            'dependencies': ["[] is not of type u'object'"]
        }],
        'version': ['String does not match expected pattern.']
    }
