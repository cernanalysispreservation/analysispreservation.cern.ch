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
"""Git exceptions."""


class GitError(Exception):
    """General Git clients error."""
    def __init__(self, *args):
        """Initialize exception."""
        super().__init__(*args)


class GitURLParsingError(GitError):
    """Git url error."""
    def __init__(self, message=None, **kwargs):
        """Initialize exception."""
        message = message or 'Invalid git URL.'
        super().__init__(message, **kwargs)


class GitRequestWithInvalidSignature(GitError):
    """Git request with invalid signature."""
    def __init__(self, message=None, **kwargs):
        """Initialize exception."""
        message = message or 'Signatures for this request don\'t match.'
        super().__init__(message, **kwargs)


class GitHostNotSupported(GitError):
    """API host not supported."""
    def __init__(self, message=None, **kwargs):
        """Initialize exception."""
        message = message or 'Host not supported'
        super().__init__(message, **kwargs)


class GitIntegrationError(GitError):
    """Exception during connecting analysis with repository."""
    def __init__(self, message=None, **kwargs):
        """Initialize exception."""
        self.message = message or \
            'Error occured during connecting analysis with repository.'
        super().__init__(message, **kwargs)


class GitUnauthorizedRequest(GitError):
    """User not authorized."""
    def __init__(self, message=None, **kwargs):
        """Initialize exception."""
        self.message = message or \
            'User not authorized.'
        super().__init__(message, **kwargs)


class GitObjectNotFound(GitError):
    """Git Webhook does not exist."""
    def __init__(self, message=None, **kwargs):
        """Initialize exception."""
        self.message = message or 'Object not found.'
        super().__init__(message, **kwargs)
