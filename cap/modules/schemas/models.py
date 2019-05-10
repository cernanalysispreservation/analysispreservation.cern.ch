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

from flask import current_app
from invenio_access.models import ActionSystemRoles
from invenio_access.permissions import authenticated_user
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound
from invenio_search import current_search
from invenio_search import current_search_client as es
from sqlalchemy import UniqueConstraint, event
from sqlalchemy.dialects import postgresql
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy_utils.types import JSONType

from .permissions import ReadSchemaPermission, SchemaReadAction


class Schema(db.Model):
    """Model defining analysis JSON schemas."""

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(128), unique=False, nullable=False)
    fullname = db.Column(db.String(128), unique=False, nullable=True)

    # version
    major = db.Column(db.Integer, unique=False, nullable=False, default=0)
    minor = db.Column(db.Integer, unique=False, nullable=False, default=0)
    patch = db.Column(db.Integer, unique=False, nullable=False, default=0)

    experiment = db.Column(db.String(128), unique=False, nullable=True)

    is_deposit = db.Column(db.Boolean(create_constraint=False),
                           unique=False,
                           default=False)

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

    def __init__(self, fullpath=None, **kwargs):
        """."""
        if fullpath:
            self.name, self.major, self.minor, self.patch = \
                self._parse_fullpath(fullpath)

        super(Schema, self).__init__(**kwargs)

    @property
    def version(self):
        """Return stringified version."""
        return "{}.{}.{}".format(self.major, self.minor, self.patch)

    @property
    def is_record(self):
        """Return stringified version."""
        return self.name.startswith('records')

    @property
    def fullpath(self):
        """Return full path eg. https://host.com/schemas/schema-v0.0.1.json."""
        host = current_app.config['JSONSCHEMAS_HOST']
        return "https://{}/schemas/{}-v{}.json".format(
            host, self.name, self.version)

    @property
    def index_name(self):
        """Get index name."""
        return "{}-v{}".format(self.name.replace('/', '-'), self.version)

    @property
    def aliases(self):
        """Get ES aliases names."""
        aliases = []
        if self.is_deposit:
            aliases = ['deposits', 'deposits-records']
        elif self.is_record:
            aliases = ['records']
        return aliases

    def get_matching_record_schema(self):
        """For given deposit schema, get record one."""
        name = self.name.replace('deposits/', '')
        try:
            return Schema.query \
                .filter_by(name=name,
                           major=self.major,
                           minor=self.minor,
                           patch=self.patch)\
                .one()
        except NoResultFound:
            raise JSONSchemaNotFound(schema=name)

    def add_read_access_to_all(self):
        """Give read access to all authenticated users."""
        try:
            db.session.add(
                ActionSystemRoles.allow(
                    SchemaReadAction(self.id),
                    role=authenticated_user
                )
            )
            db.session.flush()
        except IntegrityError:
            db.session.rollback()

    @classmethod
    def get_latest(cls, name):
        """Get the latest version of schema with given name."""
        latest = cls.query \
            .filter_by(name=name) \
            .order_by(cls.major.desc(),
                      cls.minor.desc(),
                      cls.patch.desc())\
            .first()

        if latest:
            return latest
        else:
            raise JSONSchemaNotFound(schema=name)

    @classmethod
    def get_by_fullpath(cls, string):
        """Get schema by full path, e.g. record/schema-v0.0.1.json."""
        name, major, minor, patch = cls._parse_fullpath(string)
        try:
            return cls.query \
                .filter_by(name=name,
                           major=major,
                           minor=minor,
                           patch=patch)\
                .one()
        except NoResultFound:
            raise JSONSchemaNotFound(schema=name)

    @classmethod
    def get_user_deposit_schemas(cls):
        """Return all deposit schemas user has read access to."""
        schemas = cls.query.filter_by(is_deposit=True).all()

        return [x for x in schemas if ReadSchemaPermission(x).can()]

    @staticmethod
    def _parse_fullpath(string):
        try:
            regex = re.compile('(?:.*/schemas/)?'
                               '/?(?P<name>\S+)'
                               '-v(?P<major>\d+).'
                               '(?P<minor>\d+).'
                               '(?P<patch>\d+)'
                               '(?:.json)?')
            return re.search(regex, string).groups()
        except AttributeError:
            raise JSONSchemaNotFound(schema=string)


@event.listens_for(Schema, 'after_insert')
def after_insert_schema(target, value, schema):
    """On schema insert, create corresponding indexes and aliases in ES."""
    if (schema.is_deposit or schema.is_record) and \
            not es.indices.exists(schema.index_name):

        # invenio search needs it
        current_search.mappings[schema.index_name] = {}

        es.indices.create(
            index=schema.index_name,
            body={},
            ignore=False
        )

        for alias in schema.aliases:
            es.indices.update_aliases({
                "actions": [
                    {"add": {
                        "index": schema.index_name,
                        "alias": alias
                    }}
                ]
            })


@event.listens_for(Schema, 'after_delete')
def before_delete_schema(mapper, connect, target):
    """On schema delete, delete corresponding indexes and aliases in ES."""
    if es.indices.exists(target.index_name):
        es.indices.delete(target.index_name)

    # invenio search needs it
    current_search.mappings.pop(target.index_name)
