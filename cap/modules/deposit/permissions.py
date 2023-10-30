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
from invenio_files_rest.models import Bucket
from invenio_jsonschemas.errors import JSONSchemaNotFound
from invenio_pidstore.models import PersistentIdentifier
from invenio_records_files.models import RecordsBuckets
from sqlalchemy.orm.exc import NoResultFound

from cap.modules.deposit.errors import WrongJSONSchemaError
from cap.modules.experiments.permissions import cms_pag_convener_action
from cap.modules.records.permissions import RecordFilesPermission
from cap.modules.schemas.models import Schema
from cap.modules.schemas.permissions import (
    deposit_schema_admin_action,
    deposit_schema_clone_action,
    deposit_schema_create_action,
    deposit_schema_delete_action,
    deposit_schema_read_action,
    deposit_schema_review_action,
    deposit_schema_update_action,
    deposit_schema_upload_action,
)
from cap.modules.schemas.resolvers import resolve_schema_by_url

DepositReadActionNeed = partial(ParameterizedActionNeed, 'deposit-read')
"""Action need for reading a record."""

DepositUpdateActionNeed = partial(ParameterizedActionNeed, 'deposit-update')
"""Action need for updating a record."""

DepositAdminActionNeed = partial(ParameterizedActionNeed, 'deposit-admin')
"""Action need for administrating a record."""

DepositCloneActionNeed = partial(ParameterizedActionNeed, 'deposit-clone')
"""Action need for administrating a record."""

DepositReviewActionNeed = partial(ParameterizedActionNeed, 'deposit-review')
"""Action need for reviewing a record."""

DepositUploadActionNeed = partial(ParameterizedActionNeed, 'deposit-upload')
"""Action need for administrating a record."""

DepositDeleteActionNeed = partial(ParameterizedActionNeed, 'deposit-delete')
"""Action need for administrating a record."""


def deposit_read_need(record):
    """Deposit read action need."""
    return DepositReadActionNeed(str(record.id))


def deposit_update_need(record):
    """Deposit update action need."""
    return DepositUpdateActionNeed(str(record.id))


def deposit_review_need(record):
    """Deposit admin action need."""
    return DepositReviewActionNeed(str(record.id))


def deposit_admin_need(record):
    """Deposit admin action need."""
    return DepositAdminActionNeed(str(record.id))


def read_permission_factory(record):
    """Deposit read permission factory."""
    return Permission(deposit_read_need(record.id))


def update_permission_factory(record):
    """Deposit update permission factory."""
    return Permission(deposit_update_need(record.id))


def review_permission_factory(record):
    """Deposit admin permission factory."""
    return Permission(deposit_review_need(record.id))


def admin_permission_factory(record):
    """Deposit admin permission factory."""
    return Permission(deposit_admin_need(record.id))


class DepositPermission(Permission):
    """Generic deposit permission."""

    actions = {
        "read": [
            deposit_read_need,
            deposit_update_need,
            deposit_admin_need,
            deposit_review_need,
        ],
        "update": [
            deposit_update_need,
            deposit_admin_need,
        ],
        "review": [
            deposit_review_need,
            deposit_admin_need,
        ],
        "admin": [
            deposit_admin_need,
        ],
    }

    schema_actions = {
        "read": [
            deposit_schema_read_action,
            deposit_schema_update_action,
            deposit_schema_review_action,
            deposit_schema_admin_action,
        ],
        "update": [deposit_schema_update_action, deposit_schema_admin_action],
        "review": [deposit_schema_review_action, deposit_schema_admin_action],
        "admin": [deposit_schema_admin_action],
        "upload": [
            deposit_schema_upload_action,
            deposit_schema_update_action,
            deposit_schema_admin_action,
        ],
        "clone": [deposit_schema_clone_action, deposit_schema_admin_action],
        "delete": [deposit_schema_delete_action, deposit_schema_admin_action],
    }

    def __init__(self, deposit, action, extra_needs=None):
        """Constructor.

        Args:
            deposit: deposit to which access is requested.
        """
        _needs = set()

        if extra_needs:
            _needs.update(extra_needs)

        if action in self.actions:
            action_needs = set([an(deposit) for an in self.actions[action]])
            _needs.update(action_needs)

        if action in self.schema_actions:
            schema_action_needs = set(
                [an(deposit.schema.id) for an in self.schema_actions[action]]
            )
            _needs.update(schema_action_needs)

        super(DepositPermission, self).__init__(*_needs)


class CreateDepositPermission(Permission):
    """Deposit create permission."""

    def __init__(self, record):
        """Initialize state."""
        # Get deposit data from request and get the schema
        # from the $schema or $ana_type fields to get required permissions
        data = request.get_json(force=True)
        deposit_create_needs = self.get_schema_access(data)

        super(CreateDepositPermission, self).__init__(*deposit_create_needs)

    @staticmethod
    def get_schema_access(data):
        """Create deposit permissions are based on schema's permissions."""
        if '$schema' in data:
            try:
                schema = resolve_schema_by_url(data['$schema'])
            except JSONSchemaNotFound:
                raise WrongJSONSchemaError(
                    f'Schema {data["$schema"]} doesnt exist.'
                )

        elif '$ana_type' in data:
            try:
                schema = Schema.get_latest(data['$ana_type'])
            except JSONSchemaNotFound:
                raise WrongJSONSchemaError(
                    f'Schema with name {data["$ana_type"]} doesnt exist.'
                )

        else:
            raise WrongJSONSchemaError(
                'You have to specify either $schema or $ana_type'
            )

        _needs = set()
        _needs.add(deposit_schema_create_action(schema.id))

        return _needs


class ReadDepositPermission(DepositPermission):
    """Deposit read permission."""

    def __init__(self, record):
        """Initialize state."""
        extra_needs = self.get_schema_needs_for_questionnaire(record)

        super(ReadDepositPermission, self).__init__(record, 'read', extra_needs)

    @staticmethod
    def get_schema_needs_for_questionnaire(record):
        """Create deposit permissions are based on schema's permissions."""
        _needs = set()

        if record.schema.name == 'cms-stats-questionnaire':
            _needs.add(cms_pag_convener_action(None))

            wg = record.get("analysis_context", {}).get("wg")
            if wg:
                _needs.add(cms_pag_convener_action(wg.lower()))

        return _needs


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


class CloneDepositPermission(DepositPermission):
    """Clone deposit permission."""

    def __init__(self, record):
        """Initialize state."""
        super(CloneDepositPermission, self).__init__(record, 'read')


class ReviewDepositPermission(DepositPermission):
    """Review deposit permission."""

    def __init__(self, record):
        """Initialize state."""
        super(ReviewDepositPermission, self).__init__(record, 'review')


class DepositFilesPermission(Permission):
    """Permission for files in deposit records (read and update access)."""

    access_actions = {
        'read': [
            'bucket-read',
            'bucket-read-versions',
            'object-read',
            'object-read-version',
            'multipart-read',
        ],
        'update': [
            'bucket-read',
            'bucket-read-versions',
            'object-read',
            'object-read-version',
            'multipart-read',
            'bucket-update',
            'bucket-listmultiparts',
            'object-delete',
            'object-delete-version',
            'multipart-delete',
        ],
    }

    access_needs = {
        "read": deposit_read_need,
        "update": deposit_update_need,
        "admin": deposit_admin_need,
    }

    schema_actions = {
        "read": deposit_schema_read_action,
        "update": deposit_schema_update_action,
        "admin": deposit_schema_admin_action,
    }

    def __init__(self, deposit, action):
        """Constructor.

        Args:
            deposit: deposit to which access is requested.
        """
        _needs = set()
        _needs.add(self.access_needs['admin'](deposit))

        for access, actions in self.access_actions.items():
            if action in actions:
                _needs.add(self.access_needs[access](deposit))

                _needs.add(
                    self.schema_actions[access](
                        resolve_schema_by_url(deposit.json['$schema']).id
                    )
                )

        super(DepositFilesPermission, self).__init__(*_needs)


def files_permission_factory(obj, action=None):
    """Permission factory for deposit files."""
    bucket_id = str(obj.id) if isinstance(obj, Bucket) else str(obj.bucket_id)

    try:
        bucket = RecordsBuckets.query.filter_by(bucket_id=bucket_id).one()
        record_type = _get_record_type(bucket.record.id)

        return {
            'recid': RecordFilesPermission(bucket.record, action),
            'depid': DepositFilesPermission(bucket.record, action),
        }[record_type]

    except (NoResultFound, KeyError):
        return Permission()


def _get_record_type(record_metadata_uuid):
    try:
        pid = PersistentIdentifier.query.filter_by(
            object_uuid=record_metadata_uuid
        ).one()
        return pid.pid_type
    except NoResultFound:
        return None
