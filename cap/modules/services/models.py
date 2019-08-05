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

"""Models for Status Checks."""

import uuid
from datetime import datetime, timedelta

from invenio_db import db
from sqlalchemy.dialects import postgresql
from sqlalchemy_utils.types import JSONType, UUIDType


class StatusCheck(db.Model):
    """Model defining the Status table for services."""

    __tablename__ = 'status_checks'

    id = db.Column(UUIDType,
                   primary_key=True,
                   unique=True,
                   nullable=False,
                   default=uuid.uuid4)

    created_date = db.Column(db.DateTime,
                             nullable=False,
                             default=datetime.utcnow)

    service = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(10), nullable=False)

    message = db.Column(
        JSONType().with_variant(
            postgresql.JSONB(none_as_null=True),
            'postgresql',
        ).with_variant(
            JSONType(),
            'sqlite',
        ),
        default=None,
        nullable=True
    )

    @classmethod
    def truncate_table_older_than(cls, days_to_delete=1):
        """Truncates the status check table since a certain date."""
        date = datetime.today() - timedelta(days=days_to_delete)
        cls.query.filter(cls.created_date <= date).delete()
        db.session.commit()
