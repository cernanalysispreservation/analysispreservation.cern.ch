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

import json
import os
import re
import sys
from pprint import pprint

import pkg_resources

results = []
errors = []


def fetch_schema(path):
    return json.loads(pkg_resources.resource_string('cap', path))


def get_ref(d):
    """Returns all the $ref values in a list"""
    options = ['oneOf', 'anyOf', 'allOf']
    for k, v in d.iteritems():
        if isinstance(v, dict):
            get_ref(v)
        elif isinstance(v, list):
            if any(x in k for x in options):
                for r in v:
                    if '$ref' in r:
                        results.append(r['$ref'])
        else:
            if '$ref' in k:
                results.append(v)
    return results


def validate_ref(json_to_check, schema_path):
    """Returns non valid $ref urls"""
    for url in get_ref(json_to_check):
        pattern = re.compile('^(http|https)://')
        out = pattern.match(url)
        if not out:
            pprint("Location: " + schema_path + " Error: Not valid url:" + url)
            sys.exit(1)


def test_ref_is_valid():
    root_dir = os.path.join(
        'cap', 'modules', 'records', 'jsonschemas', 'records')
    for schemas_dir, _, schemas in os.walk(root_dir):
        schemas_path = os.path.sep.join(schemas_dir.split(os.path.sep)[1:])

    for schema in schemas:
        json_to_check = {}
        schema_path = os.path.join(schemas_path, schema)
        for key, value in fetch_schema(schema_path).items():
            if 'properties' in key:
                json_to_check.update(value)

        validate_ref(json_to_check, schema_path)
