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

import ssl
import urllib
import urllib2

from flask import Blueprint

from ..permissions.cms import cms_permission
from ..scripts.cms import das

cms_bp = Blueprint(
    'cap_cms',
    __name__,
    url_prefix='/CMS',
    template_folder='../templates',
    static_folder='../static',
)


ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


@cms_bp.route('/das', methods=['GET'])
@cms_permission.require(403)
def das_client():
    host = request.args.get('host', 'https://cmsweb.cern.ch')
    query = request.args.get('query', '')
    idx = request.args.get('idx', 0)
    limit = request.args.get('limit', 10)
    debug = request.args.get('debug', 0)

    jsondict = das.get_data(
        query=query, host=host, idx=idx, limit=limit, debug=debug)
    # query=query, host="https://cmsweb.cern.ch", idx=0, limit=10, debug=0)

    newdict = {}
    if (jsondict["nresults"] == 1):
        # print(json.dumps(jsondict, indent=4))

        for v in jsondict["data"][0]["dataset"]:
            newdict = dict(newdict.items() + v.items())
        return jsonify(**newdict)
    else:
        return jsonify(**newdict)


@cms_bp.route('/das/autocomplete', methods=['GET'])
@cms_permission.require(403)
def das_autocomplete():
    dbs_instance = request.args.get('dbs_instance', 'prod/global')
    query = request.args.get('query', None)

    url = 'https://cmsweb.cern.ch/das/autocomplete'
    params = {'dbs_instance': dbs_instance, 'query': query}
    encoded_data = urllib.urlencode(params, doseq=True)
    url += '?%s' % encoded_data
    response = urllib2.urlopen(url, context=ctx)
    return response.read()
