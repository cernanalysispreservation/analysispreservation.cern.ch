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
"""Experiments module."""

from __future__ import absolute_import, print_function

import certifi

from .cli import *  # noqa


class CAPExperiments(object):
    """Experiments extension."""
    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Initialize configuration."""
        self._add_cern_certs_to_trusted(app)
        app.extensions['cap-experiments'] = self

    def _add_cern_certs_to_trusted(self, app):
        """Add CERN Verification Authority to trusted by certifi module.

        Location of pem file defined in `cap.config.CERN_CERTS_PEM`
        """
        cern_pem = app.config.get('CERN_CERTS_PEM')
        is_debug = app.config.get('DEBUG')

        if cern_pem and is_debug:
            with open(certifi.where(), 'r+') as _out, \
                    open(cern_pem, 'r') as _in:
                content = _in.read()
                if content not in _out.read():
                    _out.write(content)
