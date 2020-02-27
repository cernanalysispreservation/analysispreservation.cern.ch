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
"""Models for schema templates."""

from datetime import datetime

from invenio_db import db
from invenio_search import current_search_client as es
from sqlalchemy import event
from sqlalchemy.orm import validates

from cap.types import json_type


class Template(db.Model):
    """Model defining analysis ES template mappings."""

    id = db.Column(db.Integer, primary_key=True)
    prefix = db.Column(db.String(128), unique=False, nullable=False)
    name = db.Column(db.String(128), unique=True, nullable=False)

    mapping = db.Column(json_type,
                        default=lambda: dict(),
                        nullable=False)

    created = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
    updated = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)

    __tablename__ = 'schemas_template'

    def __str__(self):
        """Stringify template object."""
        return f'Template: {self.name}'

    @validates('name')
    def validate_name(self, key, name):
        """Validate if name is ES compatible."""
        if any(x in r' ,"\<*>|?' for x in name):
            raise ValueError('Name cannot contain the following characters'
                             '[, ", *, \\, <, | , , , > , ?]')
        return name


@event.listens_for(Template, 'after_insert')
def after_insert_template(target, value, schema):
    """On template insert, create the corresponding ES template."""
    if not es.indices.exists_template(schema.name):
        es.indices.put_template(name=schema.name, body=schema.mapping)


@event.listens_for(Template, 'after_delete')
def before_delete_template(mapper, connect, schema):
    """On template delete, delete the template from ES."""
    if es.indices.exists_template(schema.name):
        es.indices.delete_template(schema.name)


@event.listens_for(Template, 'before_update', propagate=True)
def timestamp_before_update(mapper, connection, target):
    """Update `updated` property with current time on `before_update` event."""
    target.updated = datetime.utcnow()
