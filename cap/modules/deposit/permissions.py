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

from flask import request
from invenio_access.permissions import ParameterizedActionNeed, Permission

from cap.modules.schemas.errors import SchemaDoesNotExist
from cap.modules.schemas.models import Schema
from cap.modules.schemas.permissions import ReadSchemaPermission

from .errors import WrongJSONSchemaError

DepositReadActionNeed = partial(ParameterizedActionNeed, 'deposit-read')
"""Action need for reading a record."""

DepositUpdateActionNeed = partial(ParameterizedActionNeed, 'deposit-update')
"""Action need for updating a record."""

DepositAdminActionNeed = partial(ParameterizedActionNeed, 'deposit-admin')
"""Action need for administrating a record."""


def deposit_read_need(record):
    """Deposit read action need."""
    return DepositReadActionNeed(str(record.id))


def deposit_update_need(record):
    """Deposit update action need."""
    return DepositUpdateActionNeed(str(record.id))


def deposit_admin_need(record):
    """Deposit admin action need."""
    return DepositAdminActionNeed(str(record.id))


def read_permission_factory(record):
    """Deposit read permission factory."""
    return Permission(deposit_read_need(record.id))


def update_permission_factory(record):
    """Deposit update permission factory."""
    return Permission(deposit_update_need(record.id))


def admin_permission_factory(record):
    """Deposit admin permission factory."""
    return Permission(deposit_admin_need(record.id))


class DepositPermission(Permission):
    """Generic deposit permission."""

    actions = {
        "read": deposit_read_need,
        "update": deposit_update_need,
        "admin": deposit_admin_need,
    }

    def __init__(self, deposit, action):
        """Constructor.

        Args:
            deposit: deposit to which access is requested.
        """
        _needs = set()
        _needs.add(self.actions['admin'](deposit))

        if action in self.actions:
            _needs.add(self.actions[action](deposit))

        self._needs = _needs

        super(DepositPermission, self).__init__(*_needs)


class CreateDepositPermission(Permission):
    """Deposit create permission."""

    def __init__(self, record):
        """Initialize state."""
        _needs = set()

        data = request.get_json(force=True)
        _needs.update(self._get_schema_needs(data))

        self._needs = _needs

        super(CreateDepositPermission, self).__init__(*_needs)

    def _get_schema_needs(self, deposit):
        if '$schema' in deposit:
            try:
                schema = Schema.get_by_fullpath(deposit['$schema'])
            except SchemaDoesNotExist:
                raise WrongJSONSchemaError('Schema {} doesnt exist.'.
                                           format(deposit['$schema']))

        elif '$ana_type' in deposit:
            try:
                schema = Schema.get_latest('deposits/records/{}'.format(
                    deposit['$ana_type']))
            except SchemaDoesNotExist:
                raise WrongJSONSchemaError('Schema with name {} doesnt exist.'.
                                           format(deposit['$ana_type']))

        else:
            raise WrongJSONSchemaError(
                'You have to specify either $schema or $ana_type')

        return ReadSchemaPermission(schema).needs


class ReadDepositPermission(DepositPermission):
    """Deposit read permission."""

    def __init__(self, record):
        """Initialize state."""
        super(ReadDepositPermission, self).__init__(record, 'read')


class UpdateDepositPermission(DepositPermission):
    """Deposit update permission."""

    def __init__(self, record):
        """Initialize state."""
        super(UpdateDepositPermission, self).__init__(record, 'update')


class AdminDepositPermission(DepositPermission):
    """Deposit admin permission."""

    def __init__(self, record):
        """Initialize state."""
        super(AdminDepositPermission, self).__init__(record, 'admin')
