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


"""CAP Schema permissions."""

from functools import partial

from invenio_access.factory import action_factory
from invenio_access.permissions import ParameterizedActionNeed, Permission

from cap.modules.experiments.permissions import exp_need_factory

SchemaReadAction = action_factory(
    'schema-object-read', parameter=True)

SchemaAdminAction = action_factory(
    'schema-object-admin', parameter=True)

SchemaReadActionNeed = partial(ParameterizedActionNeed, 'schema-object-read')
SchemaAdminActionNeed = partial(ParameterizedActionNeed, 'schema-object-admin')


class ReadSchemaPermission(Permission):
    """Schema read permission."""

    def __init__(self, schema):
        """Initialize state.

        Read access for:

        * all members of experiment assigned to schema
        * all users/roles assigned to schema-object-read action

        """
        _needs = set()

        _needs.add(SchemaReadActionNeed(schema.id))
        _needs.add(SchemaAdminActionNeed(schema.id))

        # experiments members can access schema
        if schema.experiment:
            _needs.add(exp_need_factory(schema.experiment))

        super(ReadSchemaPermission, self).__init__(*_needs)


class AdminSchemaPermission(Permission):
    """Schema read permission."""

    def __init__(self, schema):
        """Initialize state.

        Read access for:

        * all members of experiment assigned to schema
        * all users/roles assigned to schema-object-read action

        """
        _needs = set()

        _needs.add(SchemaAdminActionNeed(schema.id))

        super(AdminSchemaPermission, self).__init__(*_needs)
