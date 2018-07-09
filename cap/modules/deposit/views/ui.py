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


"""CAP deposit UI views."""

from flask import (Blueprint, current_app, jsonify, request)

from cap.modules.deposit.utils import discover_schema
from jsonschema.validators import Draft4Validator, RefResolutionError

blueprint = Blueprint(
    'cap_deposit_ui',
    __name__,
    template_folder='../templates',
    url_prefix='/deposit',
    static_folder='../static'
)


@blueprint.route('/validator', methods=['GET', 'POST'])
def validator():
    """JSON Schema validator endpoint."""
    def _concat_deque(queue):
        """Helper for joining dequeue object."""
        result = ''
        for i in queue:
            if isinstance(i, int):
                result += '[' + str(i) + ']'
            else:
                result += '/' + i
        return result

    data = request.get_json()
    data['$schema'] = discover_schema(data)
    status = 200
    result = {}
    try:
        schema = data['$schema']
        if not isinstance(schema, dict):
            schema = {'$ref': schema}
        resolver = current_app.extensions[
            'invenio-records'].ref_resolver_cls.from_schema(schema)

        result['errors'] = [
            {_concat_deque(error.path): error.message}
            for error in
            Draft4Validator(schema, resolver=resolver).iter_errors(data)
        ]
        if result['errors']:
            status = 400
    except RefResolutionError:
        result['errors'] = 'Schema with given url not found'
        status = 400
    except KeyError:
        result['errors'] = 'Schema field is required'
        status = 400

    return jsonify(result), status
