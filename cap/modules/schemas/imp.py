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
"""Methods for schemas module."""
from itertools import groupby

from invenio_access.models import ActionRoles, ActionUsers
from invenio_access.permissions import Permission
from invenio_cache import current_cache
from sqlalchemy.event import listen

from .models import Schema
from .permissions import (
    ReadSchemaPermission,
    deposit_schema_create_action,
    deposit_schema_read_action,
    record_schema_create_action,
    record_schema_read_action,
)


def _filter_only_latest(schemas_list):
    """Return only latest version of schemas."""
    return [next(g) for k, g in groupby(schemas_list, lambda s: s.name)]


@current_cache.memoize()
def get_mappings():
    """Implementation for mappings getter for invenio_search module."""
    mappings = {}
    schemas = Schema.query.filter_by(is_indexed=True).all()

    for schema in schemas:
        mappings[schema.deposit_index] = {}
        mappings[schema.record_index] = {}

    return mappings


def _filter_by_deposit_read_access(schemas_list):
    """Return only schemas that user has read access to."""
    return [
        x
        for x in schemas_list
        if Permission(deposit_schema_read_action(x.id)).can()
    ]


def _filter_by_deposit_create_access(schemas_list):
    """Return only schemas that user has create access to."""
    return [
        x
        for x in schemas_list
        if Permission(deposit_schema_create_action(x.id)).can()
    ]


def _filter_by_record_read_access(schemas_list):
    """Return only schemas that user has read access to."""
    return [
        x
        for x in schemas_list
        if Permission(record_schema_read_action(x.id)).can()
    ]


def _filter_by_record_create_access(schemas_list):
    """Return only schemas that user has create access to."""
    return [
        x
        for x in schemas_list
        if Permission(record_schema_create_action(x.id)).can()
    ]


@current_cache.memoize()
def get_cached_indexed_schemas_for_user_create(latest=True, user_id=None):
    """Return all indexed schemas current user has read access to."""
    schemas = get_indexed_schemas(latest=latest)
    schemas = _filter_by_deposit_create_access(schemas)
    return schemas


@current_cache.memoize()
def get_cached_indexed_schemas_for_user_read(latest=True, user_id=None):
    """Return all indexed schemas current user has read access to."""
    schemas = get_indexed_schemas(latest=latest)
    schemas = _filter_by_deposit_read_access(schemas)

    return schemas


@current_cache.memoize()
def get_cached_indexed_record_schemas_for_user_create(
    latest=True, user_id=None
):
    """Return all indexed schemas current user has read access to."""
    schemas = get_indexed_schemas(latest=latest)
    schemas = _filter_by_record_create_access(schemas)
    return schemas


@current_cache.memoize()
def get_cached_indexed_record_schemas_for_user_read(latest=True, user_id=None):
    """Return all indexed schemas current user has read access to."""
    schemas = get_indexed_schemas(latest=latest)
    schemas = _filter_by_record_read_access(schemas)

    return schemas


def get_indexed_schemas(latest=True):
    """Return all indexed schemas current user has read access to."""
    schemas = (
        Schema.query.filter_by(is_indexed=True)
        .order_by(
            Schema.name,
            Schema.major.desc(),
            Schema.minor.desc(),
            Schema.patch.desc(),
        )
        .all()
    )

    if latest:
        schemas = _filter_only_latest(schemas)

    return schemas


def _filter_by_read_access(schemas_list):
    """Return only schemas that user has read access to."""
    return [x for x in schemas_list if ReadSchemaPermission(x).can()]


def get_schemas_for_user(latest=True):
    """Return all schemas current user has read access to."""
    schemas = Schema.query.order_by(
        Schema.name,
        Schema.major.desc(),
        Schema.minor.desc(),
        Schema.patch.desc(),
    ).all()

    schemas = _filter_by_read_access(schemas)

    if latest:
        schemas = _filter_only_latest(schemas)

    return schemas


def get_indexed_schemas_for_user(latest=True):
    """Return all indexed schemas current user has read access to."""
    schemas = (
        Schema.query.filter_by(is_indexed=True)
        .order_by(
            Schema.name,
            Schema.major.desc(),
            Schema.minor.desc(),
            Schema.patch.desc(),
        )
        .all()
    )

    schemas = _filter_by_read_access(schemas)

    if latest:
        schemas = _filter_only_latest(schemas)

    return schemas


def clear_schema_access_cache(mapper, connection, target):
    if target.action.startswith("deposit-schema-") or target.action.startswith(
        "record-schema-"
    ):
        get_cached_indexed_schemas_for_user_create.delete_memoized()
        get_cached_indexed_schemas_for_user_read.delete_memoized()
        get_cached_indexed_record_schemas_for_user_create.delete_memoized()
        get_cached_indexed_record_schemas_for_user_read.delete_memoized()


listen(ActionUsers, "after_insert", clear_schema_access_cache)
listen(ActionUsers, "after_delete", clear_schema_access_cache)
listen(ActionUsers, "after_update", clear_schema_access_cache)

listen(ActionRoles, "after_insert", clear_schema_access_cache)
listen(ActionRoles, "after_delete", clear_schema_access_cache)
listen(ActionRoles, "after_update", clear_schema_access_cache)
