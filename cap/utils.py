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

"""CAP general utils"""


from __future__ import absolute_import, print_function

import json
import os
from copy import deepcopy

import six
from flask import current_app
from werkzeug.local import LocalProxy
from werkzeug.utils import import_string

current_jsonschemas = LocalProxy(
    lambda: current_app.extensions['invenio-jsonschemas']
)

_records_state = LocalProxy(lambda: current_app.extensions['invenio-records'])


def obj_or_import_string(value, default=None):
    """Import string or return object.
    :params value: Import path or class object to instantiate.
    :params default: Default object to return if the import fails.
    :returns: The imported object.
    """
    if isinstance(value, six.string_types):
        return import_string(value)
    elif value:
        return value
    return default


def resolve_schema_path(schema_path):
    """Resolve a schema by name.

    Resolve a schema by it's registered name, e.g. 'records/record-v1.0.0.json'

    WARNING: This method returns a deepcopy of the original schema.
             Always use this method, as any modifications to a resolved schema
             will be retain at the application level!

    :param schema_path: schema path, e.g.: 'records/record-v1.0.0.json'.
    :type schema_path: str
    :returns: JSON schema
    :rtype: dict
    """
    schema = current_jsonschemas.get_schema(schema_path)
    return deepcopy(schema)


def get_abs_schema_path(schema_path):
    """Resolve absolute schema path on disk from schema name.

    Resolve schema name to an absolute schema path on disk, e.g.:
    'records/record-v1.0.0.json' could resolve to
    '/absolute/path/schemas/records/record-v1.0.0.json'
    """
    return current_jsonschemas.get_schema_path(schema_path)


def save_jsonschema(schema, path):
    """Save jsonschema to disk path."""
    with open(path, 'w') as fp:
        json.dump(schema, fp, indent=2, sort_keys=True)


def merge_dicts(first, second):
    """Merge the 'second' multiple-dictionary into the 'first' one."""
    new = deepcopy(first)
    for k, v in second.items():
        if isinstance(v, dict) and v:
            ret = merge_dicts(new.get(k, dict()), v)
            new[k] = ret
        else:
            new[k] = second[k]
    return new


def get_jsonschemas_from_dir(schemas_dir):
    """Collect all jsonschemas' names from given directory."""
    abs_path = os.path.join(current_app.config['JSONSCHEMAS_ROOT'],
                            schemas_dir)

    for json_file in os.listdir(abs_path):
        if json_file.endswith('-src.json'):
            schema_name = os.path.join(schemas_dir, json_file)
            yield schema_name
