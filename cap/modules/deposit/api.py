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

from flask import current_app, request
from flask_login import current_user
from invenio_deposit.api import Deposit, index, preserve
from invenio_deposit.utils import mark_as_action
from invenio_files_rest.models import Bucket, Location
from invenio_records_files.models import RecordsBuckets

from invenio_access.models import ActionRoles, ActionUsers
from invenio_accounts.models import Role, User
from invenio_db import db

from werkzeug.local import LocalProxy

from .permissions import (DepositReadActionNeed,
                          DepositUpdateActionNeed,
                          DepositAdminActionNeed)


_datastore = LocalProxy(lambda: current_app.extensions['security'].datastore)

current_jsonschemas = LocalProxy(
    lambda: current_app.extensions['invenio-jsonschemas']
)

PRESERVE_FIELDS = (
    '_deposit',
    '_buckets',
    '_files',
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


def add_owner_permissions(uuid):
    with db.session.begin_nested():
        set_user_permissions(
            current_user,
            [{"op": "add", "action": action}
                for action in DEPOSIT_ACTIONS],
            uuid,
            db.session,
            {}  # TOFIX : Need to pass access object to update user
        )
    db.session.commit()


def set_user_permissions(user, permissions, id, session, access):
    _permissions = (p for p in permissions if p.get(
        "action", "") in DEPOSIT_ACTIONS)

    for permission in _permissions:

        if (permission.get("op", "") == "add"):
            try:
                session.add(ActionUsers.allow(
                    DEPOSIT_ACTIONS_NEEDS(id).get(
                        permission.get("action", ""),
                        ""),
                    user=user
                ))
            except:
                return

            access.get(permission["action"], {}).get(
                'user', []).append(user.id)

        elif (permission.get("op", "") == "remove"):
            try:
                au = ActionUsers.query.filter(
                    ActionUsers.action == permission.get("action", ""),
                    ActionUsers.argument == str(id),
                    ActionUsers.user_id == user.id).first()

                if au:
                    session.delete(au)

            except:
                return

            access.get(permission["action"], {}).get(
                'user', []).remove(user.id)

    return access


def set_egroup_permissions(role, permissions, id, session, access):
    _permissions = (p for p in permissions if p.get(
        "action", "") in DEPOSIT_ACTIONS)

    for permission in _permissions:

        if (permission.get("op", "") == "add"):
            try:
                session.add(ActionRoles.allow(
                    DEPOSIT_ACTIONS_NEEDS(id).get(
                        permission.get("action", ""),
                        ""),
                    role=role
                ))
            except:
                return

            access.get(permission["action"], {}).get(
                'roles', []).append(role.id)

        elif (permission.get("op", "") == "remove"):
            try:
                au = ActionRoles.query.filter(
                    ActionRoles.action == permission.get("action", ""),
                    ActionRoles.argument == str(id),
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


class CAPDeposit(Deposit):
    """Define API for changing deposit state."""

    def is_published(self):
        """Check if deposit is published."""
        return self['_deposit'].get('pid') is not None

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
            self['$schema'].replace('/app/schemas', '/schemas'))
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
            ).replace('/schemas/', '/app/schemas/')

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
        bucket = Bucket.create(
            default_location=Location.get_default()
        )
        deposit = super(CAPDeposit, cls).create(data, id_=id_)

        add_owner_permissions(deposit.id)
        RecordsBuckets.create(record=deposit.model, bucket=bucket)
        return deposit

    @preserve(result=False, fields=PRESERVE_FIELDS)
    def clear(self, *args, **kwargs):
        """Clear only drafts."""
        super(CAPDeposit, self).clear(*args, **kwargs)

    @mark_as_action
    def permissions(self, pid=None):
        data = request.get_json()

        if self.get('_access', None) is None:
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
                            self.id,
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
                            self.id,
                            db.session,
                            _access
                        )
                    else:
                        role = _datastore.create_role(
                            name=identity.get("identity"))
                        _access = set_egroup_permissions(
                            role,
                            identity.get("permissions"),
                            self.id,
                            db.session,
                            _access
                        )

        db.session.commit()

        self["_access"] = _access
        self.commit()

        return self

    @index
    @mark_as_action
    def clone(self, pid=None, id_=None):
        """Clone a deposit.

        Adds snapshot of the files when deposit is cloned.
        """
        data = copy.deepcopy(self.dumps())
        del data['_deposit']
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
