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


"""CAP generic permissions."""

from flask_principal import Permission
from invenio_access.permissions import DynamicPermission

AllowAllPermission = type('Allow', (), {
    'can': lambda self: True,
    'allows': lambda *args: True,
})()
"""Permission that always allow an access."""


DenyAllPermission = type('Deny', (), {
    'can': lambda self: False,
    'allows': lambda *args: False,
})()
"""Permission that always deny an access."""


class StrictDynamicPermission(DynamicPermission):
    """Stricter DynamicPermission.
    It adds the given needs to the returned needs instead of using only
    those found in the database.
    """

    def __init__(self, *needs):
        self.explicit_excludes = set()
        super(StrictDynamicPermission, self).__init__(*needs)

    @property
    def needs(self):
        needs = super(StrictDynamicPermission, self).needs
        needs.update(self.explicit_needs)
        return needs

    @property
    def excludes(self):
        excludes = super(StrictDynamicPermission, self).excludes
        excludes.update(self.explicit_excludes)
        return excludes


class PermissionSet(Permission):
    """Abstract permissions combining multiple permissions."""

    def __init__(self, *permissions):
        """A set of set of permissions, all of which must be allow the
        identity to have access.
        """
        self.permissions = set(permissions)

    def allows(self, identity):
        raise NotImplementedError()

    def reverse(self):
        raise NotImplementedError()

    def union(self):
        raise NotImplementedError()

    def difference(self):
        raise NotImplementedError()

    def issubset(self):
        raise NotImplementedError()

    def __repr__(self):
        return '<{0} {1} permissions={2}>'.format(
            self.__class__.__name__, self.action, self.permissions
        )


class AndPermissions(PermissionSet):
    """Represents a set of Permissions, all of which must be allowed to access
    a resource
    Args:
        permissions: a set of permissions.
    """
    action = 'AND'

    def allows(self, identity):
        """Whether the identity can access this permission.
        Args:
            identity: The identity
        """
        for permission in self.permissions:
            if not permission.allows(identity):
                return False
        return True


class OrPermissions(PermissionSet):
    """Represents a set of Permissions, any of which must be allowed to access
    a resource
    Args:
        permissions: a set of permissions.
    """

    action = 'OR'

    def allows(self, identity):
        """Whether the identity can access this permission.
        Args:
            identity: The identity
        """
        for permission in self.permissions:
            if permission.allows(identity):
                return True
        return False
