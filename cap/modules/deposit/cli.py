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

import json
import uuid

import click
from flask_cli import with_appcontext
from invenio_db import db
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_pidstore.models import PersistentIdentifier

from cap.modules.deposit.api import CAPDeposit
from cap.modules.deposit.fetchers import cap_deposit_fetcher
from cap.modules.deposit.minters import cap_deposit_minter
from cap.modules.fixtures.cli import fixtures
from cap.modules.user.utils import get_existing_or_register_user, \
    get_existing_or_register_role

from .utils import add_read_permission_for_egroup


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
              help='Role with access to the record')
@click.option('--user', '-u',
              help='User with access to the record')
@click.option('--owner', '-o',
              help='Owner of the record')
@with_appcontext
def create_deposit(file, ana, role, user, owner):
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

    if isinstance(data, dict):
        update_data_with_schema(data, ana)
        create_deposit_with_permissions(data, user, role, owner)
    else:
        for rec in data:
            update_data_with_schema(rec, ana)
            create_deposit_with_permissions(rec, user, role, owner)

    click.secho(f"Record(s) added.", fg='green')


def update_data_with_schema(data, ana):
    """Checks if the analysis type is included in the schema, or adds it."""
    if data.get('$schema') and ana:
        click.secho("Your data already provide a $schema, --ana will not be used.")  # noqa
    elif ana:
        data['$ana_type'] = ana
    else:
        raise click.UsageError(
            'You need to provide the --ana/-a parameter '
            'OR add the $schema field in your JSON')


def create_deposit_with_permissions(data, user, role, owner):
    """Create a deposit and add privileges and owner information."""
    from cap.modules.deposit.api import CAPDeposit

    with db.session.begin_nested():
        owner = get_existing_or_register_user(owner) if owner else None
        deposit = CAPDeposit.create(data=data, owner=owner)

        # add role and user
        if role:
            _role = get_existing_or_register_role(role)
            deposit._add_egroup_permissions(_role,
                                            ['deposit-read'],
                                            db.session)
        if user:
            _user = get_existing_or_register_user(user)
            deposit._add_user_permissions(_user,
                                          ['deposit-read'],
                                          db.session)
        deposit.commit()
    db.session.commit()

    click.secho(
        f"Created deposit with id: {deposit['_deposit']['id']}", fg='green')
