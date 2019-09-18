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

from invenio_access.models import ActionRoles, ActionUsers
from invenio_accounts.models import Role, User
from invenio_db import db
from invenio_records.models import RecordMetadata
from invenio_records_files.api import Record
from sqlalchemy.orm.exc import NoResultFound

from cap.modules.experiments.permissions import exp_need_factory

from .permissions import (RecordAdminActionNeed, RecordReadActionNeed,
                          RecordUpdateActionNeed)

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
                db.session.add(
                    ActionRoles.allow(
                        RECORD_ACTION_NEEDS(id_)[action],
                        role=role
                    )
                )
            for user in permission['users']:
                user = User.query.filter_by(id=user).one()
                db.session.add(
                    ActionUsers.allow(
                        RECORD_ACTION_NEEDS(id_)[action],
                        user=user
                    )
                )

    @classmethod
    def _add_experiment_permissions(cls, data, id_):
        """Add read permissions to everybody assigned to experiment."""
        exp_need = exp_need_factory(data['_experiment'])

        # give read access to members of collaboration
        for au in ActionUsers.query_by_action(exp_need).all():
            try:
                ActionUsers.query_by_action(
                    RECORD_ACTION_NEEDS(id_)['record-read']
                ).filter_by(user=au.user).one()
            except NoResultFound:
                db.session.add(
                    ActionUsers.allow(
                        RECORD_ACTION_NEEDS(id_)['record-read'],
                        user=au.user
                    )
                )
                data['_access']['record-read']['users'].append(au.user.id)

        for ar in ActionRoles.query_by_action(exp_need).all():
            try:
                ActionRoles.query_by_action(
                    RECORD_ACTION_NEEDS(id_)['record-read']
                ).filter_by(role=ar.role).one()
            except NoResultFound:
                db.session.add(
                    ActionRoles.allow(
                        RECORD_ACTION_NEEDS(id_)['record-read'],
                        role=ar.role
                    )
                )
                data['_access']['record-read']['roles'].append(ar.role.id)
