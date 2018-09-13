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
import re
from copy import deepcopy

import requests
from celery import shared_task
from flask import current_app, request
from flask_login import current_user
from invenio_access.models import ActionRoles, ActionUsers
from invenio_accounts.models import Role, User
from invenio_db import db
from invenio_deposit.api import Deposit, index, preserve
from invenio_deposit.scopes import write_scope
from invenio_deposit.utils import check_oauth2_scope, mark_as_action
from invenio_files_rest.errors import MultipartMissingParts
from invenio_files_rest.models import Bucket, FileInstance, ObjectVersion
from invenio_records.models import RecordMetadata
from invenio_records_files.models import RecordsBuckets
from invenio_records_rest.views import need_record_permission
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.local import LocalProxy

from cap.modules.repoimporter.repo_importer import RepoImporter
from cap.modules.schemas.models import Schema

from .errors import DepositValidationError, UpdateDepositPermissionsError
from .fetchers import cap_deposit_fetcher
from .minters import cap_deposit_minter
from .permissions import (AdminDepositPermission, DepositAdminActionNeed,
                          DepositReadActionNeed, DepositUpdateActionNeed)

_datastore = LocalProxy(lambda: current_app.extensions['security'].datastore)

current_jsonschemas = LocalProxy(
    lambda: current_app.extensions['invenio-jsonschemas']
)

PRESERVE_FIELDS = (
    '_deposit',
    '_buckets',
    '_files',
    '_experiment',
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

    @property
    def schema(self):
        """Schema property."""
        return re.search('schemas/(.*)', self['$schema']).group(1)

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
        data = request.get_json()

        return self.edit_permissions(data)

    @mark_as_action
    def publish(self, *args, **kwargs):
        """Simple file check before publishing."""
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
                        user = User.query.filter_by(email=obj['email']).one()
                    except NoResultFound:
                        raise UpdateDepositPermissionsError(
                            'User with this mail does not exist.')

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
                        role = Role.query.filter_by(name=obj['email']).one()
                    except NoResultFound:
                        raise UpdateDepositPermissionsError(
                            'Egroup with this mail does not exist.')

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
        filename = url.split('/')[-1] + '.tar.gz' \
            if type == 'repo' else url.split('/')[-1]
        return filename

    def _set_experiment(self):
        schema = Schema.get_by_fullstring(self['$schema'])
        self['_experiment'] = schema.experiment or 'None'
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
        cls._validate_data(data)

        deposit = super(CAPDeposit, cls).create(data, id_=id_)
        deposit._create_buckets()
        deposit._set_experiment()
        deposit._init_owner_permissions(owner)

        return deposit

    @classmethod
    def _validate_data(cls, data):
        if not isinstance(data, dict) or data == {}:
            raise DepositValidationError('Empty deposit data.')

        try:
            schema_fullstring = data['$schema']
        except KeyError:
            raise DepositValidationError('Schema not specified.')

        try:
            Schema.get_by_fullstring(schema_fullstring)
        except AttributeError:
            raise DepositValidationError('Schema {} is not a valid option.'
                                         .format(schema_fullstring))


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
                url, size = RepoImporter.create(url).archive_file(filename)
            response = requests.get(url, stream=True).raw
            response.decode_content = True
            total = size or int(response.headers.get('Content-Length'))
        except TypeError as exc:
            download_url.retry(exc=exc, countdown=10)
    task_commit(record, response, filename, total)


@shared_task(max_retries=5)
def download_repo(pid, url, filename):
    """Task for fetching external files/repos."""
    record = CAPDeposit.get_record(pid)
    try:
        link = RepoImporter.create(url).archive_repository()
        response = requests.get(link, stream=True).raw
        total = int(response.headers.get('Content-Length'))
    except TypeError as exc:
        download_repo.retry(exc=exc, countdown=10)
    task_commit(record, response, filename, total)


def task_commit(record, response, filename, total):
    """Commits file to the record."""
    record.files[filename].file.set_contents(
        response,
        default_location=record.files.bucket.location.uri,
        size=total
    )
    db.session.commit()
