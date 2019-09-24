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
"""Deposit API."""

from __future__ import absolute_import, print_function

import copy
from functools import wraps

from celery import shared_task
from flask import current_app, request
from flask_login import current_user
from invenio_access.models import ActionRoles, ActionUsers
from invenio_db import db
from invenio_deposit.api import Deposit, index, preserve
from invenio_deposit.utils import mark_as_action
from invenio_files_rest.errors import MultipartMissingParts
from invenio_files_rest.models import Bucket, FileInstance, ObjectVersion
from invenio_jsonschemas.errors import JSONSchemaNotFound
from invenio_jsonschemas.proxies import current_jsonschemas
from invenio_records.models import RecordMetadata
from invenio_records_files.models import RecordsBuckets
from invenio_rest.errors import FieldError
from jsonschema.exceptions import RefResolutionError
from jsonschema.validators import Draft4Validator
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.local import LocalProxy

from cap.modules.deposit.utils import download_from_git, name_git_record
from cap.modules.experiments.permissions import exp_need_factory
from cap.modules.records.api import CAPRecord
from cap.modules.repoimporter.utils import parse_url
from cap.modules.schemas.models import Schema
from cap.modules.schemas.resolvers import (resolve_schema_by_url,
                                           schema_name_to_url)
from cap.modules.user.errors import DoesNotExistInLDAP
from cap.modules.user.utils import (get_existing_or_register_role,
                                    get_existing_or_register_user)

from .errors import (DepositValidationError, FileUploadError,
                     UpdateDepositPermissionsError)
from .fetchers import cap_deposit_fetcher
from .minters import cap_deposit_minter
from .permissions import (AdminDepositPermission, CloneDepositPermission,
                          DepositAdminActionNeed, DepositReadActionNeed,
                          DepositUpdateActionNeed, UpdateDepositPermission)

_datastore = LocalProxy(lambda: current_app.extensions['security'].datastore)

PRESERVE_FIELDS = (
    '_deposit',
    '_buckets',
    '_files',
    '_experiment',
    '_access',
    'general_title',
    '$schema',
)

DEPOSIT_ACTIONS = (
    'deposit-read',
    'deposit-update',
    'deposit-admin',
)


def DEPOSIT_ACTIONS_NEEDS(id):
    """Method to construct action needs."""
    return {
        'deposit-read': DepositReadActionNeed(str(id)),
        'deposit-update': DepositUpdateActionNeed(str(id)),
        'deposit-admin': DepositAdminActionNeed(str(id))
    }


EMPTY_ACCESS_OBJECT = {
    action: {
        'users': [],
        'roles': []
    }
    for action in DEPOSIT_ACTIONS
}


class CAPDeposit(Deposit):
    """Define API for changing deposit state."""

    deposit_fetcher = staticmethod(cap_deposit_fetcher)

    deposit_minter = staticmethod(cap_deposit_minter)

    published_record_class = CAPRecord

    @property
    def schema(self):
        """Schema property."""
        return resolve_schema_by_url(self['$schema'])

    @property
    def record_schema(self):
        """Get corresponding schema path for record."""
        return current_jsonschemas.path_to_url(self.schema.record_path)

    def build_deposit_schema(self, record):
        """Get schema path for deposit."""
        return current_jsonschemas.path_to_url(self.schema.deposit_path)

    def pop_from_data(method, fields=None):
        """Remove fields from deposit data.

        :param fields: List of fields to remove (default: ``('_deposit',)``).
        """
        fields = fields or (
            '_deposit',
            '_access',
            '_experiment',
            'general_title',
            '$schema',
        )

        @wraps(method)
        def wrapper(self, *args, **kwargs):
            """Check current deposit status."""
            for field in fields:
                if field in args[0]:
                    args[0].pop(field)

            return method(self, *args, **kwargs)

        return wrapper

    def pop_from_data_patch(method, fields=None):
        """Remove fields from deposit data.

        :param fields: List of fields to remove (default: ``('_deposit',)``).
        """
        fields = fields or (
            '/_deposit',
            '/_access',
            '/_files',
            '/_experiment',
            '/$schema',
        )

        @wraps(method)
        def wrapper(self, *args, **kwargs):
            """Check current deposit status."""
            for field in fields:
                for k, patch in enumerate(args[0]):
                    if field == patch.get("path", None):
                        del args[0][k]

            return method(self, *args, **kwargs)

        return wrapper

    @mark_as_action
    def permissions(self, pid=None):
        """Permissions action.

        We expect an array of objects:
        [{
        "email": "",
        "type": "user|egroup",
        "op": "add|remove",
        "action": "deposit-read|deposit-update|deposit-admin"
        }]
        """
        with AdminDepositPermission(self).require(403):

            data = request.get_json()

            return self.edit_permissions(data)

    @mark_as_action
    def publish(self, *args, **kwargs):
        """Simple file check before publishing."""
        with AdminDepositPermission(self).require(403):
            for file_ in self.files:
                if file_.data['checksum'] is None:
                    raise MultipartMissingParts()

            return super(CAPDeposit, self).publish(*args, **kwargs)

    @mark_as_action
    def upload(self, pid=None, *args, **kwargs):
        """Upload action for file/repository."""
        with UpdateDepositPermission(self).require(403):
            data = request.get_json()
            try:
                url_attrs = parse_url(data['url'])
            except ValueError:
                raise FileUploadError(
                    'URL could not be parsed. '
                    'Try again with correct GitHub / CERN GitLab link.')

            if request:
                _, record = request.view_args.get('pid_value').data
                record_id = str(record.id)
                approved_hosts = ('https://github', 'https://gitlab.cern.ch',
                                  'root://')

                # use the name and branch to create a key for the record
                name = name_git_record(url_attrs, data['type'])
                obj = ObjectVersion.create(bucket=record.files.bucket,
                                           key=name)
                obj.file = FileInstance.create()
                record.files.flush()
                record.files[name]['source_url'] = data['url']

                if data['url'].startswith(approved_hosts):
                    record = CAPDeposit.get_record(record_id)
                    download_from_git.apply_async(
                        (record, name, url_attrs, data), serializer='pickle')
                else:
                    raise FileUploadError(
                        'URL could not be parsed. '
                        'Try again with correct GitHub / CERN GitLab link.')

            return self

    @index
    @mark_as_action
    def clone(self, pid=None, id_=None):
        """Clone a deposit.

        Adds snapshot of the files when deposit is cloned.
        """
        with CloneDepositPermission(self).require(403):
            data = copy.deepcopy(self.dumps())
            del data['_deposit'], data['control_number']
            deposit = super(CAPDeposit, self).create(data, id_=id_)
            deposit['_deposit']['cloned_from'] = {
                'type': pid.pid_type,
                'value': pid.pid_value,
                'revision_id': self.revision_id,
            }
            bucket = self.files.bucket.snapshot()
            RecordsBuckets.create(record=deposit.model, bucket=bucket)
            # optionally we might need to do: deposit.files.flush()
            deposit.commit()
            return deposit

    @mark_as_action
    def edit(self, *args, **kwargs):
        """Edit deposit."""
        with UpdateDepositPermission(self).require(403):
            return super(CAPDeposit, self).edit(*args, **kwargs)

    @pop_from_data
    def update(self, *args, **kwargs):
        """Update deposit."""
        with UpdateDepositPermission(self).require(403):
            super(CAPDeposit, self).update(*args, **kwargs)

    @pop_from_data_patch
    def patch(self, *args, **kwargs):
        """Patch deposit."""
        with UpdateDepositPermission(self).require(403):
            return super(CAPDeposit, self).patch(*args, **kwargs)

    def edit_permissions(self, data):
        """Edit deposit permissions.

        We expect an array of objects:
        [{
        "email": "",
        "type": "user|egroup",
        "op": "add|remove",
        "action": "deposit-read|deposit-update|deposit-admin"
        }]

        """
        with db.session.begin_nested():
            for obj in data:
                if obj['type'] == 'user':
                    try:
                        user = get_existing_or_register_user(obj['email'])
                    except DoesNotExistInLDAP:
                        raise UpdateDepositPermissionsError(
                            'User with this mail does not exist in LDAP.')

                    if obj['op'] == 'add':
                        try:
                            self._add_user_permissions(user, [obj['action']],
                                                       db.session)
                        except IntegrityError:
                            raise UpdateDepositPermissionsError(
                                'Permission already exist.')

                    elif obj['op'] == 'remove':
                        try:
                            self._remove_user_permissions(
                                user, [obj['action']], db.session)
                        except NoResultFound:
                            raise UpdateDepositPermissionsError(
                                'Permission does not exist.')

                elif obj['type'] == 'egroup':
                    try:
                        role = get_existing_or_register_role(obj['email'])
                    except DoesNotExistInLDAP:
                        raise UpdateDepositPermissionsError(
                            'Egroup with this mail does not exist in LDAP.')

                    if obj['op'] == 'add':
                        try:
                            self._add_egroup_permissions(
                                role, [obj['action']], db.session)
                        except IntegrityError:
                            raise UpdateDepositPermissionsError(
                                'Permission already exist.')
                    elif obj['op'] == 'remove':
                        try:
                            self._remove_egroup_permissions(
                                role, [obj['action']], db.session)
                        except NoResultFound:
                            raise UpdateDepositPermissionsError(
                                'Permission does not exist.')

        self.commit()

        return self

    @preserve(result=False, fields=PRESERVE_FIELDS)
    def clear(self, *args, **kwargs):
        """Clear only drafts."""
        super(CAPDeposit, self).clear(*args, **kwargs)

    def is_published(self):
        """Check if deposit is published."""
        return self['_deposit'].get('pid') is not None

    def get_record_metadata(self):
        """Get Record Metadata instance for deposit."""
        return RecordMetadata.query.filter_by(id=self.id).one_or_none()

    def commit(self, *args, **kwargs):
        """Synchronize files before commit."""
        self.files.flush()
        return super(CAPDeposit, self).commit(*args, **kwargs)

    def _add_user_permissions(self, user, permissions, session):
        """Adds permissions for user for this deposit."""
        for permission in permissions:
            session.add(
                ActionUsers.allow(DEPOSIT_ACTIONS_NEEDS(self.id)[permission],
                                  user=user))

            session.flush()

            self['_access'][permission]['users'].append(user.id)

    def _remove_user_permissions(self, user, permissions, session):
        """Remove permissions for user for this deposit."""
        for permission in permissions:
            session.delete(
                ActionUsers.query.filter(ActionUsers.action == permission,
                                         ActionUsers.argument == str(self.id),
                                         ActionUsers.user_id == user.id).one())
            session.flush()

            self['_access'][permission]['users'].remove(user.id)

    def _add_egroup_permissions(self, egroup, permissions, session):
        for permission in permissions:
            session.add(
                ActionRoles.allow(DEPOSIT_ACTIONS_NEEDS(self.id)[permission],
                                  role=egroup))
            session.flush()

            self['_access'][permission]['roles'].append(egroup.id)

    def _remove_egroup_permissions(self, egroup, permissions, session):
        for permission in permissions:
            session.delete(
                ActionRoles.query.filter(
                    ActionRoles.action == permission,
                    ActionRoles.argument == str(self.id),
                    ActionRoles.role_id == egroup.id).one())
            session.flush()

            self['_access'][permission]['roles'].remove(egroup.id)

    def _add_experiment_permissions(self, experiment, permissions):
        """Add read permissions to everybody assigned to experiment."""
        exp_need = exp_need_factory(experiment)

        # give read access to members of collaboration
        with db.session.begin_nested():
            for au in ActionUsers.query_by_action(exp_need).all():
                self._add_user_permissions(au.user, permissions, db.session)
            for ar in ActionRoles.query_by_action(exp_need).all():
                self._add_egroup_permissions(ar.role, permissions, db.session)

    def _init_owner_permissions(self, owner=current_user):
        self['_access'] = copy.deepcopy(EMPTY_ACCESS_OBJECT)

        if owner:
            with db.session.begin_nested():
                self._add_user_permissions(owner, DEPOSIT_ACTIONS, db.session)

            self['_deposit']['created_by'] = owner.id
            self['_deposit']['owners'] = [owner.id]

    def _set_experiment(self):
        schema = resolve_schema_by_url(self['$schema'])
        self['_experiment'] = schema.experiment

    def _create_buckets(self):
        bucket = Bucket.create()
        RecordsBuckets.create(record=self.model, bucket=bucket)

    def validate(self, **kwargs):
        """Validate data using schema with ``JSONResolver``."""
        if '$schema' in self and self['$schema']:
            try:
                schema = self['$schema']
                if not isinstance(schema, dict):
                    schema = {'$ref': schema}
                resolver = current_app.extensions[
                    'invenio-records'].ref_resolver_cls.from_schema(schema)

                validator = Draft4Validator(schema, resolver=resolver)

                result = {}
                result['errors'] = [
                    FieldError(list(error.path), str(error.message))
                    for error in validator.iter_errors(self)
                ]

                if result['errors']:
                    raise DepositValidationError(None, errors=result['errors'])
            except RefResolutionError:
                raise DepositValidationError(
                    'Schema with given url not found.')
        else:
            raise DepositValidationError('You need to provide a valid schema.')

    @classmethod
    def get_record(cls, id_, with_deleted=False):
        """Get record instance."""
        deposit = super(CAPDeposit, cls).get_record(id_=id_,
                                                    with_deleted=with_deleted)
        deposit['_files'] = deposit.files.dumps()
        return deposit

    @classmethod
    def create(cls, data, id_=None, owner=current_user):
        """Create a deposit.

        Adds bucket creation immediately on deposit creation.
        """
        data = cls._preprocess_data(data)

        cls._validate_data(data)

        deposit = super(CAPDeposit, cls).create(data, id_=id_)
        deposit._create_buckets()
        deposit._set_experiment()
        deposit._init_owner_permissions(owner)

        deposit.commit()

        return deposit

    @classmethod
    def _preprocess_data(cls, data):
        # data can be sent without specifying particular version of schema,
        # but just with a type, e.g. cms-analysis
        # this be resolved to the last version of deposit schema of this type
        if '$ana_type' in data:
            try:
                ana_type = data.pop('$ana_type')
                data['$schema'] = schema_name_to_url(ana_type)
            except JSONSchemaNotFound:
                raise DepositValidationError(
                    'Schema {} is not a valid deposit schema.'.format(
                        ana_type))

        return data

    @classmethod
    def _validate_data(cls, data):
        if not isinstance(data, dict) or data == {}:

            raise DepositValidationError('Empty deposit data.')

        try:
            schema_url = data['$schema']

        except KeyError:
            raise DepositValidationError('Schema not specified.')
