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
"""Deposit errors."""

from invenio_rest.errors import RESTException, RESTValidationError, FieldError


class DepositDoesNotExist(Exception):
    """Deposit with given key does not exist exception."""

    pass


class WrongJSONSchemaError(RESTValidationError):
    """Wrong JSONSchema error exception."""

    code = 400

    description = "The provided JSON schema or 'ana_type' field doesn't exist"

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super(WrongJSONSchemaError, self).__init__(**kwargs)

        self.description = description or self.description


class UpdateDepositPermissionsError(RESTValidationError):
    """Exception during updating deposit's permissions."""

    code = 400

    description = "Error occured during updating deposit permissions."

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super(UpdateDepositPermissionsError, self).__init__(**kwargs)

        self.description = description or self.description


class DepositValidationError(RESTValidationError):
    """Deposit validation error exception."""

    code = 422

    description = "Validation error. Try again with valid data"

    def __init__(self, description, errors=None, **kwargs):
        """Initialize exception."""
        super(DepositValidationError, self).__init__(**kwargs)

        self.description = description or self.description
        self.errors = errors


class FileUploadError(RESTException):
    """Exception during uploading external urls."""

    code = 400

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super(FileUploadError, self).__init__(**kwargs)

        self.description = description or self.description


class DisconnectWebhookError(RESTException):
    """Exception during disconnecting webhook for analysis."""

    code = 400

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)

        self.description = description or 'Error during disconnecting webhook.'


class ReviewError(RESTException):
    """Exception during review for analysis."""

    code = 400

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super().__init__(**kwargs)

        self.description = description or 'Review is not a possible action.'


class ReviewValidationError(RESTValidationError):
    """Review validation error exception."""

    code = 400

    description = "Validation error. Try again with valid data"

    def __init__(self, description, errors=None, **kwargs):
        """Initialize exception."""
        super(ReviewValidationError, self).__init__(**kwargs)

        self.description = description or self.description
        self.errors = [FieldError(e[0], e[1]) for e in errors.items()]
