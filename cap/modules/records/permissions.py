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

""" CAP Permissions for records. """

from functools import partial

from invenio_access.permissions import (
    DynamicPermission, ParameterizedActionNeed)

RecordReadActionNeed = partial(ParameterizedActionNeed, 'records-read')
"""Action need for reading a record."""

records_read_all = RecordReadActionNeed(None)
"""Read all records action need."""

RecordCreateActionNeed = partial(ParameterizedActionNeed, 'records-create')
"""Action need for creating a record."""

records_create_all = RecordCreateActionNeed(None)
"""Create all records action need."""

RecordUpdateActionNeed = partial(ParameterizedActionNeed, 'records-update')
"""Action need for updating a record."""

records_update_all = RecordUpdateActionNeed(None)
"""Update all records action need."""

RecordDeleteActionNeed = partial(ParameterizedActionNeed, 'records-delete')
"""Action need for deleting a record."""

records_delete_all = RecordDeleteActionNeed(None)
"""Delete all records action need."""


def read_permission_factory(record):
    """Factory for creating read permissions for records."""
    return DynamicPermission(RecordReadActionNeed(str(record.id)))


def create_permission_factory(record):
    """Factory for creating create permissions for records."""
    return DynamicPermission(RecordCreateActionNeed(str(record.id)))


def update_permission_factory(record):
    """Factory for creating update permissions for records."""
    return DynamicPermission(RecordUpdateActionNeed(str(record.id)))


def delete_permission_factory(record):
    """Factory for creating delete permissions for records."""
    return DynamicPermission(RecordDeleteActionNeed(str(record.id)))
