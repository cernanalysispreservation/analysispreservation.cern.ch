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
"""Workflows db models."""

import uuid
from datetime import datetime

from invenio_accounts.models import User
from invenio_db import db
from invenio_records.models import RecordMetadata
from sqlalchemy_utils.types import UUIDType

from cap.types import json_type

from .serializers import reana_workflow_serializer


class ReanaWorkflow(db.Model):
    """Model defining a REANA workflow."""

    __tablename__ = 'reana_workflows'

    id = db.Column(UUIDType,
                   primary_key=True,
                   default=uuid.uuid4,
                   nullable=False)
    rec_uuid = db.Column(UUIDType,
                         db.ForeignKey(RecordMetadata.id),
                         nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    workflow_id = db.Column(UUIDType, unique=True, nullable=False)

    service = db.Column(db.Enum('reana', name='service'),
                        unique=False,
                        nullable=False)

    name = db.Column(db.String(100), unique=False, nullable=False)
    workflow_name = db.Column(db.String(100), unique=False, nullable=False)
    name_run = db.Column(db.String(100), unique=False, nullable=False)
    status = db.Column(db.Enum('created', 'queued', 'running',
                               'stopped', 'failed', 'deleted',
                               name='status'),
                       unique=False, nullable=False)

    # the following fields represent the creation part of a workflow
    workflow_json = db.Column(json_type, default=lambda: dict(), nullable=True)

    # logging after the workflow runs
    logs = db.Column(json_type, default=lambda: dict(), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship('User')
    record = db.relationship('RecordMetadata')

    @classmethod
    def get_user_workflows(cls, user_id):
        """Get user workflows."""
        workflows = cls.query \
            .filter_by(cap_user_id=user_id) \
            .all()

        return workflows

    @classmethod
    def get_deposit_workflows(cls, depid):
        """Get deposit workflows."""
        workflows = cls.query \
            .filter_by(rec_uuid=depid) \
            .all()

        return workflows

    @classmethod
    def get_workflow_by_id(cls, workflow_id):
        """Get workflow by id."""
        return cls.query \
            .filter_by(workflow_id=workflow_id) \
            .one_or_none()

    def serialize(self):
        """Serialize schema model."""
        return reana_workflow_serializer.dump(self).data
