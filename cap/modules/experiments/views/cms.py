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

from flask import Blueprint, abort, jsonify, request
from six.moves.urllib.parse import unquote

from ..permissions import cms_permission
from ..search.cms_triggers import CMSTriggerSearch
from ..search.das import DASSearch
from ..serializers import CADISchema
from ..utils.cadi import get_from_cadi_by_id
from ..utils.das import update_term_for_das_query

cms_bp = Blueprint(
    'cap_cms',
    __name__,
    url_prefix='/cms',
)


def _get_cadi(cadi_id):
    """Retrieve specific CADI analysis."""
    cadi_id = unquote(cadi_id).upper()
    entry = get_from_cadi_by_id(cadi_id)

    if entry:
        serializer = CADISchema()
        parsed = serializer.dump(entry).data
    else:
        parsed = {}
    return parsed, 200


@cms_bp.route('/cadi/<cadi_id>', methods=['GET'])
@cms_permission.require(403)
def get_analysis_from_cadi(cadi_id):
    """Retrieve specific CADI analysis (route)."""
    resp, status = _get_cadi(cadi_id)
    return jsonify(resp), status


@cms_bp.route('/datasets', methods=['GET'])
@cms_permission.require(403)
def get_datasets_suggestions():
    """Retrieve specific dataset names."""
    query = update_term_for_das_query(unquote(request.args.get('query')))

    search = DASSearch().prefix_search(query).sort('name')
    results = search.execute()

    return jsonify([hit.name for hit in results])


@cms_bp.route('/triggers', methods=['GET'])
@cms_permission.require(403)
def get_triggers_suggestions():
    """Retrieve specific dataset names."""
    try:
        query = unquote(request.args.get('query'))
        dataset = unquote(request.args.get('dataset'))
    except TypeError:
        abort(
            400, 'You need to provide query and dataset(eg. /ZeroBias7/..) \
            as parameters.')

    year = request.args.get('year')

    search = CMSTriggerSearch().prefix_search(query, dataset, year)
    results = search.execute()

    # @TOFIX should use aggregations to return unique values
    return jsonify(list(set(hit.trigger for hit in results)))
