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

"""GitHub errors."""

from __future__ import absolute_import, print_function

from invenio_rest.errors import RESTException


class GitError(Exception):
    """General GitHub error."""


class GitURLParsingError(GitError):
    """Git url error."""

    def __str__(self):
        return 'The git URL cannot be parsed, ' \
               'provide a valid GitHub / GitLab URL.'


class GitCredentialsError(GitError):
    """Wrong credentials for Github/Gitlab error."""

    def __str__(self):
        return 'Instance could not be created.Try again using another url ' \
               '(GitHub / CERN GitLab) or new credentials.'


class RepositoryAccessError(RESTException):
    """No access to the repository."""
    code = 401

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super(RepositoryAccessError, self).__init__(**kwargs)
        self.description = description or self.description


class GitClientNotFound(RESTException):
    """Experiment not present."""
    code = 500

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super(GitClientNotFound, self).__init__(**kwargs)
        self.description = description or self.description


class GitWebhooksIntegrationError(RESTException):
    """Experiment not present."""
    code = 500

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super(GitWebhooksIntegrationError, self).__init__(**kwargs)
        self.description = 'Webhooks integration failure.'


class GitVerificationError(RESTException):
    """Exception during uploading external urls."""

    code = 500

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super(GitVerificationError, self).__init__(**kwargs)
        self.description = description or self.description


class GitIntegrationError(RESTException):
    """Exception during uploading external urls."""

    code = 400

    def __init__(self, description, **kwargs):
        """Initialize exception."""
        super(GitIntegrationError, self).__init__(**kwargs)
        self.description = description or self.description
