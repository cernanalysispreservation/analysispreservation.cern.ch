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

"""Utils for Schemas module."""

from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound

from .models import Schema
from .permissions import ReadSchemaPermission


def add_schema_from_fixture(data=None):
    """Add or update schema."""
    allow_all = data.pop("allow_all", False)
    name = data['name']

    try:
        schema = Schema.get(name=data['name'], version=data['version'])
        print('{} already exist.'.format(name))

    except JSONSchemaNotFound:
        schema = Schema(**data)
        db.session.add(schema)

        print('{} added.'.format(name))

    db.session.commit()

    if allow_all:
        schema.add_read_access_for_all_users()


def get_schemas_for_user():
    """Return all indexed schemas current user has read access to."""
    schemas = Schema.query.filter_by(is_indexed=True).all()

    return [x for x in schemas if ReadSchemaPermission(x).can()]
