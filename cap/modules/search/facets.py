# -*- coding: utf-8 -*-
#
# This file is part of CERN Open Data Portal.
# Copyright (C) 2017 CERN.
#
# CERN Open Data Portal is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Open Data Portal is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Open Data Portal; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""CAP facets factory for REST API."""

from __future__ import absolute_import, print_function

from elasticsearch_dsl import Q
from flask import current_app
from werkzeug.datastructures import MultiDict

from invenio_records_rest.facets import (_create_filter_dsl, _post_filter,
                                         _query_filter)


def nested_filter(path, field):
    """Create a nested filter.
    :param path:  Path to nested object.
    :param field: Field name.
    :returns: Function that returns Nested query.
    """
    def inner(values):
        return Q('nested', path=path, ignore_unmapped=True,
                 query=Q('terms', **{field: values}))
    return inner


def _aggregations(search, definitions, urlkwargs, filters):
    """Add aggregations to query."""

    def without(d, keys):
        """Remove keys from dict."""
        new_d = d.copy()
        for key in keys:
            if key in new_d:
                new_d.pop(key)
        return new_d

    def get_facets_names(name, aggs):
        """Get facet names with the nested ones (only prefixed with facet_)."""
        if name.startswith('facet_'):
            names = [name.replace('facet_', '')]
        else:
            names = []

        if 'aggs' in aggs[name]:
            aggs = aggs[name]['aggs']
            for key in aggs.keys():
                if key.startswith('facet_'):
                    names.extend(get_facets_names(key, aggs))
                             
        return names

    if definitions:
        for name, agg in definitions.items():

            # get nested aggs names
            facets = get_facets_names(name, definitions)

            # collect filters except for aggs or nested aggs ones
            _filters, _ = _create_filter_dsl(urlkwargs,
                                             without(filters, facets))
            if _filters:
                agg = {
                    'filter': {
                        'bool': {
                            'must': [x.to_dict() for x in _filters]
                        }
                    },
                    'aggs': {
                        'filtered': agg
                    }
                }
            search.aggs[name] = agg
    return search


def cap_facets_factory(search, index):
    """Add a cap facets to query.

    :param search: Basic search object.
    :param index: Index name.
    :returns: A tuple containing the new search object and a dictionary with
    all fields and values used.
    """
    urlkwargs = MultiDict()

    facets = current_app.config['RECORDS_REST_FACETS'].get(index)

    if facets is not None:
        # Aggregations.
        search = _aggregations(search, facets.get("aggs", {}),
                               urlkwargs, facets.get("post_filters", {}))

        # Query filter
        search, urlkwargs = _query_filter(
            search, urlkwargs, facets.get("filters", {}))

        # Post filter
        search, urlkwargs = _post_filter(
            search, urlkwargs, facets.get("post_filters", {}))

    return (search, urlkwargs)
