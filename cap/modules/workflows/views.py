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
from __future__ import absolute_import, print_function
import os

from flask import Blueprint, jsonify, request, abort
from flask_login import current_user

from invenio_db import db
from invenio_pidstore.resolver import Resolver
from reana_client.api.client import (ping, get_workflows, get_workflow_status,
                                     start_workflow, get_workflow_logs,
                                     create_workflow_from_json, delete_file,
                                     delete_workflow, stop_workflow,
                                     list_files, download_file, upload_file)
from reana_client.errors import FileDeletionError, FileUploadError

from .models import ReanaWorkflow
from .utils import (update_workflow, clone_workflow,
                    get_reana_token, resolve_uuid)
from .serializers import (ReanaWorkflowSchema,
                          ReanaAllWorkflowsSchema,
                          ReanaWorkflowLogsSchema)
from cap.modules.access.utils import login_required

workflows_bp = Blueprint('cap_workflows',
                         __name__,
                         url_prefix='/workflows'
                         )


@workflows_bp.route('/reana/ping')
@login_required
def ping_reana():
    """Ping the service."""
    try:
        resp = ping()
        status = 200 if resp == 'OK' else 400
        return jsonify({'message': resp}), status
    except Exception:
        abort(400)


@workflows_bp.route('/reana/create', methods=['POST'])
@login_required
def create_reana_workflow():
    """Create a reana workflow by json."""
    _args = request.get_json()
    resolver = Resolver(pid_type='depid',
                        object_type='rec',
                        getter=lambda x: x)

    _, rec_uuid = resolver.resolve(_args.get('pid'))
    token = get_reana_token(rec_uuid)

    workflow_name = _args.get('workflow_name')
    workflow_engine = _args.get('workflow_engine')
    workflow_json = _args.get('workflow_json')
    workflow_parameters = _args.get('parameters')
    workflow_outputs = _args.get('outputs')

    try:
        resp = create_workflow_from_json(workflow_json, workflow_name, token,
                                         workflow_engine=workflow_engine,
                                         parameters=workflow_parameters,
                                         outputs=workflow_outputs)

        # create a workflow dict, which can be used to populate
        # the db, but also used in the serializer
        _workflow = {
            'cap_user_id': current_user.id,
            'name': workflow_name,
            'name_run': resp['workflow_name'],
            'workflow_id': resp['workflow_id'],
            'rec_uuid': str(rec_uuid),
            'status': 'created',
            'engine': workflow_engine,
            'specification': workflow_json,
            'inputs': workflow_parameters,
            'outputs': workflow_outputs
        }
        workflow = ReanaWorkflow(**_workflow)
        workflow_serialized = ReanaWorkflowSchema().dump(_workflow).data

        db.session.add(workflow)
        db.session.commit()
        return jsonify(workflow_serialized)
    except Exception:
        return jsonify({'message': 'An exception has occured while creating '
                                   'the workflow.'}), 400


@workflows_bp.route('/reana/all/record/<recid>')
@login_required
def get_all_reana_workflows(recid):
    """Get all workflows for a single experiment."""
    resolver = Resolver(pid_type='depid',
                        object_type='rec',
                        getter=lambda x: x)
    _, rec_uuid = resolver.resolve(recid)
    token = get_reana_token(rec_uuid)

    resp = get_workflows(token, type='batch')
    _record = {
        'rec_uuid': rec_uuid,
        'workflows': resp
    }

    workflow_serialized = ReanaAllWorkflowsSchema().dump(_record).data
    return jsonify(workflow_serialized)


@workflows_bp.route('/reana/<workflow_id>/clone')
@login_required
def clone_reana_workflow(workflow_id):
    """Clone a workflow by returning the parameters of the original."""
    try:
        resp = clone_workflow(workflow_id)
        return jsonify(resp)
    except Exception:
        return jsonify({'message': 'An exception has occured while retrieving '
                                   'the original workflow attributes.'}), 400


@workflows_bp.route('/reana/<workflow_id>/status')
@login_required
def get_reana_workflow_status(workflow_id):
    """Get the status of a workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)
    resp = get_workflow_status(workflow_id, token)

    update_workflow(workflow_id, 'status', resp['status'])
    return jsonify(resp)


@workflows_bp.route('/reana/<workflow_id>/logs')
@login_required
def get_reana_workflow_logs(workflow_id):
    """Get the logs of a workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    resp = get_workflow_logs(workflow_id, token)
    resp.update({'rec_uuid': rec_uuid})
    logs_serialized = ReanaWorkflowLogsSchema().dump(resp).data

    update_workflow(workflow_id, 'logs', logs_serialized)
    return jsonify(logs_serialized)


@workflows_bp.route('/reana/<workflow_id>/start', methods=['POST'])
def start_user_workflow(workflow_id):
    """Start a REANA workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = start_workflow(workflow_id, token, None)
        update_workflow(workflow_id, 'status', resp['status'])
        return jsonify(resp)
    except Exception:
        return jsonify({'message': 'An exception has occured, most probably '
                                   'the workflow cannot restart.'}), 400


@workflows_bp.route('/reana/<workflow_id>/stop', methods=['POST'])
@login_required
def stop_reana_workflow(workflow_id):
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = stop_workflow(workflow_id, True, token)
        update_workflow(workflow_id, 'status', 'stopped')
        return jsonify(resp)
    except Exception:
        return jsonify({'message': 'An exception has occured, most probably '
                                   'the workflow is not running.'}), 400


@workflows_bp.route('/reana/<workflow_id>/delete', methods=['DELETE'])
@login_required
def delete_reana_workflow(workflow_id):
    """Delete a workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        # all_runs, hard_delete and workspace
        resp = delete_workflow(workflow_id, 0, 1, 1, token)
        update_workflow(workflow_id, 'status', 'deleted')
        return jsonify(resp)
    except Exception:
        return jsonify({'message': 'Workflow {} does not exist. Aborting '
                                   'deletion.'.format(workflow_id)}), 400


@workflows_bp.route('/reana/<workflow_id>/ls')
@login_required
def list_reana_workflow_files(workflow_id):
    """Show the files of a workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = list_files(workflow_id, token)
        _files = {
            'rec_uuid': rec_uuid,
            'workflow_id': workflow_id,
            'files': resp
        }
        return jsonify(_files)
    except Exception:
        return jsonify({'message': 'File list from workflow {} could not be '
                                   'retrieved. Aborting listing.'
                       .format(workflow_id)}), 400


@workflows_bp.route('/reana/<workflow_id>/download')
@login_required
def download_reana_workflow_files(workflow_id):
    """Download files from a workflow."""
    fpath = request.args.get('file_path')
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        binary_resp = download_file(workflow_id, fpath, token)

        # create the full path of the downloaded file name
        # e.g. code/helloworld.py or data/names.txt
        if not os.path.exists(os.path.dirname(fpath)):
            os.makedirs(os.path.dirname(fpath))

        with open(fpath, 'wb') as f:
            f.write(binary_resp)

        path = '{}/{}'.format(os.getcwd(), fpath)
        return jsonify({'message': 'Files downloaded to {}.'.format(path)})
    except Exception:
        return jsonify({'message': '{} did not match any existing file. '
                                   'Aborting download.'.format(fpath)}), 400


@workflows_bp.route('/reana/<workflow_id>/upload', methods=['POST'])
@login_required
def upload_reana_workflow_files(workflow_id):
    """Upload files to a workflow."""
    _args = request.get_json()
    files = _args.get('files_to_upload')

    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    errors = []
    successful = []
    for _f in files:
        try:
            with open(_f['path'], 'rb') as content:
                upload_file(workflow_id, content, _f['new_path'], token)
                successful.append('{} saved as {}'.format(_f['path'],
                                                          _f['new_path']))
        except (IOError, FileUploadError):
            errors.append(_f['path'])

    return jsonify({'workflow_id': workflow_id,
                    'successful': successful,
                    'errors': errors}), 200


@workflows_bp.route('/reana/<workflow_id>/rm', methods=['DELETE'])
@login_required
def delete_reana_workflow_files(workflow_id):
    """Delete files from a workflow."""
    fpath = request.args.get('file_path')
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = delete_file(workflow_id, fpath, token)
        return jsonify(resp)
    except FileDeletionError:
        return jsonify({'message': '{} did not match any existing file. '
                                   'Aborting deletion.'.format(fpath)}), 400
