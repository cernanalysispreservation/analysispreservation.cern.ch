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
"""Record errors."""

from invenio_rest.errors import RESTValidationError


class RecordValidationError(RESTValidationError):
    """Record validation error exception."""

    code = 422

    description = "Validation error. Try again with valid data"

    def __init__(self, description, errors=None, **kwargs):
        """Initialize exception."""
        super(RecordValidationError, self).__init__(**kwargs)

        self.description = description or self.description
        self.errors = errors


def get_error_path(error):
    """Helper to return correct error path"""
    if error.validator == "required":
        return list(error.path) + error.validator_value
    else:
        return list(error.path)
