# * coding: utf8 *
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
# MA 021111307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
"""CAP Cli."""

import json
import os

import click
from flask_cli import with_appcontext
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound
from sqlalchemy.exc import IntegrityError

from cap.modules.fixtures.cli import fixtures

from .models.schemas import Schema
from .models.templates import Template


@fixtures.command()
@with_appcontext
@click.option('--dir', '-d',
              type=click.Path(exists=True),
              default='cap/modules/fixtures/schemas')
def schemas(dir):
    """Load default schemas."""
    load_from_files(dir, fixture='schema')


@fixtures.command()
@with_appcontext
@click.option('--dir', '-d',
              type=click.Path(exists=True),
              default='cap/modules/fixtures/templates')
def templates(dir):
    """Load default templates."""
    load_from_files(dir, fixture='template')


def load_from_files(dir, fixture='schema'):
    """Read the path containing the json files, and extract all of them."""
    for root, dirs, files in os.walk(dir):

        json_files = [file for file in files if file.endswith(".json")]
        for file in json_files:
            fullpath = os.path.join(root, file)
            with open(fullpath, 'r') as f:
                try:
                    json_content = json.load(f)
                    add_from_fixture(data=json_content, fixture=fixture)
                except ValueError:
                    click.secho(f'Not valid json in {fullpath} file', fg='red')
                    continue


def add_from_fixture(data=None, fixture='schema'):
    allow_all = data.pop("allow_all", False)
    name = str(data['name'])
    version = data['version']

    try:
        with db.session.begin_nested():
            with db.session.begin_nested():
                db_model = Schema if fixture == 'schema' else Template
                try:
                    schema = db_model.get(name=name, version=version)
                    click.secho(f'{name} already exists in the db.')
                    return
                except JSONSchemaNotFound:
                    schema = db_model(**data)
                    db.session.add(schema)

            if allow_all:
                schema.add_read_access_for_all_users()

    except IntegrityError:
        click.secho(f'Error while adding {name} to the db.\n', fg='red')
        return

    db.session.commit()
    click.secho(f'{name} has been added.', fg='green')
