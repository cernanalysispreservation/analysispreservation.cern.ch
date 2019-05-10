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

"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from urllib import unquote

from flask import Blueprint, jsonify, request
from invenio_search.proxies import current_search_client as es

from ..permissions import cms_permission
from ..utils.cadi import get_from_cadi_by_id, parse_cadi_entry

cms_bp = Blueprint(
    'cap_cms',
    __name__,
    url_prefix='/cms',
)


@cms_bp.route('/cadi/<cadi_id>', methods=['GET'])
@cms_permission.require(403)
def get_analysis_from_cadi(cadi_id):
    """Retrieve specific CADI analysis."""
    cadi_id = unquote(cadi_id).upper()

    entry = get_from_cadi_by_id(cadi_id)
    if entry:
        _, parsed = parse_cadi_entry(entry)
    else:
        parsed = {}

    return jsonify(parsed)


@cms_bp.route('/datasets', methods=['GET'])
@cms_permission.require(403)
def get_datasets_names():
    """Retrieve specific dataset names."""
    term = unquote(request.args.get('query', ''))
    query = {
        "suggest": {
            "name-suggest": {
                "prefix": term,
                "completion": {
                    "field": "name"
                }
            }
        }
    }

    res = es.search(index="das-datasets",
                    terminate_after=10,
                    body=query)

    suggestions = res['suggest']['name-suggest'][0]['options']
    res = [x['_source']['name'] for x in suggestions]
    return jsonify(res)
