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
"""Models for schemas."""

import re
from datetime import datetime

from flask import current_app
from invenio_access.models import ActionSystemRoles, ActionUsers
from invenio_access.permissions import authenticated_user
from invenio_cache import current_cache
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound
from six.moves.urllib.parse import urljoin
from sqlalchemy import UniqueConstraint, event
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import validates
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.utils import import_string

from cap.types import json_type
from invenio_search import current_search
from invenio_search import current_search_client as es

from .permissions import SchemaAdminAction, SchemaReadAction
from .serializers import schema_serializer

ES_FORBIDDEN = r' ,"\<*>|?'


class Schema(db.Model):
    """Model defining analysis JSON schemas."""

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(128), unique=False, nullable=False)
    fullname = db.Column(db.String(128), unique=False, nullable=True)

    # version
    major = db.Column(db.Integer, unique=False, nullable=False, default=1)
    minor = db.Column(db.Integer, unique=False, nullable=False, default=0)
    patch = db.Column(db.Integer, unique=False, nullable=False, default=0)

    experiment = db.Column(db.String(128), unique=False, nullable=True)

    deposit_schema = db.Column(json_type,
                               default=lambda: dict(),
                               nullable=True)

    deposit_options = db.Column(json_type,
                                default=lambda: dict(),
                                nullable=True)

    deposit_mapping = db.Column(json_type,
                                default=lambda: dict(),
                                nullable=True)

    record_schema = db.Column(json_type, default=lambda: dict(), nullable=True)

    record_options = db.Column(json_type,
                               default=lambda: dict(),
                               nullable=True)

    record_mapping = db.Column(json_type,
                               default=lambda: dict(),
                               nullable=True)

    use_deposit_as_record = db.Column(db.Boolean(create_constraint=False),
                                      unique=False,
                                      default=False)
    is_indexed = db.Column(db.Boolean(create_constraint=False),
                           unique=False,
                           default=False)

    created = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
    updated = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)

    __tablename__ = 'schema'
    __table_args__ = (UniqueConstraint('name',
                                       'major',
                                       'minor',
                                       'patch',
                                       name='unique_schema_version'), )

    def __init__(self, *args, **kwargs):
        """Possible to set version from string."""
        version = kwargs.pop('version', None)
        if version:
            self.version = version

        super(Schema, self).__init__(*args, **kwargs)

    def serialize(self):
        """Serialize schema model."""
        return schema_serializer.dump(self).data

    def __str__(self):
        """Stringify schema object."""
        return '{name}-v{version}'.format(name=self.name, version=self.version)

    @validates('name')
    def validate_name(self, key, name):
        """Validate if name is ES compatible."""
        if any(x in ES_FORBIDDEN for x in name):
            raise ValueError('Name cannot contain the following characters'
                             '[, ", *, \\, <, | , , , > , ?]')
        return name

    @property
    def version(self):
        """Return stringified version."""
        return "{0}.{1}.{2}".format(self.major, self.minor, self.patch)

    @version.setter
    def version(self, string):
        """Set version."""
        matched = re.match(r"(\d+).(\d+).(\d+)", string)
        if matched is None:
            raise ValueError(
                'Version has to be passed as string <major>.<minor>.<patch>')

        self.major, self.minor, self.patch = matched.groups()

    @property
    def deposit_path(self):
        """Return deposit schema path."""
        prefix = current_app.config['SCHEMAS_DEPOSIT_PREFIX']
        path = urljoin(prefix, "{0}.json".format(self))
        return path

    @property
    def record_path(self):
        """Return record schema path."""
        prefix = current_app.config['SCHEMAS_RECORD_PREFIX']
        path = urljoin(prefix, "{0}.json".format(self))
        return path

    @property
    def deposit_index(self):
        """Get deposit index name."""
        path = urljoin(current_app.config['SCHEMAS_DEPOSIT_PREFIX'], str(self))
        return name_to_es_name(path)

    @property
    def record_index(self):
        """Get record index name."""
        path = urljoin(current_app.config['SCHEMAS_RECORD_PREFIX'], str(self))
        return name_to_es_name(path)

    @property
    def deposit_aliases(self):
        """Get ES deposits aliases."""
        name = name_to_es_name(self.name)
        return ['deposits', 'deposits-records', 'deposits-{}'.format(name)]

    @property
    def record_aliases(self):
        """Get ES records aliases."""
        name = name_to_es_name(self.name)
        return ['records', 'records-{}'.format(name)]

    def update(self, **kwargs):
        """Update schema instance."""
        Schema.query.filter_by(id=self.id).update(kwargs)
        db.session.commit()

        return self

    def add_read_access_for_all_users(self):
        """Give read access to all authenticated users."""
        assert self.id

        try:
            db.session.add(
                ActionSystemRoles.allow(SchemaReadAction(self.id),
                                        role=authenticated_user))
            db.session.flush()
        except IntegrityError:
            db.session.rollback()

    def give_admin_access_for_user(self, user):
        """Give admin access for users."""
        try:
            db.session.add(
                ActionUsers.allow(SchemaAdminAction(self.id), user=user))
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
                      cls.patch.desc()) \
            .first()

        if latest:
            return latest
        else:
            raise JSONSchemaNotFound(schema=name)

    @classmethod
    def get(cls, name, version):
        """Get schema by name and version."""
        matched = re.match(r"(\d+).(\d+).(\d+)", version)
        if matched is None:
            raise ValueError(
                'Version has to be passed as string <major>.<minor>.<patch>')

        major, minor, patch = matched.groups()

        try:
            schema = cls.query \
                .filter_by(name=name, major=major, minor=minor, patch=patch) \
                .one()

        except NoResultFound:
            raise JSONSchemaNotFound("{}-v{}".format(name, version))

        return schema


def name_to_es_name(name):
    r"""Translate name to ES compatible name.

    Replace '/' with '-'.
    [, ", *, \\, <, | , , , > , ?] are forbidden.
    """
    if any(x in ES_FORBIDDEN for x in name):
        raise AssertionError('Name cannot contain the following characters'
                             '[, ", *, \\, <, | , , , > , ?]')

    return name.replace('/', '-')


def create_index(index_name, mapping_body, aliases):
    """Create index in elasticsearch, add under given aliases."""
    if not es.indices.exists(index_name):
        current_search.mappings[index_name] = {}  # invenio search needs it

        es.indices.create(index=index_name,
                          body={'mappings': mapping_body},
                          ignore=False)

        for alias in aliases:
            es.indices.update_aliases(
                {'actions': [{
                    'add': {
                        'index': index_name,
                        'alias': alias
                    }
                }]})


@event.listens_for(Schema, 'after_insert')
def after_insert_schema(target, value, schema):
    """On schema insert, create corresponding indexes and aliases in ES."""
    if schema.is_indexed:
        create_index(schema.deposit_index, schema.deposit_mapping,
                     schema.deposit_aliases)
        create_index(schema.record_index, schema.record_mapping,
                     schema.record_aliases)

        # invenio search needs it
        mappings_imp = current_app.config.get('SEARCH_GET_MAPPINGS_IMP')
        current_cache.delete_memoized(import_string(mappings_imp))


@event.listens_for(Schema, 'after_delete')
def before_delete_schema(mapper, connect, schema):
    """On schema delete, delete corresponding indexes and aliases in ES."""
    if schema.is_indexed:
        for index in (schema.record_index, schema.deposit_index):
            if es.indices.exists(index):
                es.indices.delete(index)

            # invenio search needs it
            mappings_imp = current_app.config.get('SEARCH_GET_MAPPINGS_IMP')
            current_cache.delete_memoized(import_string(mappings_imp))


@db.event.listens_for(Schema, 'before_update', propagate=True)
def timestamp_before_update(mapper, connection, target):
    """Update `updated` property with current time on `before_update` event."""
    target.updated = datetime.utcnow()
