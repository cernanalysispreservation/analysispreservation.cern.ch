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
import shutil
import tempfile

from functools import wraps
from copy import deepcopy

import requests
from celery import shared_task
from flask import current_app, request
from werkzeug.local import LocalProxy

from cap.config import FILES_URL_MAX_SIZE
from cap.modules.repoimporter.repo_importer import RepoImporter
from cap.modules.schemas.errors import SchemaDoesNotExist
from cap.modules.schemas.models import Schema
from cap.modules.user.errors import DoesNotExistInLDAP
from cap.modules.user.utils import (get_existing_or_register_role,
                                    get_existing_or_register_user)
from flask_login import current_user
from invenio_access.models import ActionRoles, ActionUsers
from invenio_accounts.models import Role, User
from invenio_db import db
from invenio_deposit.api import Deposit, index, preserve
from invenio_deposit.utils import mark_as_action
from invenio_files_rest.errors import MultipartMissingParts
from invenio_files_rest.models import Bucket, FileInstance, ObjectVersion
from invenio_records.models import RecordMetadata
from invenio_records_files.models import RecordsBuckets
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound

from .errors import DepositValidationError, UpdateDepositPermissionsError
from .fetchers import cap_deposit_fetcher
from .minters import cap_deposit_minter
from .permissions import (AdminDepositPermission, CloneDepositPermission,
                          DepositAdminActionNeed, DepositReadActionNeed,
                          DepositUpdateActionNeed, UpdateDepositPermission)

_datastore = LocalProxy(lambda: current_app.extensions['security'].datastore)

current_jsonschemas = LocalProxy(
    lambda: current_app.extensions['invenio-jsonschemas']
)

PRESERVE_FIELDS = (
    '_deposit',
    '_buckets',
    '_files',
    '_experiment',
    '_access',
    '$schema'
)

DEPOSIT_ACTIONS = [
    'deposit-read',
    'deposit-update',
    'deposit-admin',
]


def DEPOSIT_ACTIONS_NEEDS(id):
    """Method to construct action needs."""
    return {
        'deposit-read': DepositReadActionNeed(str(id)),
        'deposit-update': DepositUpdateActionNeed(str(id)),
        'deposit-admin': DepositAdminActionNeed(str(id))
    }


EMPTY_ACCESS_OBJECT = {
    action: {'users': [], 'roles': []} for action in DEPOSIT_ACTIONS
}


class CAPDeposit(Deposit):
    """Define API for changing deposit state."""

    deposit_fetcher = staticmethod(cap_deposit_fetcher)

    deposit_minter = staticmethod(cap_deposit_minter)

#    def __init__(self, *args, **kwargs):
#        """Initialize CAPDeposit object."""
#        self.admin_permission_factory = check_oauth2_scope(
#            lambda record: AdminDepositPermission(self).can(),
#            write_scope.id
#        )
#
#        super(CAPDeposit, self).__init__(*args, **kwargs)

    def pop_from_data(method, fields=None):
        """Remove fields from deposit data.

        :param fields: List of fields to remove (default: ``('_deposit',)``).
        """
        fields = fields or ('_deposit', '_access', "$schema")

        @wraps(method)
        def wrapper(self, *args, **kwargs):
            """Check current deposit status."""
            for field in fields:
                if field in args[0]:
                    args[0].pop(field)

            return method(self, *args, **kwargs)
        return wrapper

    @property
    def schema(self):
        """Schema property."""
        return Schema.get_by_fullpath(self['$schema'])

    @property
    def record_schema(self):
        """Convert deposit schema to a valid record schema."""
        record_schema = self.schema.get_matching_record_schema()
        return record_schema.fullpath

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
        data = request.get_json()
        filename = self._construct_filename(data['url'],
                                            data['type'])
        if request:
            _, record = request.view_args.get('pid_value').data
            record_id = str(record.id)
            obj = ObjectVersion.create(
                bucket=record.files.bucket, key=filename
            )
            obj.file = FileInstance.create()
            record.files.flush()
            record.files[filename]['source_url'] = data['url']

            if data['type'] == 'url':
                download_url.delay(record_id, data['url'], filename)
            else:
                download_repo.delay(record_id, data['url'], filename)

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
            super(CAPDeposit, self).edit(*args, **kwargs)

    @pop_from_data
    def update(self, *args, **kwargs):
        """Update deposit."""
        with UpdateDepositPermission(self).require(403):
            super(CAPDeposit, self).update(*args, **kwargs)

    def patch(self, *args, **kwargs):
        """Patch deposit."""
        with UpdateDepositPermission(self).require(403):
            super(CAPDeposit, self).patch(*args, **kwargs)

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
                            self._add_user_permissions(user,
                                                       [obj['action']],
                                                       db.session)
                        except IntegrityError:
                            raise UpdateDepositPermissionsError(
                                'Permission already exist.')

                    elif obj['op'] == 'remove':
                        try:
                            self._remove_user_permissions(user,
                                                          [obj['action']],
                                                          db.session)
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
                            self._add_egroup_permissions(role,
                                                         [obj['action']],
                                                         db.session)
                        except IntegrityError:
                            raise UpdateDepositPermissionsError(
                                'Permission already exist.')
                    elif obj['op'] == 'remove':
                        try:
                            self._remove_egroup_permissions(role,
                                                            [obj['action']],
                                                            db.session)
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

    def _add_user_permissions(self,
                              user,
                              permissions,
                              session):
        """Adds permissions for user for this deposit."""
        for permission in permissions:
            session.add(
                ActionUsers.allow(
                    DEPOSIT_ACTIONS_NEEDS(self.id)[permission],
                    user=user
                )
            )

            session.flush()

            self['_access'][permission]['users'].append(user.id)

    def _remove_user_permissions(self,
                                 user,
                                 permissions,
                                 session):
        """Removes permissions for user for this deposit."""
        for permission in permissions:
            session.delete(
                ActionUsers.query.filter(
                    ActionUsers.action == permission,
                    ActionUsers.argument == str(self.id),
                    ActionUsers.user_id == user.id
                ).one()
            )
            session.flush()

            self['_access'][permission]['users'].remove(user.id)

    def _add_egroup_permissions(self,
                                egroup,
                                permissions,
                                session):
        for permission in permissions:
            session.add(
                ActionRoles.allow(
                    DEPOSIT_ACTIONS_NEEDS(self.id)[permission],
                    role=egroup
                )
            )
            session.flush()

            self['_access'][permission]['roles'].append(egroup.id)

    def _remove_egroup_permissions(self,
                                   egroup,
                                   permissions,
                                   session):
        for permission in permissions:
            session.delete(
                ActionRoles.query.filter(
                    ActionRoles.action == permission,
                    ActionRoles.argument == str(self.id),
                    ActionRoles.role_id == egroup.id
                ).one()
            )
            session.flush()

            self['_access'][permission]['roles'].remove(egroup.id)

    def _init_owner_permissions(self, owner=current_user):
        self['_access'] = deepcopy(EMPTY_ACCESS_OBJECT)

        if owner:
            with db.session.begin_nested():
                self._add_user_permissions(owner,
                                           DEPOSIT_ACTIONS,
                                           db.session)

            self['_deposit']['created_by'] = owner.id
            self['_deposit']['owners'] = [owner.id]

        self.commit()

    def _construct_filename(self, url, type):
        """Constructs repo name  or file name."""
        url = url.rstrip('/')
        filename = url.split('/')[-1] + '.tar.gz' \
            if type == 'repo' else url.split('/')[-1]
        return filename

    def _set_experiment(self):
        schema = Schema.get_by_fullpath(self['$schema'])
        self['_experiment'] = schema.experiment
        self.commit()

    def _create_buckets(self):
        bucket = Bucket.create()
        RecordsBuckets.create(record=self.model, bucket=bucket)

    @classmethod
    def get_record(cls, id_, with_deleted=False):
        """Get record instance."""
        deposit = super(CAPDeposit, cls).get_record(
            id_=id_, with_deleted=with_deleted)
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

        return deposit

    @classmethod
    def _preprocess_data(cls, data):

        # data can be sent without specifying particular version of schema,
        # but just with a type, e.g. cms-analysis
        # this be resolved to the last version of deposit schema of this type
        if '$ana_type' in data:
            try:
                schema = Schema.get_latest(
                    'deposits/records/{}'.format(data['$ana_type'])
                )
            except SchemaDoesNotExist:
                raise DepositValidationError(
                    'Schema {} is not a valid deposit schema.'
                    .format(data['$ana_type']))

            data['$schema'] = schema.fullpath
            data.pop('$ana_type')

        return data

    @classmethod
    def _validate_data(cls, data):
        if not isinstance(data, dict) or data == {}:
            raise DepositValidationError('Empty deposit data.')

        try:
            schema_fullpath = data['$schema']
        except KeyError:
            raise DepositValidationError('Schema not specified.')

        try:
            Schema.get_by_fullpath(schema_fullpath)
        except AttributeError:
            raise DepositValidationError('Schema {} is not a valid option.'
                                         .format(schema_fullpath))


@shared_task(max_retries=5)
def download_url(pid, url, filename):
    """Task for fetching external files/repos."""
    record = CAPDeposit.get_record(pid)
    size = None
    if url.startswith("root://"):
        from xrootdpyfs.xrdfile import XRootDPyFile
        response = XRootDPyFile(url, mode='r-')
        total = response.size
    else:
        try:
            if any(u in url for u in ['github', 'gitlab']):
                file = RepoImporter.create(url).archive_file(filename)
                url = file.get('url', None)
                size = file.get('size', None)
                token = file.get('token', None)
                headers = {'PRIVATE-TOKEN': token}
            response = requests.get(
                url, stream=True, headers=headers).raw
            response.decode_content = True
            total = size or int(
                response.headers.get('Content-Length'))
        except TypeError as exc:
            download_url.retry(exc=exc, countdown=10)
    task_commit(record, response, filename, total)


@shared_task(max_retries=5)
def download_repo(pid, url, filename):
    """Task for fetching external files/repos."""
    record = CAPDeposit.get_record(pid)
    try:
        link = RepoImporter.create(url).archive_repository()
        response = ensure_content_length(link)
        total = int(response.headers.get('Content-Length'))
    except TypeError as exc:
        download_repo.retry(exc=exc, countdown=10)
    task_commit(record, response.raw, filename, total)


def task_commit(record, response, filename, total):
    """Commits file to the record."""
    record.files[filename].file.set_contents(
        response,
        default_location=record.files.bucket.location.uri,
        size=total
    )
    db.session.commit()


def ensure_content_length(
        url, method='GET',
        session=None,
        max_size=FILES_URL_MAX_SIZE or 2**20,
        *args, **kwargs):
    """Adds Content-Length when no present."""
    kwargs['stream'] = True
    session = session or requests.Session()
    r = session.request(method, url, *args, **kwargs)
    if 'Content-Length' not in r.headers:
        # stream content into a temporary file so we can get the real size
        spool = tempfile.SpooledTemporaryFile(max_size)
        shutil.copyfileobj(r.raw, spool)
        r.headers['Content-Length'] = str(spool.tell())
        spool.seek(0)
        # replace the original socket with our temporary file
        r.raw._fp.close()
        r.raw._fp = spool
    return r
