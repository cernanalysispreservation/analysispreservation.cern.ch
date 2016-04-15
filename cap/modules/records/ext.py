# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""Jinja utilities for Invenio."""

from __future__ import absolute_import, print_function

from invenio_indexer.signals import before_record_index

from cap.config import JSONSCHEMAS_HOST

from .indexer import indexer_receiver
from .views import blueprint


class Records(object):
    """Records extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        app.register_blueprint(blueprint)
        before_record_index.connect(indexer_receiver, sender=app)
        app.config.setdefault('JSONSCHEMAS_HOST', JSONSCHEMAS_HOST)
        app.extensions['records'] = self
