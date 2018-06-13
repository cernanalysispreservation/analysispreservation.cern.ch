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

import requests
from flask import Blueprint, current_app, jsonify, request

from elasticsearch import Elasticsearch
from invenio_search import RecordsSearch
from invenio_search.proxies import current_search_client as es

from ..permissions.cms import cms_permission

cms_bp = Blueprint(
    'cap_cms',
    __name__,
    url_prefix='/cms',
)


@cms_bp.route('/cadi/<cadi_id>', methods=['GET'])
@cms_permission.require(403)
def get_analysis_from_cadi(cadi_id):
    cadi_id = unquote(cadi_id)
    url = current_app.config['CADI_GET_RECORD_URL'] + cadi_id

    resp = requests.get(url=url)

    data = resp.json()
    try:
        response = data['data'][0]
    except IndexError:
        response = {}

    return jsonify(response)


@cms_bp.route('/datasets', methods=['GET'])
@cms_permission.require(403)
def get_datasets_names():
    term = request.args.get('query', '')
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
