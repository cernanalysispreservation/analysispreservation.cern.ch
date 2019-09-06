# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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

"""CAP ROR service view."""
from __future__ import absolute_import, print_function
from urllib3.exceptions import HTTPError
try:
    from json.decoder import JSONDecodeError
except ImportError:
    JSONDecodeError = ValueError

import requests
from flask import jsonify, request
from invenio_rest.errors import RESTException

from . import blueprint
from ..serializers.ror import RORAffiliationSchema, RORAffiliationsListSchema
from cap.modules.access.utils import login_required
from cap.modules.experiments.errors import ExternalAPIException

ROR_GET_BY_ORG_ID_URL = 'https://api.ror.org/organizations/{}'
ROR_SEARCH_URL = 'https://api.ror.org/organizations?query={}'


def _ror(item, by='org'):
    """Get ROR organization by id/query."""
    url = ROR_GET_BY_ORG_ID_URL.format(item) \
        if by == 'org' else ROR_SEARCH_URL.format(item)

    resp = requests.get(url)
    return resp.json(), resp.status_code


@blueprint.route('/ror')
@login_required
def get_ror_by_query():
    """Get ROR results for a specified query."""
    args = request.get_json()
    query = args.get('query')
    if not query:
        raise RESTException(description='ROR Query not found.')
    try:
        resp, status = _ror(query, by='query')
        serialized = RORAffiliationsListSchema().dump(resp['items'], many=True)
        return jsonify(serialized.data), status
    except ExternalAPIException:
        raise


@blueprint.route('/ror/<org>')
@login_required
def get_ror_by_org(org):
    """Get ROR info by providing the ROR url."""
    try:
        resp, status = _ror(org, by='org')
        serialized = RORAffiliationSchema().dump(resp)
        return jsonify(serialized.data), status
    except JSONDecodeError:
        return jsonify({'message': 'Organization not found.'}), 404
    except ExternalAPIException:
        raise
