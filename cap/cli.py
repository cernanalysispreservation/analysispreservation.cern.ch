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

"""cap base Invenio configuration."""

from __future__ import absolute_import, print_function

import json
import os

import click
from flask import current_app
from invenio_base.app import create_cli

from .compilers import compile_jsonschema
from .factory import create_app
from .utils import (get_abs_schema_path, get_jsonschemas_from_dir,
                    resolve_schema_path, save_jsonschema)

cli = create_cli(create_app=create_app)


def compile_jsonschema_cli(schemas_dir):
    """Compile json schemas in given directory.

    Take all schema_name-src.json schemas and resolve allOf and $ref keywords.
    Save resolved schema to schema_name.json file.
    """
    for schema_name in get_jsonschemas_from_dir(schemas_dir):
        schema = resolve_schema_path(schema_name)
        compiled_schema = compile_jsonschema(schema)
        out_file = os.path.join(current_app.config['JSONSCHEMAS_ROOT'],
                                schema_name.replace('-src',''))
        save_jsonschema(compiled_schema, out_file)


@cli.command('compiledeposit')
def compile_deposit_cli():
    """Compile deposit jsonschema."""
    compile_jsonschema_cli(current_app.config.get('JSONSCHEMAS_DEPOSIT_DIR', ''))


@cli.command('compilerecord')
def compile_record_cli():
    """Compile record jsonschema."""
    compile_jsonschema_cli(current_app.config.get('JSONSCHEMAS_RECORDS_DIR', ''))
