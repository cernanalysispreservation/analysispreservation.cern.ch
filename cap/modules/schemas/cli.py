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

from .models import Schema


@fixtures.command()
@with_appcontext
@click.option('--dir',
              '-d',
              type=click.Path(exists=True),
              default='cap/modules/fixtures/schemas')
def schemas(dir):
    """Load default schemas."""
    for root, dirs, files in os.walk(dir):
        for file in files:
            if file.endswith(".json"):
                fullpath = os.path.join(root, file)
                with open(fullpath, 'r') as f:
                    try:
                        json_content = json.load(f)
                        add_schema_from_fixture(data=json_content)
                    except ValueError:
                        click.secho(
                            "Not valid json in {} file".format(fullpath),
                            fg='red')
                        continue


def add_schema_from_fixture(data=None):
    """Add or update schema."""
    allow_all = data.pop("allow_all", False)
    name = data['name']

    try:
        with db.session.begin_nested():
            with db.session.begin_nested():
                try:
                    schema = Schema.get(name=name, version=data['version'])
                    schema.update(**data)
                    msg, fg = '{} updated.'.format(str(name)), 'green'

                except JSONSchemaNotFound:
                    schema = Schema(**data)
                    db.session.add(schema)
                    msg, fg = '{} added.'.format(str(name)), 'green'

            if allow_all:
                schema.add_read_access_for_all_users()
            else:
                schema.revoke_access_for_all_users()

    except IntegrityError:
        click.secho('Error occured during adding {} to the db. \n'.format(
            str(name)),
                    fg='red')
        return

    db.session.commit()
    click.secho(msg, fg=fg)
