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

from marshmallow import Schema, fields

from . import common


class RecordSchemaJSONV1(common.CommonRecordSchemaV1):
    """Schema for records v1 in JSON."""

    metadata = fields.Raw()
    owners = fields.List(
        fields.Integer, attribute='metadata.owners', dump_only=True)
    revision = fields.Integer(dump_only=True)
    updated = fields.Str(dump_only=True)

    can_edit = fields.Boolean(dump_only=True)
    can_admin = fields.Boolean(dump_only=True)


class BasicDepositSchema(Schema):
    """Schema for deposit in JSON."""

    pid = fields.Str(attribute='pid.pid_value', dump_only=True)
    metadata = fields.Raw()
    created = fields.Str(dump_only=True)
    updated = fields.Str(dump_only=True)


class PermissionsDepositSchema(Schema):
    """Schema for files in deposit."""

    permissions = fields.Raw()


class FileSchemaV1(Schema):
    """Schema for files in deposit."""

    pass
