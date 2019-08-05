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


"""CAP ORCID service views."""

import requests
from flask import jsonify, request, current_app

from . import blueprint
from cap.modules.access.utils import login_required

JSON_HEADERS = {'Content-Type': 'application/json'}
ORCID_SERVER_URL = 'https://pub.orcid.org/v2.1'


def _get_orcid(arg, by='name'):
    """Get ORCID information depending on the argument type (name/orcid id)."""
    if by == 'name':
        name = arg.split()
        url = "{}/search/?q=given-names:{}+AND+family-name:{}".format(
            ORCID_SERVER_URL, name[0], name[-1])
    else:
        url = '{}/{}/record'.format(ORCID_SERVER_URL, arg)

    resp = requests.get(url, headers=JSON_HEADERS)
    return resp.json(), resp.status_code


@blueprint.route('/orcid')
@login_required
def get_orcid():
    """Get ORCID for given name (route)."""
    name = request.args.get('name', None)
    res = {}
    if not name:
        return jsonify(res)

    resp, status = _get_orcid(name, by='name')
    results = resp.get('result', [])

    # return only if one result
    if len(results) == 1:
        res['orcid'] = results[0]['orcid-identifier']['path']

    return jsonify(res), status


@blueprint.route('/orcid/<orcid>')
@login_required
def get_record_by_orcid(orcid):
    """Get ORCID identifier registered for given name (route)."""
    resp, status = _get_orcid(orcid, by='orcid')
    return jsonify(resp), status
