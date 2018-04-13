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

import click
from flask_cli import with_appcontext

from cap.modules.experiments.tasks.cms import (add_cadi_entries_from_file,
                                               synchronize_cadi_entries)


@click.group()
def fixtures():
    """Create fixtures."""


@fixtures.group()
def cadi():
    """CMS CADI related fixtures."""


@cadi.command('sync')
@with_appcontext
def sync_with_cadi_database():
    """Add/update all CADI entries connecting with CADI database."""
    synchronize_cadi_entries()


@cadi.command('add')
@click.option('--file', '-f', type=click.Path(exists=True))
@with_appcontext
def add_cadi_entry(file):
    """Add/update CADI entry from file."""
    add_cadi_entries_from_file(file)
