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

"""Receivers for Schemas module."""

from invenio_search import current_search_client as es
from invenio_search import current_search
from sqlalchemy import event

from .models import Schema


@event.listens_for(Schema, 'after_insert')
def after_insert_schema(target, value, schema):
    """On schema insert, create corresponding indexes and aliases in ES."""
    if schema.is_index_in_es and \
       not es.indices.exists(schema.index_name):

        # invenio search needs it
        current_search.mappings[schema.index_name] = {}

        es.indices.create(
            index=schema.index_name,
            body={"mappings": schema.mapping} if schema.mapping else {},
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
