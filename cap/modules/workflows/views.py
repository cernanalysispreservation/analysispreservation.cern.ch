# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2021 CERN.
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

from io import BytesIO
from functools import wraps
from coolname import generate_slug
from jsonschema.exceptions import ValidationError
from flask import Blueprint, jsonify, request, abort
from flask_login import current_user

from reana_client.api.client import (
    ping, get_workflow_status, start_workflow, get_workflow_logs,
    create_workflow, delete_workflow, stop_workflow, delete_file, list_files,
    download_file, upload_file, get_workflows, info, get_workflow_disk_usage,
    get_user_quota, mv_files)
from reana_client.errors import FileDeletionError, FileUploadError
from reana_client.utils import load_reana_spec

from .models import ReanaWorkflow
from .utils import (update_workflow, clone_workflow, get_reana_token,
                    resolve_uuid, resolve_depid, update_deposit_workflow,
                    get_reana_user_token)
from .serializers import ReanaWorkflowLogsSchema

from cap.modules.access.utils import login_required
from cap.modules.records.api import CAPRecord
from cap.modules.deposit.api import CAPDeposit
from cap.modules.experiments.errors import ExternalAPIException

workflows_bp = Blueprint('cap_workflows', __name__, url_prefix='/workflows/reana')


def pass_workflow(with_access=False, with_record=False, with_token=False):
    def _pass_workflow(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            workflow_id = kwargs.get('workflow_id', None)

            if workflow_id:
                workflow = ReanaWorkflow.get_workflow_by_id(workflow_id)

                if with_access:
                    if workflow.user_id == current_user.id:
                        if with_record:
                            deposit = CAPRecord.get_record(workflow.rec_uuid)
                            if deposit:
                                if with_token:
                                    token = get_reana_token(record=deposit)
                                    if token:
                                        return f(*args,
                                                 workflow=workflow,
                                                 deposit=deposit,
                                                 token=token,
                                                 **kwargs)
                                    else:
                                        return abort(404)
                                return f(*args,
                                         workflow=workflow,
                                         deposit=deposit,
                                         **kwargs)
                            else:
                                return abort(404)
                        return f(*args, workflow=workflow, **kwargs)
                    else:
                        return abort(403)

                return f(*args, workflow=workflow, **kwargs)

        return wrapper

    return _pass_workflow


####################################
#       Quota commands
####################################
@workflows_bp.route('/quota', methods=['GET'])
@login_required
def user_quota():
    """Retrieve REANA user quota usage and limits."""
    token = get_reana_user_token()
    try:
        resp = get_user_quota(token)
        return jsonify(resp), 200
    except Exception:
        raise ExternalAPIException()


####################################
#       Configuration commands
####################################
@workflows_bp.route('/info', methods=['GET'])
@login_required
def cluster_info():
    """List cluster general information."""
    token = get_reana_user_token()
    try:
        resp = info(token)
        return jsonify(resp), 200
    except Exception as e:
        return jsonify({
            'message': '{} has occured while '
            'connecting to REANA.'.format(e)
        }), 400


@workflows_bp.route('/ping', methods=['GET'])
@login_required
def ping_reana_service():
    """Ping the REANA service."""
    token = get_reana_user_token()
    try:
        resp = ping(token)
        return jsonify(resp), 200
    except Exception:
        raise ExternalAPIException()


####################################
#   Workflow management commands
####################################
@workflows_bp.route('/create', methods=['POST'])
@login_required
def workflow_create():
    """Create a REANA workflow by JSON."""
    _args = request.get_json()
    name = _args.get('workflow_name')
    workflow_json = _args.get('workflow_json')
    workflow_name = generate_slug(2)

    _, rec_uuid = resolve_depid(_args.get('pid'))
    deposit = CAPRecord.get_record(rec_uuid)
    token = get_reana_token(rec_uuid)

    # Create workflow
    try:
        resp = create_workflow(workflow_json, workflow_name, token)
    except ValidationError as e:
        return jsonify({'message': e.message}), 400
    except Exception:
        return jsonify({
            'message':
            'An exception has occured while creating '
            'the workflow in REANA.'
        }), 400

    if resp:
        workflow = update_deposit_workflow(deposit, current_user, name, workflow_name,
                                           resp, rec_uuid, workflow_json)

    return jsonify(workflow)


@workflows_bp.route('/<workflow_id>', methods=['DELETE'])
@login_required
@pass_workflow(with_access=True)
def workflow_delete(workflow_id, workflow=None):
    """Delete a REANA workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        # delete all_runs and workspace (True, True)
        resp = delete_workflow(workflow_id, True, True, token)
        update_workflow(workflow_id, 'status', 'deleted')
        return jsonify(resp)
    except Exception:
        return jsonify({
            'message':
            'Workflow {} does not exist. Aborting '
            'deletion.'.format(workflow_id)
        }), 400


@workflows_bp.route('/all', methods=['GET'])
@login_required
def get_all_workflows_by_cap_user():
    """Get all REANA workflows for a single CAP user."""
    try:
        workflows = ReanaWorkflow.get_user_workflows(current_user.id)
        _workflows = [workflow.serialize() for workflow in workflows]
    except Exception as e:
        return jsonify({
            'message': '{} has occured while '
            'retreiving the workflow.'.format(e)
        }), 400
    return jsonify(_workflows)


@workflows_bp.route('/all', methods=['POST'])
@login_required
def get_all_workflows_by_reana_user():
    """Get all REANA workflows for a single REANA user."""
    _args = request.get_json()
    sessions = _args.get('sessions')

    token = get_reana_user_token()
    _type = "interactive" if sessions else "batch"

    try:
        workflows = get_workflows(token, _type)
    except Exception as e:
        return jsonify({
            'message': '{} has occured while '
            'connecting to REANA.'.format(e)
        }), 400

    return jsonify(workflows)


@workflows_bp.route('/all/record/<depid>', methods=['GET'])
@login_required
def get_all_workflows_by_deposit(depid):
    """Get all REANA workflows for a single deposit."""
    _, rec_uuid = resolve_depid(depid)

    try:
        workflows = ReanaWorkflow.get_deposit_workflows(rec_uuid)
        _workflows = [workflow.serialize() for workflow in workflows]
    except Exception as e:
        return jsonify({
            'message': '{} has occured while '
            'connecting to REANA.'.format(e)
        }), 400

    return jsonify(_workflows)


@workflows_bp.route('/<workflow_id>', methods=['GET'])
@login_required
@pass_workflow(with_access=True)
def get_serialized_workflow(workflow_id, workflow=None):
    """Return the serialized REANA workflow."""
    return jsonify(workflow.serialize())


@workflows_bp.route('/<workflow_id>/clone', methods=['GET'])
@login_required
@pass_workflow(with_access=True)
def workflow_clone(workflow_id, workflow=None):
    """Clone a REANA workflow by returning the parameters of the original."""
    try:
        resp = clone_workflow(workflow_id)
        return jsonify(resp)
    except Exception:
        return jsonify({
            'message': ('An exception has occured while retrieving '
                        'the original workflow attributes.')
        }), 400


####################################
#   Workflow execution commands
####################################
@workflows_bp.route('/<workflow_id>/logs', methods=['GET'])
@login_required
@pass_workflow(with_access=True)
def workflow_logs(workflow_id, workflow=None):
    """Get the logs of a REANA workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = get_workflow_logs(workflow_id, token)
    except Exception as e:
        return jsonify({
            'message': '{} has occured while '
            'connecting to REANA.'.format(e)
        }), 400

    try:
        resp.update({'rec_uuid': rec_uuid})
        logs_serialized = ReanaWorkflowLogsSchema().dump(resp).data
        update_workflow(workflow_id, 'logs', logs_serialized)
    except Exception as e:
        return jsonify({
            'message': '{} has occured while '
            'updating the workflow.'.format(e)
        }), 500

    return jsonify(logs_serialized)


@workflows_bp.route('/run', methods=['POST'])
@login_required
def run_workflow():
    """Create a new REANA workflow using JSON, upload files and start the workflow."""
    _args = request.get_json()
    workflow_json = _args.get('workflow_json')
    parameters = _args.get('parameters')
    files = _args.get('files_to_upload')
    name = _args.get('workflow_name')

    workflow_name = generate_slug(2)
    _, rec_uuid = resolve_depid(_args.get('pid'))
    deposit = CAPRecord.get_record(rec_uuid)
    token = get_reana_token(rec_uuid)

    # Create workflow
    try:
        resp = create_workflow(workflow_json, workflow_name, token)
    except ValidationError as e:
        return jsonify({'message': e.message}), 400
    except Exception:
        return jsonify({
            'message':
            'An exception has occured while creating '
            'the workflow in REANA.'
        }), 400

    if resp:
        workflow = update_deposit_workflow(deposit, current_user, name, workflow_name,
                                           resp, rec_uuid, workflow_json)

    # Upload files
    if files:
        for _f in files:
            file_path = deposit.files[_f['path']].obj.file.uri
            try:
                with open(file_path, 'rb') as content:
                    upload_file(workflow.get('workflow_id'),
                                content, _f['new_path'], token)
            except (IOError, FileUploadError) as e:
                return jsonify({
                    'message':
                    'An exception occured while '
                    'uploading file {}: {}'.format(_f, e)
                }), 400

    # Start workflow
    try:
        resp = start_workflow(workflow.get('workflow_id'), token, parameters)
        update_workflow(workflow.get('workflow_id'), 'status', resp['status'])
        return jsonify(resp)
    except Exception:
        return jsonify({
            'message':
            'An exception has occured, most probably '
            'the workflow cannot start/restart.'
        }), 400


@workflows_bp.route('/<workflow_id>/start', methods=['POST'])
@workflows_bp.route('/<workflow_id>/restart', methods=['POST'])
@login_required
@pass_workflow(with_access=True)
def workflow_start(workflow_id, workflow=None):
    """Start/Restart a REANA workflow.

    For restarting: `parameters` should have {"restart": True}
    """
    _args = request.get_json()
    parameters = _args.get('parameters')

    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)
    try:
        resp = start_workflow(workflow_id, token, parameters)
        update_workflow(workflow_id, 'status', resp['status'])
        return jsonify(resp)
    except Exception:
        return jsonify({
            'message':
            'An exception has occured, most probably '
            'the workflow cannot start/restart.'
        }), 400


@workflows_bp.route('/<workflow_id>/status', methods=['GET'])
@login_required
@pass_workflow(with_access=True)
def workflow_status(workflow_id, workflow=None):
    """Get the status of a REANA workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = get_workflow_status(workflow_id, token)
        update_workflow(workflow_id, 'status', resp['status'])
    except Exception as e:
        return jsonify({
            'message': '{} has occured while '
            'updating the workflow.'.format(e)
        }), 500

    return jsonify(resp)


@workflows_bp.route('/<workflow_id>/stop', methods=['POST'])
@login_required
@pass_workflow(with_access=True)
def workflow_stop(workflow_id, workflow=None):
    """Stop a REANA workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = stop_workflow(workflow_id, True, token)
        update_workflow(workflow_id, 'status', 'stopped')
        return jsonify(resp)
    except Exception:
        return jsonify({
            'message':
            'An exception has occured, most probably '
            'the workflow is not running.'
        }), 400


@workflows_bp.route('/validate', methods=['POST'])
@login_required
def validate_workflow_spec():
    """Validate REANA workflow specification file."""
    _args = request.get_json()
    spec_files = _args.get('files_to_validate')

    _, rec_uuid = resolve_depid(_args.get('pid'))
    deposit = CAPRecord.get_record(rec_uuid)
    token = get_reana_token(rec_uuid)

    errors = {}
    validated = []
    for _f in spec_files:
        file_path = deposit.files[_f['path']].obj.file.uri
        try:
            load_reana_spec(file_path, access_token=token)
            validated.append(_f['path'])
        except ValidationError as e:
            errors[_f['path']] = e.message

    return jsonify({
        'validated': validated,
        'errors': errors
    }), 200


#####################################
# Workspace file management commands
#####################################
@workflows_bp.route('/<workflow_id>/files/<path:path>', methods=['GET'])
@login_required
@pass_workflow(with_access=True)
def download_workflow_files(workflow_id, path=None, workflow=None):
    """Download files from a REANA workflow and save in deposit."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)
    deposit = CAPDeposit.get_record(rec_uuid)

    try:
        resp, file_name = download_file(workflow_id, path, token)
    except Exception:
        return jsonify({
            'message':
            '{} did not match any existing file. '
            'Aborting download.'.format(path)
        }), 400

    # Convert the response in buffer stream
    file = BytesIO(resp)
    size = len(resp)
    try:
        deposit.save_file(file, file_name, size)
        return jsonify({
            'message': 'File {} successfully saved '
            'in the deposit.'.format(file_name)
        }), 200
    except Exception as e:
        return jsonify({
            'message':
            '{} occured while saving the file '
            'in the deposit.'.format(e)
        }), 400


@workflows_bp.route('/<workflow_id>/usage')
@login_required
@pass_workflow(with_access=True)
def workflow_disk_usage(workflow_id, workflow=None):
    """Get the disk usage of a REANA workflow workspace."""
    _args = request.get_json()
    parameters = _args.get('parameters')

    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = get_workflow_disk_usage(workflow_id, parameters, token)
    except Exception as e:
        return jsonify({
            'message': '{} has occured while '
            'connecting to REANA.'.format(e)
        }), 400

    return jsonify(resp)


@workflows_bp.route('/<workflow_id>/files')
@login_required
@pass_workflow(with_access=True)
def list_workflow_files(workflow_id, workflow=None):
    """Show the files in a REANA workflow workspace."""
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
        return jsonify({
            'message':
            'File list from workflow {} could not be '
            'retrieved. Aborting listing.'.format(workflow_id)
        }), 400


@workflows_bp.route('/<workflow_id>/file/move', methods=['POST'])
@login_required
def move_workflow_files(workflow_id):
    """Move target file within a REANA workflow workspace."""
    _args = request.get_json()
    file_to_move = _args.get('file_to_move')
    token = get_reana_user_token()

    # Check for workflow status
    workflow_current_status = get_workflow_status(workflow_id, token).get('status')
    update_workflow(workflow_id, 'status', workflow_current_status)
    if workflow_current_status == 'running':
        return jsonify({
            'message': 'File could not be moved for running workflow.'
        }), 400

    try:
        files = list_files(workflow_id, token)
        current_files = [file['name'] for file in files]
        file_source_name = file_to_move['source'].split('/')[-1]
        if not any(file_source_name in item for item in current_files):
            return jsonify({
                'message':
                'Source file {} does not exist in workspace {}'.format(
                    file_source_name,
                    current_files
                )
            }), 400
        resp = mv_files(file_to_move['source'], file_to_move['target'],
                        workflow_id, token)
        return jsonify({'message': resp}), 200
    except Exception:
        return jsonify({
            'message':
            'An exception has occured while moving '
            'the workflow files in REANA.'
        }), 400


@workflows_bp.route('/<workflow_id>/files/<path:path>', methods=['DELETE'])
@login_required
@pass_workflow(with_access=True)
def delete_workflow_files(workflow_id, path=None, workflow=None):
    """Delete files from a REANA workflow workspace."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = delete_file(workflow_id, path, token)
        return jsonify(resp)
    except FileDeletionError:
        return jsonify({
            'message':
            '{} did not match any existing file. '
            'Aborting deletion.'.format(path)
        }), 400


@workflows_bp.route('/<workflow_id>/files/upload', methods=['POST'])
@login_required
@pass_workflow(with_access=True, with_record=True)
def upload_workflow_files(workflow_id, workflow=None, deposit=None):
    """Upload files to a REANA workflow workspace."""
    _args = request.get_json()
    files = _args.get('files_to_upload')

    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    errors = []
    successful = []
    for _f in files:
        file_path = deposit.files[_f['path']].obj.file.uri
        try:
            with open(file_path, 'rb') as content:
                upload_file(workflow_id, content, _f['new_path'], token)
                successful.append('{} saved as {}'.format(
                    _f['path'], _f['new_path']))
        except (IOError, FileUploadError):
            errors.append(_f['path'])

    return jsonify({
        'workflow_id': workflow_id,
        'successful': successful,
        'errors': errors
    }), 200
