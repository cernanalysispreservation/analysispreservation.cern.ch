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

from invenio_accounts.models import User
from invenio_db import db
from invenio_records.models import RecordMetadata
from sqlalchemy_utils.types import UUIDType

from cap.types import json_type


class ReanaWorkflow(db.Model):
    """Model defining a REANA workflow."""

    __tablename__ = 'reana_workflows'

    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4,
                   nullable=False)
    rec_uuid = db.Column(UUIDType, db.ForeignKey(RecordMetadata.id),
                         nullable=False)

    cap_user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    workflow_id = db.Column(UUIDType, unique=True, nullable=False)

    name = db.Column(db.String(100), unique=False, nullable=False)
    name_run = db.Column(db.String(100), unique=False, nullable=False)
    status = db.Column(db.String(100), unique=False, nullable=False)

    # the following fields represent the creation part of a workflow
    engine = db.Column(db.Enum('yadage', 'cwl', 'serial', name='engine'),
                       unique=False, nullable=False)

    specification = db.Column(
        json_type,
        default=lambda: dict(),
        nullable=True
    )

    inputs = db.Column(
        json_type,
        default=lambda: dict(),
        nullable=True
    )

    outputs = db.Column(
        json_type,
        default=lambda: dict(),
        nullable=True
    )

    # logging after the workflow runs
    logs = db.Column(
        json_type,
        default=lambda: dict(),
        nullable=True
    )

    user = db.relationship('User')
    record = db.relationship('RecordMetadata')
