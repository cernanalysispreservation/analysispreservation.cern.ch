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

from invenio_search import current_search, current_search_client as es

from .permissions import ReadSchemaPermission


ES_FORBIDDEN = r' ,"\<*>|?'


def _filter_by_read_access(schemas_list):
    """Return only schemas that user has read access to."""
    return [x for x in schemas_list if ReadSchemaPermission(x).can()]


def _filter_only_latest(schemas_list):
    """Return only latest version of schemas."""
    return [next(g) for k, g in groupby(schemas_list, lambda s: s.name)]


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

        es.indices.create(index=index_name, body=mapping_body, ignore=False)
        for alias in aliases:
            es.indices.update_aliases(
                {'actions': [{
                    'add': {
                        'index': index_name,
                        'alias': alias
                    }
                }]})
