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

"""Resolver JSON for default JSON Schemas."""

from __future__ import absolute_import, print_function

import os

import pkg_resources

import jsonresolver
import simplejson as json


@jsonresolver.route('/records/jsonschemas/definitions/<path:jsonschema>',
                    host='analysis-preservation.cern.ch')
def resolve_definitions(jsonschema):
    """Resolve the JSON definition schema."""
    jsonschema_definition_path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                              'jsonschemas', 'definitions',
                                              jsonschema)
    with open(jsonschema_definition_path) as file:
        jsonschema_definition = file.read()
    return json.loads(jsonschema_definition)


@jsonresolver.route('/schemas/<path:path>',
                    host='analysis-preservation.cern.ch')
def resolve_schemas(path):
    """Resolve CAP JSON schemas."""

    _schema_path = pkg_resources.resource_filename('cap', 'jsonschemas/'+path)

    with open(_schema_path, 'r') as f:
        return json.load(f)


@jsonresolver.route('/schemas/<path:path>',
                    host='localhost:5000')
def resolve_schemas_test(path):
    """Resolve "test" CAP JSON schemas."""

    _schema_path = pkg_resources.resource_filename('cap', 'jsonschemas/'+path)

    with open(_schema_path, 'r') as f:
        return json.load(f)
