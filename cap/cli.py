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

from invenio_base.app import create_cli
from flask import current_app
from flask.cli import with_appcontext
from invenio_db import db
from invenio_files_rest.models import Location
from .factory import create_app


cli = create_cli(create_app=create_app)


@cli.group()
def location():
    """Files command"""


@location.command('add')
@with_appcontext
def location_cli():
    """Load default location for files."""
    d = current_app.config['DATADIR_FILES']
    with db.session.begin_nested():
        Location.query.delete()
        loc = Location(name='local', uri=d, default=True)
        db.session.add(loc)
    db.session.commit()
