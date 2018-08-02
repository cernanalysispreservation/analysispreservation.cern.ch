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

"""Models for Reana."""

import uuid

from invenio_accounts.models import User
from invenio_db import db
from invenio_records.models import RecordMetadata
from sqlalchemy.dialects import postgresql
from sqlalchemy_utils.types import JSONType, UUIDType


class ReanaJob(db.Model):
    """Model defining REANA job."""

    __tablename__ = 'reana'

    id = db.Column(UUIDType,
                   primary_key=True,
                   nullable=False,
                   default=uuid.uuid4)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey(User.id),
        nullable=False,
    )

    record_id = db.Column(
        UUIDType,
        db.ForeignKey(RecordMetadata.id),
        nullable=False,
    )

    name = db.Column(db.String(100), unique=False, nullable=False)

    params = db.Column(
        JSONType().with_variant(
            postgresql.JSONB(none_as_null=True),
            'postgresql',
        ).with_variant(
            JSONType(),
            'sqlite',
        ),
        default=lambda: dict(),
        nullable=True
    )

    output = db.Column(
        JSONType().with_variant(
            postgresql.JSONB(none_as_null=True),
            'postgresql',
        ).with_variant(
            JSONType(),
            'sqlite',
        ),
        default=lambda: dict(),
        nullable=True
    )

    user = db.relationship('User')
    record = db.relationship('RecordMetadata')

    @classmethod
    def get_jobs(cls, user_id, record_id):
        """Return all the jobs run by user for this record."""
        return cls.query.filter_by(user_id=user_id,
                                   record_id=record_id).all()
