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


"""CAP Zenodo service views."""

import requests
from flask import current_app, jsonify
from invenio_pidstore.resolver import Resolver

from . import blueprint
from cap.modules.access.utils import login_required
from cap.modules.deposit.api import CAPDeposit


def _get_zenodo_record(zenodo_id):
    """Get record from zenodo."""
    zenodo_server_url = current_app.config.get('ZENODO_SERVER_URL')
    url = "{}/records/{}".format(zenodo_server_url, zenodo_id)
    params = {"access_token": current_app.config.get('ZENODO_ACCESS_TOKEN')}

    resp = requests.get(url, headers={'Content-Type': 'application/json'},
                        params=params)
    return resp.json(), resp.status_code


@blueprint.route('/zenodo/record/<zenodo_id>')
def get_zenodo_record(zenodo_id):
    """Get record from zenodo (route)."""
    resp, status = _get_zenodo_record(zenodo_id)
    return jsonify(resp), status


@blueprint.route('/zenodo/tasks/<depid>')
@login_required
def get_zenodo_tasks(depid):
    """Get record from zenodo (route)."""
    resolver = Resolver(pid_type='depid',
                        object_type='rec',
                        getter=lambda x: x)

    _, uuid = resolver.resolve(depid)
    record = CAPDeposit.get_record(uuid)
    tasks = record.get('_zenodo', {}).get('tasks', [])

    return jsonify(tasks), 200
