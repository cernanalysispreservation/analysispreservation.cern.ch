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
"""Serializer for deposit reviews."""

from __future__ import absolute_import, print_function

from flask import request
from invenio_deposit.api import index
from invenio_deposit.utils import mark_as_action
from invenio_records_rest.errors import InvalidDataRESTError
from marshmallow import Schema, fields, validate

from cap.modules.deposit.errors import EgroupError as EgroupResponseError
from cap.modules.deposit.permissions import AdminDepositPermission
from cap.modules.services.utils.cern_egroups import (
    EgroupError,
    addMembers,
    createGroup,
)


class MemberPayload(Schema):
    type = fields.Str(
        validate=validate.OneOf(["add-egroup", "remove-egroup", "add-members"]),
        required=True,
    )
    value = fields.Str()


class EgroupPayload(Schema):
    """Schema for deposit review."""

    type = fields.Str(
        validate=validate.OneOf(["add-egroup", "remove-egroup", "add-members"]),
        required=True,
    )
    name = fields.Str(required=True)
    description = fields.Str()
    members = fields.Nested(MemberPayload, many=True)


class CERNEgroupMixin(object):
    """Methods for review schema."""

    @index
    @mark_as_action
    def egroups(self, pid, *args, **kwargs):
        """Egroups actions for a deposit.

        Adds egroups assosiated to the deposit.
        """
        with AdminDepositPermission(self).require(403):
            if self.schema_egroups_enabled():
                data = request.get_json()
                if data is None:
                    raise InvalidDataRESTError()

                try:
                    if data.get("type") == "add-egroup":
                        self.create_egroup(data)
                    elif data.get("type") == "remove-egroup":
                        self.remove_egroup(data)
                    elif data.get("type") == "add-members":
                        self.add_group_members(data)

                    self.commit()
                except EgroupError as err:
                    desc = err.args[0] if len(err.args) else ""
                    raise EgroupResponseError(description=desc)
            else:
                raise EgroupResponseError(None)

            return self

    def schema_egroups_enabled(self):
        config = self.schema.config

        if config:
            return config.get('egroups', False)
        return False

    def create_egroup(self, data):
        name = data.get("name")
        description = data.get("description", "-")

        _egroups = self.get("_egroups", [])
        for grp in _egroups:
            if grp.get("name") == name:
                raise EgroupError(f"E-group '{name}' already linked")

        createGroup(name, description)
        group = {"name": name, "description": description}

        _egroups.append(group)
        self["_egroups"] = _egroups

    def remove_egroup(self, data):
        name = data.get("name")

        _egroups = self.get("_egroups", [])
        for grp in _egroups:
            if grp.get("name") == name:
                del grp

        self["_egroups"] = _egroups

    def add_group_members(self, data):
        name = data.get("name")
        members = data.get("members", [])

        _egroups = self.get("_egroups", [])
        for grp in _egroups:
            if grp.get("name") == name:
                raise EgroupError()

        addMembers(name, members)
