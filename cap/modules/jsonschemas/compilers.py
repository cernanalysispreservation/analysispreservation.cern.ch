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

"""JSON schema compiler methods."""

from __future__ import absolute_import, print_function

from .utils import merge_dicts, resolve_schema_path


def _resolve_all_of(schema):
    """Resolve allOf definition in schema."""
    if 'allOf' in schema:
        for x in schema['allOf']:
            sub_schema = _resolve_ref(x)
            sub_schema.pop('title', None)
            schema = merge_dicts(schema, sub_schema)
        schema.pop('allOf')

    return schema


def _resolve_ref(schema):
    """Resolve $ref (only relative paths) in schema."""
    if '$ref' in schema:
        sub_schema = resolve_schema_path(schema['$ref'])
        schema.pop('$ref')
        sub_schema.pop('title', None)
        schema = merge_dicts(schema, sub_schema)

    return schema


def compile_jsonschema(schema):
    """Resolve allOf and $ref keywords in json schema."""
    schema = _resolve_all_of(schema)
    schema = _resolve_ref(schema)

    for key, val in schema.items():
        if isinstance(val, dict):
            schema[key] = compile_jsonschema(val)

    return schema
