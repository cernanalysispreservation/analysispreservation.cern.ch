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

from __future__ import absolute_import, print_function

import os
import copy
import json
import uuid
import subprocess
from datetime import datetime
from random import randint

import click
from flask import current_app
from flask_cli import with_appcontext
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_pidstore.models import PersistentIdentifier
from jsonschema.exceptions import ValidationError

from cap.modules.deposit.api import CAPDeposit
from cap.modules.deposit.fetchers import cap_deposit_fetcher
from cap.modules.deposit.minters import cap_deposit_minter
from cap.modules.fixtures.cli import fixtures
from cap.modules.user.utils import get_existing_or_register_user, \
    get_existing_or_register_role
from cap.modules.schemas.models import Schema
from cap.modules.schemas.resolvers import resolve_schema_by_url, \
    schema_name_to_url

from .utils import add_read_permission_for_egroup, delete_keys_from_dict, \
    schema_to_role, create_das_index, update_das_data


@fixtures.command('add')
@click.option('--egroup', '-e')
@click.option('--file', '-f', required=True, type=click.Path(exists=True))
@click.option('--user', '-u', required=False)
@click.option('--limit', '-n', type=int)
@with_appcontext
def add(file_path, schema, version, egroup, usermail, limit):
    """Add drafts from a file.

    Drafts with specified pid will be registered under those.
    For drafts without pid, new pids will be minted.
    """
    if usermail:
        user = get_existing_or_register_user(usermail)
    else:
        user = None

    with open(file_path, 'r') as fp:
        entries = json.load(fp)

        for entry in entries[0:limit]:
            pid = cap_deposit_fetcher(None, entry)
            pid_value = pid.pid_value if pid else None

            try:
                PersistentIdentifier.get('depid', pid_value)

                click.secho(
                    'Draft with id {} already exist!'.format(pid_value),
                    fg='red')

            except PIDDoesNotExistError:
                record_uuid = uuid.uuid4()
                pid = cap_deposit_minter(record_uuid, entry)
                deposit = CAPDeposit.create(entry, record_uuid, user)
                deposit.commit()

                if egroup:
                    add_read_permission_for_egroup(deposit, egroup)

                click.secho('Draft {} added.'.format(pid.pid_value),
                            fg='green')

        db.session.commit()


@fixtures.command('create-deposit')
@click.option('--file', '-f',
              type=click.Path(exists=True),
              required=True,
              help='JSON data file')
@click.option('--ana', '-a',
              help='Type of analysis',)
@click.option('--role', '-r',
              'roles', multiple=True,
              help='Role with access to the record')
@click.option('--user', '-u',
              'users', multiple=True,
              help='User with access to the record')
@click.option('--owner', '-o',
              help='Owner of the record')
@click.option('--save-errors-to', '-e', 'save_errors',
              help="Provide a filename, that wrong records will be saved to.")
@with_appcontext
def create_deposit(file, ana, roles, users, owner, save_errors):
    """
    Create a new deposit through the CLI.
    Usage:
        cap fixtures create-deposit --f DATAFILE --r ROLE --u USER --o OWNER
    """
    try:
        with open(file) as datafile:
            data = json.load(datafile)
    except (KeyError, ValueError):
        raise click.BadParameter('Not a valid JSON file.')

    # create a list of all the records provided (even if it is just 1)
    records = [data] if isinstance(data, dict) else data
    click.secho(f"{len(records)} record(s) found in file.\n", fg='green')

    errors = []
    for rec in records:
        create_deposit_with_permissions(rec, roles, users, owner, ana, errors)

    # save errors to be fixed, in different json file
    if save_errors and errors:
        save_errors_to_json(save_errors, errors)

    click.secho(f"\nProcess finished and record(s) added.", fg='green')


@fixtures.command('create-test-deposits')
@click.option('--name', '-s',
              required=True,
              help='Schema name.')
@click.option('--num', '-n',
              required=True,
              default=10,
              help='Number of test deposits (default=10).')
@with_appcontext
def create_test_deposits(name, num):
    with current_app.test_request_context(
            'https://analysispreservation.cern.ch'):
        schema = Schema.get_latest(name)
        data = schema.serialize(resolve=True)
        resolved = data['deposit_schema']['properties']
        keys_to_remove = [
            'id', '$schema', 'control_number', 'format',
            'next_deadline_date', 'likelihoods',
        ]

        # fix for das datasets
        if name == 'cms-analysis':
            create_das_index()

        # create as many users as the number of deposits
        # will select randomly which ones will be used
        datastore = current_app.extensions['security'].datastore
        with db.session.begin_nested():
            users = [
                datastore.create_user(**{
                    'email': f'{name}-test-{str(uuid.uuid4())}@cern.ch',
                    'password': 'test',
                    'active': True
                }) for i in range(num)
            ]
        db.session.commit()

        # add roles to users
        role_str = schema_to_role(name)
        _, role = datastore._prepare_role_modify_args(None, role_str)
        for user in users:
            datastore.add_role_to_user(user, role)

        # create the new schema, remove unnecessary keys
        new_schema = {}
        for key in resolved.keys():
            if not key.startswith('_'):
                new_schema[key] = resolved[key]
        delete_keys_from_dict(new_schema, keys_to_remove)
        new_schema['$ana_type'] = name
        deposit_schema = json.dumps(new_schema)

        with open('test-schema.json', 'w+') as tmp_schema:
            with open('test-deposits.json', 'w+') as tmp_deposits:
                tmp_schema.write(deposit_schema)
                tmp_schema.close()

                cmd = f'npx json-schema-faker-cli ' \
                      f'test-schema.json test-deposits.json {int(num)}'
                subprocess.run(cmd.split())

                # read the results and load them
                deposit_data = json.load(tmp_deposits)
                tmp_deposits.close()

                with db.session.begin_nested():
                    for item in deposit_data:
                        delete_keys_from_dict(item, keys_to_remove)
                        if name == 'cms-analysis':
                            update_das_data(item)

                        user = users[randint(0, num - 1)]
                        owner = get_existing_or_register_user(user.email)

                        deposit = CAPDeposit.create(data=item, owner=owner)
                        deposit.commit()

                db.session.commit()

    os.remove('test-schema.json')
    os.remove('test-deposits.json')
    click.secho(f'Created {num} deposits of type {name}.', fg='green')


def save_errors_to_json(save_errors, errors):
    """Saves the wrong records to a specified file."""
    timestamp = datetime.now().strftime("%d-%b-%Y-%H:%M:%S")
    wrong_records_path = os.path.join(
        os.getcwd(),
        f'{save_errors}_errors_{timestamp}.json'
    )

    with open(wrong_records_path, 'w') as _json:
        json.dump(errors, _json, indent=4)

    click.secho(f"\nErrors saved in {wrong_records_path}.", fg='green')


def check_and_update_data_with_schema(data, ana):
    """
    Checks if the analysis type is included in the schema, or adds it. It also
    checks if the schema provided is valid.
    """
    schema = data.get('$schema')
    if not schema and not ana:
        click.secho(
            'You need to provide the --ana/-a parameter OR '
            'add the $schema field in your JSON', fg='red')
        return False

    try:
        if schema:
            if ana:
                click.secho("Your data already provide a $schema, --ana will not be used.")  # noqa
            resolve_schema_by_url(schema)
        elif ana:
            data['$schema'] = schema_name_to_url(ana)
        return True
    except JSONSchemaNotFound:
        click.secho('Provided schema is not a valid option.', fg='red')
        return False


def create_deposit_with_permissions(data, roles, users, owner, ana, errors):
    """Create a deposit and add privileges and owner information."""
    from cap.modules.deposit.api import CAPDeposit

    # make sure the schema is valid first
    if not check_and_update_data_with_schema(data, ana):
        return

    with db.session.begin_nested():
        try:
            # saving original to return to user if wrong
            _data = copy.deepcopy(data)
            owner = get_existing_or_register_user(owner) if owner else None
            deposit = CAPDeposit.create(data=data, owner=owner)

            # add roles and users
            if roles:
                for role in roles:
                    _role = get_existing_or_register_role(role.strip())
                    deposit._add_egroup_permissions(
                        _role, ['deposit-read'], db.session)
            if users:
                for user in users:
                    _user = get_existing_or_register_user(user.strip())
                    deposit._add_user_permissions(
                        _user, ['deposit-read'], db.session)

            deposit.commit()
        except ValidationError as err:
            click.secho(f'Validation Error: {err.message}', fg='red')
            errors.append(_data)
            return

    db.session.commit()
    click.secho(f"Created deposit with id: {deposit['_deposit']['id']}", fg='green')  # noqa
