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


"""CAP Deposit permissions."""

from functools import partial

from flask import current_app, request


from cap.modules.access.permissions import OrPermissions, \
    StrictDynamicPermission
from cap.utils import obj_or_import_string
from invenio_access.permissions import (
    superuser_access, DynamicPermission, ParameterizedActionNeed)


class DepositPermission(OrPermissions):
    """Generic deposit permission."""

    def __init__(self, record, action):
        """Constructor.
        Args:
            deposit: deposit to which access is requested.
        """
        super(DepositPermission, self).__init__()
        # superuser can always do everything
        self.permissions.add(StrictDynamicPermission(superuser_access))

        self.deposit = record
        self.action = action
        self._load_deposit_group_permissions()

    def _load_permissions(self):
        """Create additional permission."""
        raise NotImplementedError()

    def _load_deposit_group_permissions(self):
        _deposit_group = self._get_deposit_group_info()

        _permission_factory_imp = \
            _deposit_group.get(self.action + '_permission_factory_imp', None)

        _permission_factory_imp = \
            obj_or_import_string(_permission_factory_imp)

        if _permission_factory_imp:
            self.permissions.add(_permission_factory_imp(self.deposit))

    def _get_deposit_group_info(self):
        """Retrieve deposit group information for specific schema"""
        # import ipdb;ipdb.set_trace()
        try:
            schema = self.deposit.get("$schema", None) \
                                 .split('/schemas/', 1)[1]
        except:
            return None

        _deposit_group = \
            next(
                (depgroup
                 for dg, depgroup
                 in current_app.config.get('DEPOSIT_GROUPS').iteritems()
                 if schema in depgroup['schema']
                 ),
                None
            )

        return _deposit_group


class UpdateDepositPermission(DepositPermission):
    """Deposit update permission"""

    def __init__(self, record):
        super(UpdateDepositPermission, self).__init__(record, 'update')


class CreateDepositPermission(DepositPermission):
    """Deposit update permission"""

    def __init__(self, record):
        # Get payload and pass it as record to get the '$schema'
        record = request.get_json(force=True)
        super(CreateDepositPermission, self).__init__(record, 'create')


class ReadDepositPermission(DepositPermission):
    """Deposit read permission"""

    def __init__(self, record):
        super(ReadDepositPermission, self).__init__(record, 'read')


class DeleteDepositPermission(DepositPermission):
    """Deposit delete permission"""

    def __init__(self, record):
        super(DeleteDepositPermission, self).__init__(record, 'delete')


DepositReadActionNeed = partial(ParameterizedActionNeed, 'deposit-read')
"""Action need for reading a record."""

deposit_read_all = DepositReadActionNeed(None)
"""Read all deposit action need."""

DepositAdminActionNeed = partial(ParameterizedActionNeed, 'deposit-admin')
"""Action need for creating a record."""

deposit_admin_all = DepositAdminActionNeed(None)
"""Create all deposit action need."""

DepositUpdateActionNeed = partial(ParameterizedActionNeed, 'deposit-update')
"""Action need for updating a record."""

deposit_update_all = DepositUpdateActionNeed(None)
"""Update all deposit action need."""

DepositDeleteActionNeed = partial(ParameterizedActionNeed, 'deposit-delete')
"""Action need for deleting a record."""

deposit_delete_all = DepositDeleteActionNeed(None)
"""Delete all deposit action need."""


def read_permission_factory(record):
    """Factory for creating read permissions for deposit."""
    return DynamicPermission(DepositReadActionNeed(str(record.id)))


def create_permission_factory(record):
    """Factory for creating create permissions for deposit."""
    return DynamicPermission(DepositAdminActionNeed(str(record.id)))


def update_permission_factory(record):
    """Factory for creating update permissions for deposit."""
    return DynamicPermission(DepositUpdateActionNeed(str(record.id)))


def delete_permission_factory(record):
    """Factory for creating delete permissions for deposit."""
    return DynamicPermission(DepositDeleteActionNeed(str(record.id)))
