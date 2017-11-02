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

from ..permissions.cms import cms_permission

cms_bp = Blueprint(
    'cap_cms',
    __name__,
    url_prefix='/cms',
)


@cms_bp.route('/cadi', methods=['GET'])
@cms_permission.require(403)
def get_analysis_from_cadi():
    ana_number = unquote(request.args.get('ana_number', ''))
    url = current_app.config['CADI_GET_RECORD_URL'] + ana_number

    resp = requests.get(url=url).json()

    try:
        data = resp['data'][0]
    except IndexError:
        data = {}
    return jsonify(data)
