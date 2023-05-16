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
"""Record API."""

from __future__ import absolute_import, print_function

from flask import current_app
from invenio_access.models import ActionRoles, ActionUsers
from invenio_accounts.models import Role, User
from invenio_db import db
from invenio_records.models import RecordMetadata
from invenio_records_files.api import Record
from invenio_rest.errors import FieldError
from jsonschema.exceptions import RefResolutionError
from sqlalchemy.orm.exc import NoResultFound

from cap.modules.experiments.permissions import exp_need_factory
from cap.modules.records.errors import RecordValidationError
from cap.modules.records.errors import get_error_path
from cap.modules.records.permissions import (RecordAdminActionNeed,
                                             RecordReadActionNeed,
                                             RecordUpdateActionNeed)
from cap.modules.records.validators import RecordValidator

RECORD_ACTIONS = [
    'record-read',
    'record-update',
    'record-admin',
]

DEPOSIT_TO_RECORD_ACTION_MAP = {
    'deposit-read': 'record-read',
    'deposit-update': 'record-update',
    'deposit-admin': 'record-admin'
}


def RECORD_ACTION_NEEDS(id):
    """Construct action needs."""
    return {
        'record-read': RecordReadActionNeed(str(id)),
        'record-update': RecordUpdateActionNeed(str(id)),
        'record-admin': RecordAdminActionNeed(str(id))
    }


class CAPRecord(Record):
    """Record API class for CAP."""

    @classmethod
    def create_bucket(cls, data):
        """Create a bucket for this record.

        Override this method to provide more advanced bucket creation
        capabilities. This method may return a new or existing bucket, or may
        return None, in case no bucket should be created.
        """
        return None

    @classmethod
    def load_bucket(cls, record):
        """Load the bucket id from the record metadata.

        Override this method to provide custom behavior for retrieving the
        bucket id from the record metadata. By default the bucket id is
        retrieved from the ``_bucket`` key. If you override this method, make
        sure you also  override :py:data:`Record.dump_bucket()`.

        :param record: A record instance.
        """
        return

    @classmethod
    def dump_bucket(cls, data, bucket):
        """Dump the bucket id into the record metadata.

        Override this method to provide custom behavior for storing the bucket
        id in the record metadata. By default the bucket id is stored in the
        ``_bucket`` key. If you override this method, make sure you also
        override :py:data:`Record.load_bucket()`.

        This method is called after the bucket is created, but before the
        record is created in the database.

        :param data: A dictionary of the record metadata.
        :param bucket: The created bucket for the record.
        """
        pass

    def get_record_metadata(self):
        """Get Record Metadata instance for deposit."""
        return RecordMetadata.query.filter_by(id=self.id).one_or_none()

    @classmethod
    def create(cls, data, id_=None, **kwargs):
        """Create a new record instance and store it in the database.

        #. Record will inherit all the permissions that deposit had,
        at the moment of publishing.

        #. If deposit was assigned to an experiment,
        all people/egroups assigned to it, will get read access to record.

        """
        cls._add_deposit_permissions(data, id_)

        if data['_experiment']:
            cls._add_experiment_permissions(data, id_)

        return super(CAPRecord, cls).create(data, id_, **kwargs)

    @classmethod
    def _add_deposit_permissions(cls, data, id_):
        """Inherit permissions after deposit."""
        data['_access'] = {
            DEPOSIT_TO_RECORD_ACTION_MAP[action]: permission
            for action, permission in data['_access'].items()
        }

        for action, permission in data['_access'].items():
            for role in permission['roles']:
                role = Role.query.filter_by(id=role).one()
                try:
                    ActionRoles.query.filter_by(action=action,
                                                argument=str(id_),
                                                role_id=role.id).one()
                except NoResultFound:
                    db.session.add(
                        ActionRoles.allow(RECORD_ACTION_NEEDS(id_)[action],
                                          role=role))
            for user in permission['users']:
                user = User.query.filter_by(id=user).one()
                try:
                    ActionUsers.query.filter_by(action=action,
                                                argument=str(id_),
                                                user_id=user.id).one()
                except NoResultFound:
                    db.session.add(
                        ActionUsers.allow(RECORD_ACTION_NEEDS(id_)[action],
                                          user=user))

    @classmethod
    def _add_experiment_permissions(cls, data, id_):
        """Add read permissions to everybody assigned to experiment."""
        exp_need = exp_need_factory(data['_experiment'])

        # give read access to members of collaboration
        for au in ActionUsers.query_by_action(exp_need).all():
            try:
                ActionUsers.query_by_action(
                    RECORD_ACTION_NEEDS(id_)['record-read']).filter_by(
                        user=au.user).one()
            except NoResultFound:
                db.session.add(
                    ActionUsers.allow(RECORD_ACTION_NEEDS(id_)['record-read'],
                                      user=au.user))
            if au.user.id not in data['_access']['record-read']['users']:
                data['_access']['record-read']['users'].append(au.user.id)

        for ar in ActionRoles.query_by_action(exp_need).all():
            try:
                ActionRoles.query_by_action(
                    RECORD_ACTION_NEEDS(id_)['record-read']).filter_by(
                        role=ar.role).one()
            except NoResultFound:
                db.session.add(
                    ActionRoles.allow(RECORD_ACTION_NEEDS(id_)['record-read'],
                                      role=ar.role))
            if ar.role.id not in data['_access']['record-read']['roles']:
                data['_access']['record-read']['roles'].append(ar.role.id)

    def validate(self, **kwargs):
        """Validate data using schema with ``JSONResolver``."""
        if '$schema' in self and self['$schema']:
            try:
                schema = self['$schema']
                if not isinstance(schema, dict):
                    schema = {'$ref': schema}
                resolver = current_app.extensions['invenio-records']\
                    .ref_resolver_cls.from_schema(schema)

                validator = RecordValidator(schema, resolver=resolver)
                errors = [
                    FieldError(get_error_path(error), str(error.message))
                    for error in validator.iter_errors(self)
                ]

                if errors:
                    raise RecordValidationError(None, errors=errors)
            except RefResolutionError:
                raise RecordValidationError(
                    f'Schema {self["$schema"]} not found.')
        else:
            raise RecordValidationError('You need to provide a valid schema.')
