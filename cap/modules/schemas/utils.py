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

from itertools import groupby

from .models import Schema
from .permissions import ReadSchemaPermission


def _filter_by_read_access(schemas_list):
    """Return only schemas that user has read access to."""
    return [x for x in schemas_list if ReadSchemaPermission(x).can()]


def _filter_only_latest(schemas_list):
    """Return only latest version of schemas."""
    return [next(g) for k, g in groupby(schemas_list, lambda s: s.name)]


def get_schemas_for_user(latest=True):
    """Return all schemas current user has read access to."""
    schemas = Schema.query \
                    .order_by(
                        Schema.name,
                        Schema.major.desc(),
                        Schema.minor.desc(),
                        Schema.patch.desc()) \
                    .all()

    schemas = _filter_by_read_access(schemas)

    if latest:
        schemas = _filter_only_latest(schemas)

    return schemas


def get_indexed_schemas_for_user(latest=True):
    """Return all indexed schemas current user has read access to."""
    schemas = Schema.query \
                    .filter_by(is_indexed=True) \
                    .order_by(
                        Schema.name,
                        Schema.major.desc(),
                        Schema.minor.desc(),
                        Schema.patch.desc()) \
                    .all()

    schemas = _filter_by_read_access(schemas)

    if latest:
        schemas = _filter_only_latest(schemas)

    return schemas
