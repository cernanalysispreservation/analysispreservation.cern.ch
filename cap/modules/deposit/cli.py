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
from cap.modules.user.utils import get_existing_or_register_user

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
