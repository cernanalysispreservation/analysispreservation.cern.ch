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

import requests
from celery import shared_task
from flask import current_app, request
from werkzeug.local import LocalProxy

from flask_login import current_user
from cap.modules.repoimporter.repo_importer import RepoImporter
from invenio_access.models import ActionRoles, ActionUsers
from invenio_accounts.models import Role, User
from invenio_db import db
from invenio_deposit.api import Deposit, index, preserve
from invenio_deposit.utils import mark_as_action
from invenio_files_rest.errors import MultipartMissingParts
# from invenio_files_rest.errors import MultipartMissingParts
from invenio_files_rest.models import Bucket, FileInstance, ObjectVersion
from invenio_records.models import RecordMetadata
from invenio_records_files.models import RecordsBuckets

from .errors import EmptyDepositError, WrongJSONSchemaError
from .permissions import (DepositAdminActionNeed, DepositReadActionNeed,
                          DepositUpdateActionNeed)

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
    return {
        "deposit-read": DepositReadActionNeed(str(id)),
        "deposit-update": DepositUpdateActionNeed(str(id)),
        "deposit-admin": DepositAdminActionNeed(str(id))
    }


def add_owner_permissions(deposit):
    with db.session.begin_nested():
        access = set_user_permissions(
            current_user,
            [{"op": "add", "action": action}
             for action in DEPOSIT_ACTIONS],
            deposit,
            db.session,
            construct_access(),  # TOFIX : Need to pass access object to update user
            force=True
        )
    db.session.commit()
    return access


def set_user_permissions(user, permissions, deposit, session, access, force=False):
    _permissions = (p for p in permissions if p.get(
        "action", "") in DEPOSIT_ACTIONS)

    for permission in _permissions:

        if permission.get("op", "") == "add":
            if (not force and ActionUsers.query.filter_by(
                    action=permission['action'],
                    user_id=user.id,
                    argument=str(deposit.id)
            ).all()):
                return
            try:
                session.add(ActionUsers.allow(
                    DEPOSIT_ACTIONS_NEEDS(deposit.id).get(
                        permission.get("action", ""),
                        ""),
                    user=user
                ))
            except:
                return

            access.get(permission["action"], {}).get(
                'user', []).append(user.id)

        elif permission.get("op", "") == "remove":
            if (not force and not ActionUsers.query.filter_by(
                    action=permission['action'],
                    user_id=user.id,
                    argument=str(deposit.id)
            ).all()):
                return
            try:
                au = ActionUsers.query.filter(
                    ActionUsers.action == permission.get("action", ""),
                    ActionUsers.argument == str(deposit.id),
                    ActionUsers.user_id == user.id).first()
                if au:
                    session.delete(au)

            except:
                return

            access.get(permission["action"], {}).get(
                'user', []).remove(user.id)
    return access


def set_egroup_permissions(role, permissions, deposit, session, access):
    _permissions = (p for p in permissions if p.get(
        "action", "") in DEPOSIT_ACTIONS)

    for permission in _permissions:

        if permission.get("op", "") == "add":
            try:
                session.add(ActionRoles.allow(
                    DEPOSIT_ACTIONS_NEEDS(deposit.id).get(
                        permission.get("action", ""),
                        ""),
                    role=role
                ))
            except:
                return

            access.get(permission["action"], {}).get(
                'roles', []).append(role.id)

        elif permission.get("op", "") == "remove":
            try:
                au = ActionRoles.query.filter(
                    ActionRoles.action == permission.get("action", ""),
                    ActionRoles.argument == str(deposit.id),
                    ActionRoles.role_id == role.id).first()

                if au:
                    session.delete(au)

            except:
                return

            access.get(permission["action"], {}).get(
                'roles', []).remove(role.id)

    return access


def construct_access():
    access = {}
    for a in DEPOSIT_ACTIONS:
        access[a] = {"user": [], "roles": []}

    return access


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
    record.files[filename].file.set_contents(
        response,
        default_location=record.files.bucket.location.uri,
        size=total
    )
    db.session.commit()


class CAPDeposit(Deposit):
    """Define API for changing deposit state."""

    def is_published(self):
        """Check if deposit is published."""
        return self['_deposit'].get('pid') is not None

    def get_record_metadata(self):
        """Get Record Metadata instance for deposit."""
        return RecordMetadata.query.filter_by(id=self.id).one_or_none()

    @classmethod
    def get_record(cls, id_, with_deleted=False):
        """Get record instance."""
        deposit = super(CAPDeposit, cls).get_record(
            id_=id_, with_deleted=with_deleted)
        deposit['_files'] = deposit.files.dumps()
        return deposit

    @property
    def record_schema(self):
        """Convert deposit schema to a valid record schema."""
        schema_path = current_jsonschemas.url_to_path(
            self['$schema'])
        schema_prefix = current_app.config['DEPOSIT_JSONSCHEMAS_PREFIX']
        if schema_path and schema_path.startswith(schema_prefix):
            return current_jsonschemas.path_to_url(
                schema_path[len(schema_prefix):]
            )

    def build_deposit_schema(self, record):
        """Convert record schema to a valid deposit schema.
        :param record: The record used to build deposit schema.
        :returns: The absolute URL to the schema or `None`.
        """
        schema_path = current_jsonschemas.url_to_path(record['$schema'])
        schema_prefix = current_app.config['DEPOSIT_JSONSCHEMAS_PREFIX']
        if schema_path:
            return current_jsonschemas.path_to_url(
                schema_prefix + schema_path
            )

    def _constructFileName(self, url, type):
        """Constructs repo name  or file name."""
        filename = url.split('/')[-1] + '.tar.gz' \
            if type == 'repo' else url.split('/')[-1]
        return filename

    def commit(self, *args, **kwargs):
        """Synchronize files before commit."""
        self.files.flush()
        result = super(CAPDeposit, self).commit(*args, **kwargs)
        return result

    @classmethod
    def create(cls, data, id_=None):
        """Create a deposit.

        Adds bucket creation immediately on deposit creation.
        """
        if not isinstance(data, dict) or data == {}:
            raise EmptyDepositError()

        bucket = Bucket.create()

        avalaible_schemas = [x.get('schema').split('schemas/')[-1] for x in
                             current_app.config.get('DEPOSIT_GROUPS', {}).values()]

        try:
            schema = data.get("$schema", None) \
                .split('/schemas/', 1)[1]
        except (IndexError, AttributeError):
            raise WrongJSONSchemaError()

        if schema not in avalaible_schemas:
            raise WrongJSONSchemaError()

        if schema:
            _deposit_group = \
                next(
                    (depgroup
                     for dg, depgroup
                     in current_app.config.get('DEPOSIT_GROUPS').iteritems()
                     if schema in depgroup['schema']
                     ),
                    None
                )
            data["_experiment"] = _deposit_group.get(
                "experiment", "Unknown")

        deposit = super(CAPDeposit, cls).create(data, id_=id_)

        _access = add_owner_permissions(deposit)
        RecordsBuckets.create(record=deposit.model, bucket=bucket)
        if _access:
            deposit["_access"] = _access
            deposit.commit()
        return deposit

    @preserve(result=False, fields=PRESERVE_FIELDS)
    def clear(self, *args, **kwargs):
        """Clear only drafts."""
        super(CAPDeposit, self).clear(*args, **kwargs)

    @mark_as_action
    def permissions(self, pid=None):
        data = request.get_json()

        if self.get('_access') is None:
            _access = construct_access()
        else:
            _access = self.get('_access')

        with db.session.begin_nested():
            for identity in data.get("permissions", []):
                if identity.get("type") == "user":
                    user = User.query.filter(
                        User.email == identity.get("identity")).first()
                    if user:
                        _access = set_user_permissions(
                            user,
                            identity.get("permissions"),
                            self,
                            db.session,
                            _access
                        )
                elif identity.get("type") == "egroup":
                    role = Role.query.filter(
                        Role.name == identity.get("identity")).first()
                    if role:
                        _access = set_egroup_permissions(
                            role,
                            identity.get("permissions"),
                            self,
                            db.session,
                            _access
                        )
                    else:
                        role = _datastore.create_role(
                            name=identity.get("identity"))
                        _access = set_egroup_permissions(
                            role,
                            identity.get("permissions"),
                            self,
                            db.session,
                            _access
                        )
        if _access:
            db.session.commit()

            self["_access"] = _access
            self.commit()

        return self

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
        url_type = data['type']
        filename = self._constructFileName(data['url'], url_type)
        if request:
            _, record = request.view_args.get('pid_value').data
            record_id = str(record.id)
            obj = ObjectVersion.create(
                bucket=record.files.bucket, key=filename
            )
            obj.file = FileInstance.create()
            record.files.flush()
            record.files[filename]['source_url'] = data['url']

            if url_type == 'url':
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
