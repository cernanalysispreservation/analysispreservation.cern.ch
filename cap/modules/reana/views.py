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

from flask import Blueprint, abort, current_app, jsonify

from flask_login import current_user
from invenio_pidstore.models import PersistentIdentifier, PIDDoesNotExistError

from .models import ReanaJob
from .serializers import ReanaJobSchema
from reana_client.api.client import Client

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
        uuid = PersistentIdentifier.get('depid', pid).object_uuid
    except PIDDoesNotExistError:
        abort(404)

    jobs = ReanaJob.get_jobs(user_id=current_user.id,
                             record_id=uuid)
    schema = ReanaJobSchema()

    return jsonify([schema.dump(x).data for x in jobs])


@reana_bp.route('/start/<workflow_id>')
def start_analysis(workflow_id=None):
    """Starts an analysis workflow."""
    server_url = current_app.config.get('REANA_SERVER_URL')
    token = current_app.config.get('REANA_CLIENT_TOKEN')
    response = Client(server_url).start_analysis(
        'default', workflow_id, token)
    return jsonify(response)


@reana_bp.route('/status/<workflow_id>')
def get_analysis_status(workflow_id=None):
    """Retrieves status of an analysis workflow."""
    server_url = current_app.config.get('REANA_SERVER_URL')
    token = current_app.config.get('REANA_CLIENT_TOKEN')
    response = Client(server_url).get_analysis_status(
        'default', workflow_id, token)
    return jsonify(response)


@reana_bp.route('/status/<workflow_id>/outputs')
def get_analysis_outputs(workflow_id=None):
    """Starts outputs of an analysis workflow."""
    server_url = current_app.config.get('REANA_SERVER_URL')
    token = current_app.config.get('REANA_CLIENT_TOKEN')
    response = Client(server_url).get_analysis_outputs(
        'default', workflow_id, token)
    return jsonify(response)
