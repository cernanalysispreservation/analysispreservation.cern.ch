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
from reana_client.api.client import (ping, get_workflows, get_workflow_status,
                                     start_workflow, get_workflow_logs,
                                     create_workflow_from_json, delete_file,
                                     delete_workflow, stop_workflow,
                                     list_files, download_file, upload_file)
from reana_client.errors import FileDeletionError, FileUploadError

from .utils import get_request_attributes, update_workflow, \
    bool2num, clone_workflow
from .models import ReanaWorkflow
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
    args, rec_uuid, token = get_request_attributes(request)

    workflow_name = args.get('workflow_name')
    workflow_engine = args.get('workflow_engine')
    workflow_json = args.get('workflow_json')
    workflow_parameters = args.get('parameters')
    workflow_outputs = args.get('outputs')

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
            'record_id': rec_uuid,
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


@workflows_bp.route('/reana/all')
@login_required
def get_all_reana_workflows():
    """Get all workflows for a single experiment."""
    args, rec_uuid, token = get_request_attributes(request)
    resp = get_workflows(token, type='batch')

    _record = {
        'record_id': rec_uuid,
        'workflows': resp
    }

    workflow_serialized = ReanaAllWorkflowsSchema().dump(_record).data
    return jsonify(workflow_serialized)


@workflows_bp.route('/reana/<workflow_id>/clone')
@login_required
def clone_reana_workflow(workflow_id):
    """Clone a workflow by returning the parameters of the original."""
    try:
        resp = clone_reana_workflow(workflow_id)
        return jsonify(resp)
    except Exception:
        return jsonify({'message': 'An exception has occured while retrieving '
                                   'the original workflow attributes.'}), 400


@workflows_bp.route('/reana/<workflow_id>/status')
@login_required
def get_reana_workflow_status(workflow_id):
    """Get the status of a workflow."""
    args, rec_uuid, token = get_request_attributes(request)
    resp = get_workflow_status(workflow_id, token)

    update_workflow(workflow_id, 'status', resp['status'])
    return jsonify(resp)


@workflows_bp.route('/reana/<workflow_id>/logs')
@login_required
def get_reana_workflow_logs(workflow_id):
    """Get the logs of a workflow."""
    args, rec_uuid, token = get_request_attributes(request)
    resp = get_workflow_logs(workflow_id, token)

    resp.update({'record_id': rec_uuid})
    logs_serialized = ReanaWorkflowLogsSchema().dump(resp).data

    update_workflow(workflow_id, 'logs', logs_serialized)
    return jsonify(logs_serialized)


@workflows_bp.route('/reana/<workflow_id>/start')
def start_user_workflow(workflow_id):
    """Start a REANA workflow."""
    args, rec_uuid, token = get_request_attributes(request)

    try:
        resp = start_workflow(workflow_id, token, None)
        update_workflow(workflow_id, 'status', resp['status'])
        return jsonify(resp)
    except Exception:
        return jsonify({'message': 'An exception has occured, most probably '
                                   'the workflow cannot restart.'}), 400


@workflows_bp.route('/reana/<workflow_id>/stop')
@login_required
def stop_reana_workflow(workflow_id):
    """Stop a workflow."""
    args, rec_uuid, token = get_request_attributes(request)
    force_stop = args.get('force_stop', True)

    try:
        resp = stop_workflow(workflow_id, force_stop, token)
        update_workflow(workflow_id, 'status', 'stopped')
        return jsonify(resp)
    except Exception:
        return jsonify({'message': 'An exception has occured, most probably '
                                   'the workflow is not running.'}), 400


@workflows_bp.route('/reana/<workflow_id>/delete')
@login_required
def delete_reana_workflow(workflow_id):
    """Delete a workflow."""
    args, rec_uuid, token = get_request_attributes(request)

    all_runs = args.get('all_runs')
    hard_delete = args.get('hard_delete')
    workspace = args.get('workspace')

    try:
        # bool2numeric as needed by the delete function
        resp = delete_workflow(workflow_id, bool2num(all_runs),
                               bool2num(hard_delete),
                               bool2num(workspace), token)

        update_workflow(workflow_id, 'status', 'deleted')
        return jsonify(resp)
    except Exception:
        return jsonify({'message': 'Workflow {} does not exist. Aborting '
                                   'deletion.'.format(workflow_id)}), 400


@workflows_bp.route('/reana/<workflow_id>/ls')
@login_required
def list_reana_workflow_files(workflow_id):
    """Show the files of a workflow."""
    args, rec_uuid, token = get_request_attributes(request)

    try:
        resp = list_files(workflow_id, token)
        _files = {
            'record_id': rec_uuid,
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
    args, rec_uuid, token = get_request_attributes(request)
    fpath = args.get('file_path')

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
    args, rec_uuid, token = get_request_attributes(request)
    files = args.get('files_to_upload')

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


@workflows_bp.route('/reana/<workflow_id>/rm', methods=['POST'])
@login_required
def delete_reana_workflow_files(workflow_id):
    """Delete files from a workflow."""
    args, rec_uuid, token = get_request_attributes(request)
    fpath = args.get('file_path')

    try:
        resp = delete_file(workflow_id, fpath, token)
        return jsonify(resp)
    except FileDeletionError:
        return jsonify({'message': '{} did not match any existing file. '
                                   'Aborting deletion.'.format(fpath)}), 400
