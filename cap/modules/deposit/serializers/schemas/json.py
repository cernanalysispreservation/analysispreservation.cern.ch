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

import copy

from flask_login import current_user
from flask_principal import RoleNeed
from invenio_access.permissions import Permission
from invenio_jsonschemas import current_jsonschemas
from marshmallow import fields, post_dump, pre_dump

from cap.modules.deposit.permissions import (
    AdminDepositPermission,
    ReviewDepositPermission,
    UpdateDepositPermission,
)
from cap.modules.deposit.review import ReviewSchema
from cap.modules.deposit.utils import parse_schema_permission_info
from cap.modules.records.serializers.schemas import common
from cap.modules.repos.serializers import GitWebhookSubscriberSchema
from cap.modules.repos.utils import populate_template_from_ctx
from cap.modules.user.utils import get_remote_account_by_id, get_role_name_by_id


class DepositSearchSchema(common.CommonRecordSchema):
    """Schema for deposit v1 in JSON, used in search."""

    type = fields.Str(default="deposit")

    recid = fields.Str(
        attribute="metadata._deposit.pid.value", dump_only=True
    )  # only for published ones

    cloned_from = fields.Dict(
        attribute="metadata._deposit.cloned_from.value", dump_only=True
    )


class DepositSchema(DepositSearchSchema):
    """Schema for deposit v1 in JSON. Used in deposits, includes `access`."""

    access = fields.Method("get_access", dump_only=True)

    def get_access(self, obj):
        """Return access object."""
        access = obj.get("metadata", {})["_access"]

        for permission in access.values():
            if permission["users"]:
                for index, user_id in enumerate(permission["users"]):
                    permission["users"][index] = get_remote_account_by_id(
                        user_id
                    )  # noqa
            if permission["roles"]:
                for index, role_id in enumerate(permission["roles"]):
                    permission["roles"][index] = get_role_name_by_id(role_id)

        return access


class DepositFormSchema(DepositSchema):
    """Schema for deposit v1 in JSON."""

    SKIP_VALUES = set([None])

    @pre_dump
    def pre_process(self, data):
        _schema = data["deposit"].schema

        data["deposit_schema"] = _schema
        data["deposit_schema_resolved"] = current_jsonschemas.get_schema(
            _schema.deposit_path, with_refs=True, resolved=True
        )

        data["x-cap-permission"] = self.get_schema_permission_info(data)
        return data

    @post_dump
    def remove_skip_values(self, data):
        # maybe we should add 'x_cap_permissions' and 'user_schema_permissions'
        keys = ["can_review", "review", "x_cap_permission", "egroups"]

        for key in keys:
            if data.get(key, "") is None:
                del data[key]

        return data

    schemas = fields.Method("get_deposit_schemas", dump_only=True)
    webhooks = fields.Method("get_webhooks", dump_only=True)
    # workflows = fields.Method('get_workflows', dump_only=True)

    can_update = fields.Method("can_user_update", dump_only=True)
    can_admin = fields.Method("can_user_admin", dump_only=True)
    can_review = fields.Method("can_user_review", dump_only=True)
    review = fields.Method("get_review", dump_only=True)
    links = fields.Method("get_links_with_review", dump_only=True)
    x_cap_permission = fields.Dict(attribute="x-cap-permission", dump_only=True)

    def get_webhooks(self, obj):
        webhooks = obj["deposit"].model.webhooks
        return GitWebhookSubscriberSchema(many=True).dump(webhooks).data

    # def get_workflows(self, obj):
    #     workflows = obj['deposit'].model.reana_workflows
    #     return ReanaWorkflowSchema(many=True).dump(workflows).data

    def get_deposit_schemas(self, obj):
        ui_schema = obj["deposit_schema"].deposit_options
        schema = obj["deposit_schema_resolved"]

        if obj["x-cap-permission"]:
            schema = self.get_read_only_status(obj["x-cap-permission"], schema)

        schema_config = obj['deposit'].schema.config
        repo_config = schema_config.get('repositories', {})

        for rc, rc_data in repo_config.items():
            try:
                name = populate_template_from_ctx(
                    obj['deposit'], rc_data.get('repo_name')
                )
                rc_data["default_name"] = name
            except Exception:
                rc_data["default_name"] = 'no_name'
                pass

        return dict(
            schema=copy.deepcopy(schema),
            uiSchema=ui_schema,
            config=schema_config,
        )

    def get_read_only_status(self, permission_info, schema):
        for x_cap_field in permission_info:
            if self.can_user_edit_field(x_cap_field.get("value")):
                schema_field = schema
                nested_fields = x_cap_field.get("path")
                if nested_fields:
                    for field in nested_fields:
                        schema_field = self.iterate_schema(schema_field, field)
                schema_field["readOnly"] = True
        return schema

    def iterate_schema(self, schema_field, field):
        return schema_field[field]

    def get_review(self, obj):
        if (
            obj["deposit"].schema_is_reviewable()
            and ReviewDepositPermission(obj["deposit"]).can()
        ):
            _reviews = obj.get("metadata", {}).get("_review", [])
            return ReviewSchema(many=True).dump(_reviews).data
        else:
            return None

    def get_links_with_review(self, obj):
        links = obj["links"]

        if obj["deposit"].schema_is_reviewable():
            links["review"] = links["publish"].replace("publish", "review")

        return links

    def can_user_update(self, obj):
        return UpdateDepositPermission(obj["deposit"]).can()

    def can_user_admin(self, obj):
        return AdminDepositPermission(obj["deposit"]).can()

    def can_user_review(self, obj):
        if obj["deposit"].schema_is_reviewable():
            can_review = ReviewDepositPermission(obj["deposit"]).can()
            if can_review:
                return True

    def get_schema_permission_info(self, obj):
        name, version = (
            obj["deposit_schema"].name,
            obj["deposit_schema"].version,
        )
        permission_field = obj["deposit_schema"].config.get("x-cap-permission")

        if permission_field:
            schema = obj["deposit_schema_resolved"]
            x_cap_fields = parse_schema_permission_info(name, version, schema)
            return x_cap_fields
        return None

    def can_user_edit_field(self, perm_obj):
        allowed_users = perm_obj.get("users")
        allowed_roles = perm_obj.get("roles")

        error = True
        if allowed_users:
            current_user_email = current_user.email
            if current_user_email in allowed_users:
                error = False

        if allowed_roles and error:
            user_allowed = any(
                Permission(RoleNeed(_role)).can() for _role in allowed_roles
            )
            error = False if user_allowed else True

        return error
