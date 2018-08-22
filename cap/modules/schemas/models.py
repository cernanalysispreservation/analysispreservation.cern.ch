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

"""Models for JSONschemas."""

import re

from invenio_db import db
from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy_utils.types import JSONType

from .errors import SchemaDoesNotExist


class Schema(db.Model):
    """Model defining analysis JSON schemas."""

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(128), unique=False, nullable=False)

    experiment = db.Column(db.String(128), unique=False, nullable=True)

    permission = db.Column(db.String(128), unique=False, nullable=True)

    # version
    major = db.Column(db.Integer, unique=False, nullable=False)
    minor = db.Column(db.Integer, unique=False, nullable=False)
    patch = db.Column(db.Integer, unique=False, nullable=False)

    json = db.Column(
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

    __tablename__ = 'schema'
    __table_args__ = (UniqueConstraint('name', 'major', 'minor', 'patch',
                                       name='unique_schema_version'),)

    @property
    def version(self):
        """Return stringified version."""
        return "{}.{}.{}".format(self.major, self.minor, self.patch)

    @classmethod
    def get_latest(cls, name):
        """Get the latest version of schema with given name."""
        try:
            return cls.query \
                .filter_by(name=name) \
                .order_by(cls.major.desc(),
                          cls.minor.desc(),
                          cls.patch.desc())\
                .first()
        except NoResultFound:
            raise SchemaDoesNotExist

    @classmethod
    def get_by_fullstring(cls, string):
        """Get schema by fullstring, e.g. record/schema-v0.0.1.json."""
        regex = re.compile('/?(?P<name>\S+)'
                           '-v(?P<major>\d+).'
                           '(?P<minor>\d+).'
                           '(?P<patch>\d+)'
                           '(?:.json)?')
        name, major, minor, patch = re.search(regex, string).groups()

        try:
            return cls.query \
                .filter_by(name=name,
                           major=major,
                           minor=minor,
                           patch=patch)\
                .one()
        except NoResultFound:
            raise SchemaDoesNotExist
