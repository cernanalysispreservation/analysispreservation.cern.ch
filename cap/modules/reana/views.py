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


"""CAP REANA views."""

from flask import Blueprint, abort, current_app, jsonify, request

from flask_login import current_user
from invenio_pidstore.models import PersistentIdentifier, PIDDoesNotExistError

from invenio_db import db
import json
from .models import ReanaJob
from .serializers import ReanaJobSchema
from reana_client.api.client import create_workflow_from_json, \
    start_workflow, get_workflow_status, get_workflow_logs

reana_bp = Blueprint('cap_reana',
                     __name__,
                     url_prefix='/reana'
                     )


@reana_bp.route('/jobs/<pid>')
def get_current_user_jobs(pid=None):
    """Get reana jobs for current user and analysis with given id."""
    if not current_user.is_authenticated:
        abort(401)

    try:
        uuid = PersistentIdentifier.get('recid', pid).object_uuid
    except PIDDoesNotExistError:
        abort(404)

    jobs = ReanaJob.get_jobs(user_id=current_user.id,
                             record_id=uuid)
    schema = ReanaJobSchema()

    return jsonify([schema.dump(x).data for x in jobs])


@reana_bp.route('/create', methods=['POST'])
def create_workflow():
    """Create workflow."""
    data = request.get_json()
    record_id = data['record_id']
    workflow_json = data['workflow_json']
    name = data['workflow_name']
    workflow_engine = 'yadage'
    parameters = {
        "parameters": {
            "did": 404958,
            "xsec_in_pb": 0.00122,
            "dxaod_file": "https://recastwww.web.cern.ch/recastwww/data/" +
            "reana-recast-demo/" +
            "mc15_13TeV.123456.cap_recast_demo_signal_one.root"
        }
    }
    access_token = current_app.config.get('REANA_ACCESS_TOKEN')
    response = create_workflow_from_json(
        workflow_json, name, access_token, parameters, workflow_engine)

    try:
        uuid = PersistentIdentifier.get('recid', record_id).object_uuid
    except PIDDoesNotExistError:
        abort(404)

    reana_job = ReanaJob(
        user_id=current_user.id,
        record_id=uuid,
        name=name,
        params={
            "reana_id": response.get('workflow_id'),
            "json": workflow_json,
            "name": name,
            "parameters": parameters,
        }
    )

    db.session.add(reana_job)
    db.session.commit()
    return jsonify(response)


@reana_bp.route('/start/<workflow_id>')
def start_analysis(workflow_id=None):
    """Start an analysis workflow."""
    token = current_app.config.get('REANA_ACCESS_TOKEN')
    parameters = {
        "parameters": {
            "did": 404958,
            "xsec_in_pb": 0.00122,
            "dxaod_file": "https://recastwww.web.cern.ch/recastwww/data" +
            "/reana-recast-demo/" +
            "mc15_13TeV.123456.cap_recast_demo_signal_one.root"}}
    response = start_workflow(workflow_id, token, parameters)
    return jsonify(response)


@reana_bp.route('/status/<workflow_id>')
def get_analysis_status(workflow_id=None):
    """Retrieve status of an analysis workflow."""
    token = current_app.config.get('REANA_ACCESS_TOKEN')
    response = get_workflow_status(workflow_id, token)

    _logs = json.loads(response.get("logs"))
    response["logs"] = _logs
    return jsonify(response)


@reana_bp.route('/status/<workflow_id>/outputs')
def get_analysis_outputs(workflow_id=None):
    """Start outputs of an analysis workflow."""
    token = current_app.config.get('REANA_ACCESS_TOKEN')
    response = get_workflow_logs(workflow_id, token)
    return jsonify(response)
