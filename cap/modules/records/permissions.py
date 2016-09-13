# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
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

"""Access controls for records on CAP."""

from __future__ import absolute_import, print_function

from flask_principal import ActionNeed
from flask_security import current_user
from invenio_access import DynamicPermission
from invenio_search import current_search
from invenio_search.utils import schema_to_index


def record_permission_factory(record=None, action=None):
    """Record permission factory."""
    return RecordPermission.create(record, action)


def record_create_permission_factory(record=None):
    """Create permission factory."""
    return record_permission_factory(record=record, action='create')


def record_read_permission_factory(record=None):
    """Read permission factory."""
    return record_permission_factory(record=record, action='read')


def record_update_permission_factory(record=None):
    """Update permission factory."""
    return record_permission_factory(record=record, action='update')


def record_delete_permission_factory(record=None):
    """Delete permission factory."""
    return record_permission_factory(record=record, action='delete')


def deposit_read_permission_factory(record=None):
    """Record permission factory."""
    if record and 'deposits' in record['$schema']:
        return DepositPermission.create(record=record, action='read')
    else:
        return RecordPermission.create(record=record, action='read')


def deposit_delete_permission_factory(record=None):
    """Record permission factory."""
    return DepositPermission.create(record=record, action='delete')


class RecordPermission(object):
    """Record permission.

    - Create action given to any authenticated user.
    - Read access given to everyone.
    - Update access given to record owners.
    - Delete access given to admins only.
    """

    create_actions = ['create']
    read_actions = ['read']
    update_actions = ['update']
    delete_actions = ['delete']

    def __init__(self, record, func, user):
        """Initialize a file permission object."""
        self.record = record
        self.func = func
        self.user = user or current_user

    def can(self):
        """Determine access."""
        return self.func(self.user, self.record)

    @classmethod
    def create(cls, record, action, user=None):
        """Create a record permission."""
        if action in cls.create_actions:
            return cls(record, allow, user)
        elif action in cls.read_actions:
            return cls(record, allow, user)
        elif action in cls.update_actions:
            return cls(record, has_update_permission, user)
        elif action in cls.delete_actions:
            return cls(record, has_admin_permission, user)
        else:
            return cls(record, deny, user)


class DepositPermission(RecordPermission):
    """Deposit permission.

    - Read action given to record owners.
    - Delete action given to record owners (still subject to being unpublished)
    """

    @classmethod
    def create(cls, record, action, user=None):
        """Create a deposit permission."""
        if action in cls.read_actions:
            return cls(record, has_update_permission, user)
        elif action in cls.delete_actions:
            return cls(record, has_update_permission, user)
        return super(DepositPermission, cls).create(record, action, user=user)


#
# Utility functions
#
def deny(user, record):
    """Deny access."""
    return False


def allow(user, record):
    """Allow access."""
    return True


def schema_prefix(schema):
    """Get index prefix for a given schema."""
    if not schema:
        return None
    index, doctype = schema_to_index(
        schema, index_names=current_search.mappings.keys())
    return index.split('-')[0]


def is_record(record):
    """Determine if a record is a bibliographic record."""
    return schema_prefix(record.get('$schema')) == 'records'


def is_deposit(record):
    """Determine if a record is a deposit record."""
    return schema_prefix(record.get('$schema')) == 'deposits'


def has_update_permission(user, record):
    """Check if user has update access to the record."""
    # Allow owners
    user_id = int(user.get_id()) if user.is_authenticated else None
    if user_id in record.get('owners', []):
        return True
    if user_id in record.get('_deposit', {}).get('owners', []):
        return True

    return has_admin_permission(user, record)


def has_admin_permission(user, record):
    """Check if user has admin access to record."""
    # Allow administrators
    # TODO Allow admin permission to the creator of deposit
    if DynamicPermission(ActionNeed('admin-access')):
        return True
