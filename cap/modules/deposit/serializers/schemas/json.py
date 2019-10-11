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
"""CAP Basic Schemas."""

from __future__ import absolute_import, print_function

import copy

from marshmallow import Schema, fields

from cap.modules.deposit.api import CAPDeposit
from cap.modules.deposit.permissions import (AdminDepositPermission,
                                             UpdateDepositPermission)
from cap.modules.records.serializers.schemas import common
from invenio_jsonschemas import current_jsonschemas


class DepositSchema(common.CommonRecordSchema):
    """Schema for deposit v1 in JSON."""
    type = fields.Str(default='deposit')

    recid = fields.Str(attribute='metadata._deposit.pid.value',
                       dump_only=True)  # only for published ones

    can_update = fields.Method('can_user_update', dump_only=True)
    can_admin = fields.Method('can_user_admin', dump_only=True)

    cloned_from = fields.Dict(attribute='metadata._deposit.cloned_from.value',
                              dump_only=True)

    def can_user_update(self, obj):
        deposit = CAPDeposit.get_record(obj['pid'].object_uuid)
        return UpdateDepositPermission(deposit).can()

    def can_user_admin(self, obj):
        deposit = CAPDeposit.get_record(obj['pid'].object_uuid)
        return AdminDepositPermission(deposit).can()


class DepositFormSchema(DepositSchema):
    """Schema for deposit v1 in JSON."""

    schemas = fields.Method('get_deposit_schemas', dump_only=True)

    def get_deposit_schemas(self, obj):
        deposit = CAPDeposit.get_record(obj['pid'].object_uuid)

        schema = current_jsonschemas.get_schema(
            deposit.schema.deposit_path,
            with_refs=True,
            resolved=True
        )
        uiSchema = deposit.schema.deposit_options

        return dict(schema=copy.deepcopy(schema), uiSchema=uiSchema)
