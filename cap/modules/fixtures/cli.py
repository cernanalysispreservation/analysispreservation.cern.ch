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

import click

from cap.modules.experiments.utils.cms import \
    cache_das_datasets_in_es_from_file, synchronize_cadi_entries
from flask_cli import with_appcontext

from .utils import add_drafts_from_file


@click.group()
def fixtures():
    """Load fixtures."""


@fixtures.command('add')
@click.option('--user', '-u', default='analysis-preservation-support@cern.ch')
@click.option('--schema', '-s', required=True)
@click.option('--file', '-f', required=True, type=click.Path(exists=True))
@click.option('--limit', '-n', type=int)
@with_appcontext
def add(file, schema, user, limit):
    """Load drafts with metadata from file."""
    add_drafts_from_file(file, schema, user, limit)


@fixtures.group()
def cms():
    """CMS fixtures."""


@cms.command('sync-cadi')
@click.option('--limit', '-n', type=int)
@with_appcontext
def sync_with_cadi_database(limit):
    """Add/update CADI entries connecting with CADI database."""
    synchronize_cadi_entries(limit)


@cms.command('index-datasets')
@click.option('--file', '-f', required=True, type=click.Path(exists=True))
@with_appcontext
def index_datasets(file):
    """Load datasets from file and index in ES."""
    cache_das_datasets_in_es_from_file(file)
