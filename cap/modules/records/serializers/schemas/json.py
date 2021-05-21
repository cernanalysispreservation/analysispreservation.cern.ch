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

from marshmallow import Schema, fields, post_dump
from invenio_jsonschemas import current_jsonschemas
from invenio_pidstore.resolver import Resolver

from cap.modules.deposit.api import CAPDeposit
from cap.modules.records.permissions import UpdateRecordPermission
from cap.modules.deposit.permissions import ReviewDepositPermission
from cap.modules.deposit.review import ReviewSchema

from cap.modules.records.serializers.schemas import common
from cap.modules.records.utils import clean_api_url_for
from cap.modules.repos.serializers import GitWebhookSubscriberSchema
from cap.modules.user.utils import get_role_name_by_id, get_user_email_by_id, \
    get_remote_account_by_id


class RecordSchema(common.CommonRecordSchema):
    """Schema for records v1 in JSON."""
    type = fields.Str(default='record')

    draft_id = fields.String(attribute='metadata._deposit.id', dump_only=True)

    access = fields.Method('get_access', dump_only=True)

    def get_access(self, obj):
        """Return access object."""
        access = obj.get('metadata', {})['_access']

        for permission in access.values():
            if permission['users']:
                for index, user_id in enumerate(permission['users']):
                    permission['users'][index] = get_remote_account_by_id(user_id)  # noqa
            if permission['roles']:
                for index, role_id in enumerate(permission['roles']):
                    permission['roles'][index] = get_role_name_by_id(role_id)

        return access


class RecordFormSchema(RecordSchema):
    """Schema for records v1 in JSON."""

    @post_dump
    def remove_skip_values(self, data):
        keys = ["can_review", "review"]

        for key in keys:
            if data.get(key, '') is None:
                del data[key]

        return data

    schemas = fields.Method('get_record_schemas', dump_only=True)
    can_update = fields.Method('can_user_update', dump_only=True)
    can_review = fields.Method('can_user_review', dump_only=True)
    links = fields.Method('get_links_with_review', dump_only=True)
    review = fields.Method('get_review', dump_only=True)

    def get_record_schemas(self, obj):
        deposit = CAPDeposit.get_record(obj['pid'].object_uuid)

        schema = current_jsonschemas.get_schema(deposit.schema.record_path,
                                                with_refs=True,
                                                resolved=True)
        uiSchema = deposit.schema.record_options

        config_reviewable = deposit.schema_is_reviewable()

        return dict(schema=copy.deepcopy(schema), uiSchema=uiSchema,
                    config_reviewable=config_reviewable)

    def get_review(self, obj):
        depid = obj.get("metadata", {}).get("_deposit", {}).get("id")
        resolver = Resolver(pid_type='depid',
                            object_type='rec',
                            getter=lambda x: x)

        _, rec_uuid = resolver.resolve(depid)
        deposit = CAPDeposit.get_record(rec_uuid)

        if deposit.schema_is_reviewable():
            _reviews = deposit.get('_review', [])
            return ReviewSchema(many=True).dump(_reviews).data
        else:
            return None

    def can_user_update(self, obj):
        deposit = CAPDeposit.get_record(obj['pid'].object_uuid)
        return UpdateRecordPermission(deposit).can()

    def can_user_review(self, obj):
        deposit_pid = obj.get("metadata", {}).get("_deposit", {}).get("id")

        resolver = Resolver(pid_type='depid',
                            object_type='rec',
                            getter=lambda x: x)

        _, rec_uuid = resolver.resolve(deposit_pid)
        deposit = CAPDeposit.get_record(rec_uuid)

        return (deposit.schema_is_reviewable() and
                ReviewDepositPermission(deposit).can())

    def get_links_with_review(self, obj):
        deposit_pid = obj.get("metadata", {}).get("_deposit", {}).get("id")

        resolver = Resolver(pid_type='depid',
                            object_type='rec',
                            getter=lambda x: x)

        _, rec_uuid = resolver.resolve(deposit_pid)
        deposit = CAPDeposit.get_record(rec_uuid)
        links = obj['links']

        if (deposit.schema_is_reviewable() and
                ReviewDepositPermission(deposit).can()):
            links['review'] = clean_api_url_for(
                'invenio_deposit_rest.depid_actions',
                deposit.pid,
                action="review")

        return links


class BasicDepositSchema(Schema):
    """Schema for deposit in JSON."""

    pid = fields.Str(attribute='pid.pid_value', dump_only=True)
    recid = fields.Str(attribute='metadata._deposit.pid.value', dump_only=True)

    metadata = fields.Method('get_metadata', dump_only=True)
    created = fields.Str(dump_only=True)
    updated = fields.Str(dump_only=True)

    def get_metadata(self, obj):
        result = {
            k: v
            for k, v in obj.get('metadata', {}).items() if k not in [
                'control_number',
                '$schema',
                '_deposit',
                '_experiment',
                '_access',
                '_files',
                '_review',
                '_user_edited',
                '_fetched_from',
            ]
        }
        return result


class RepositoriesDepositSchema(Schema):
    """Schema for files in deposit."""

    webhooks = fields.Method('get_webhooks', dump_only=True)

    def get_webhooks(self, obj):
        deposit = CAPDeposit.get_record(obj['pid'].object_uuid)
        webhooks = deposit.model.webhooks

        return GitWebhookSubscriberSchema(many=True).dump(webhooks).data


class PermissionsDepositSchema(Schema):
    """Schema for files in deposit."""

    permissions = fields.Method('get_access', dump_only=True)

    def get_access(self, obj):
        """Return access object."""
        access = {
            k.replace('deposit-', ''): {
                'users':
                [get_user_email_by_id(user_id) for user_id in v['users']],
                'roles':
                [get_role_name_by_id(role_id) for role_id in v['roles']]
            }
            for k, v in obj['metadata']['_access'].items()
        }

        return access


class FileSchemaV1(Schema):
    """Schema for files in deposit."""

    pass
