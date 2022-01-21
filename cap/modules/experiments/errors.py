# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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
"""Exceptions for experiments related module."""

from invenio_rest.errors import RESTException


class ExternalAPIException(RESTException):
    """External API replied with an error."""

    code = 503
    description = 'External API replied with an error.'

    def __init__(self, response=None, **kwargs):
        """Initialize exception."""
        super(ExternalAPIException, self).__init__(**kwargs)

        if response is not None:
            self.description = 'External API replied with an error:\n{0}\n{1}'\
                .format(response.status_code, response.content)


class DASHarvesterException(Exception):
    """Error during harvesting DAS entries."""

    pass
