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

import io
from functools import wraps
from coolname import generate_slug
from jsonschema.exceptions import ValidationError
from flask import Blueprint, jsonify, request, abort, send_file
from flask_login import current_user

from invenio_db import db
from invenio_pidstore.resolver import Resolver
from invenio_pidstore.errors import PIDDoesNotExistError

from reana_client.api.client import (
    ping, get_workflow_status, start_workflow, get_workflow_logs,
    create_workflow, delete_workflow, stop_workflow, delete_file, list_files,
    download_file, upload_file)
from reana_client.errors import FileDeletionError, FileUploadError

from .models import ReanaWorkflow
from .utils import (update_workflow, clone_workflow, get_reana_token,
                    resolve_uuid)
from .serializers import ReanaWorkflowSchema, ReanaWorkflowLogsSchema

from cap.modules.access.utils import login_required
from cap.modules.records.api import CAPRecord
from cap.modules.deposit.permissions import UpdateDepositPermission
from cap.modules.experiments.errors import ExternalAPIException

workflows_bp = Blueprint('cap_workflows', __name__, url_prefix='/workflows')


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


@workflows_bp.route('/reana/ping')
@login_required
def ping_reana():
    """Ping the service."""
    try:
        resp = ping()
        status = 200 if resp == 'OK' else 400
        return jsonify({'message': resp}), status
    except Exception:
        raise ExternalAPIException()


@workflows_bp.route('/', methods=['GET'])
@login_required
def get_workflows_view():
    """Create a reana workflow by json."""
    workflows = ReanaWorkflow.get_user_workflows(current_user.id)

    _workflows = [workflow.serialize() for workflow in workflows]
    return jsonify(_workflows)


@workflows_bp.route('/all/record/<depid>')
@login_required
def get_all_reana_workflows(depid):
    """Get all workflows for a single experiment."""
    try:
        resolver = Resolver(pid_type='depid',
                            object_type='rec',
                            getter=lambda x: x)

        _, rec_uuid = resolver.resolve(depid)
    except PIDDoesNotExistError:
        abort(
            404, "You tried to create a workflow and connect"
            " it with a non-existing record")

    workflows = ReanaWorkflow.get_deposit_workflows(rec_uuid)

    _workflows = [workflow.serialize() for workflow in workflows]
    return jsonify(_workflows)


@workflows_bp.route('/reana', methods=['POST'])
@login_required
def create_reana_workflow():
    """Create a reana workflow by json."""
    _args = request.get_json()
    # try fetch the deposit with the provided PID
    try:
        resolver = Resolver(pid_type='depid',
                            object_type='rec',
                            getter=lambda x: x)

        deposit, rec_uuid = resolver.resolve(_args.get('pid'))
    except PIDDoesNotExistError:
        abort(
            404, "You tried to create a workflow and connect"
            " it with a non-existing record")

    # if record exist check if the user has 'deposit-update' rights

    with UpdateDepositPermission(deposit).require(403):
        token = get_reana_token(rec_uuid)

        name = _args.get('workflow_name')
        workflow_name = generate_slug(2)
        workflow_json = _args.get('workflow_json')

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

        # create a workflow dict, which can be used to populate
        # the db, but also used in the serializer
        _workflow = {
            'service': 'reana',
            'user_id': current_user.id,
            'name': name,
            'workflow_name': workflow_name,
            'name_run': resp['workflow_name'],
            'workflow_id': resp['workflow_id'],
            'rec_uuid': str(rec_uuid),
            'depid': _args.get('pid'),
            'status': 'created',
            'workflow_json': workflow_json,
        }

        # TOFIX: check for integrity errors
        workflow = ReanaWorkflow(**_workflow)

        db.session.add(workflow)
        db.session.commit()

        workflow_serialized = ReanaWorkflowSchema().dump(_workflow).data

        return jsonify(workflow_serialized)


@workflows_bp.route('/reana/<workflow_id>')
@login_required
@pass_workflow(with_access=True)
def get_workflow(workflow_id, workflow=None):
    """Clone a workflow by returning the parameters of the original."""
    return jsonify(workflow.serialize())


@workflows_bp.route('/reana/<workflow_id>/clone')
@login_required
@pass_workflow(with_access=True)
def clone_reana_workflow(workflow_id, workflow=None):
    """Clone a workflow by returning the parameters of the original."""
    try:
        resp = clone_workflow(workflow_id)
        return jsonify(resp)
    except Exception:
        return jsonify({
            'message': ('An exception has occured while retrieving '
                        'the original workflow attributes.')
        }), 400


@workflows_bp.route('/reana/<workflow_id>/status')
@login_required
@pass_workflow(with_access=True)
def get_reana_workflow_status(workflow_id, workflow=None):
    """Get the status of a workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)
    resp = get_workflow_status(workflow_id, token)

    update_workflow(workflow_id, 'status', resp['status'])
    return jsonify(resp)


@workflows_bp.route('/reana/<workflow_id>/logs')
@login_required
@pass_workflow(with_access=True)
def get_reana_workflow_logs(workflow_id, workflow=None):
    """Get the logs of a workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    resp = get_workflow_logs(workflow_id, token)

    # logs = resp.get('logs', '')

    resp.update({'rec_uuid': rec_uuid})
    logs_serialized = ReanaWorkflowLogsSchema().dump(resp).data

    update_workflow(workflow_id, 'logs', logs_serialized)
    return jsonify(logs_serialized)


@workflows_bp.route('/reana/<workflow_id>/start', methods=['POST'])
@pass_workflow(with_access=True)
def start_reana_workflow(workflow_id, workflow=None):
    """Start a REANA workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        resp = start_workflow(workflow_id, token, None)
        update_workflow(workflow_id, 'status', resp['status'])
        return jsonify(resp)
    except Exception:
        return jsonify({
            'message':
            'An exception has occured, most probably '
            'the workflow cannot restart.'
        }), 400


@workflows_bp.route('/reana/<workflow_id>/stop', methods=['POST'])
@login_required
@pass_workflow(with_access=True)
def stop_reana_workflow(workflow_id, workflow=None):
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


@workflows_bp.route('/reana/<workflow_id>', methods=['DELETE'])
@login_required
@pass_workflow(with_access=True)
def delete_reana_workflow(workflow_id, workflow=None):
    """Delete a workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        # all_runs, hard_delete and workspace
        resp = delete_workflow(workflow_id, 0, 1, 1, token)
        update_workflow(workflow_id, 'status', 'deleted')
        return jsonify(resp)
    except Exception:
        return jsonify({
            'message':
            'Workflow {} does not exist. Aborting '
            'deletion.'.format(workflow_id)
        }), 400


@workflows_bp.route('/reana/<workflow_id>/files')
@login_required
@pass_workflow(with_access=True)
def list_reana_workflow_files(workflow_id, workflow=None):
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
        return jsonify({
            'message':
            'File list from workflow {} could not be '
            'retrieved. Aborting listing.'.format(workflow_id)
        }), 400


@workflows_bp.route('/reana/<workflow_id>/files/<path:path>', methods=['GET'])
@login_required
@pass_workflow(with_access=True)
def download_reana_workflow_files(workflow_id, path=None, workflow=None):
    """Download files from a workflow."""
    rec_uuid = resolve_uuid(workflow_id)
    token = get_reana_token(rec_uuid)

    try:
        binary_resp = download_file(workflow_id, path, token)

        return send_file(io.BytesIO(binary_resp),
                         attachment_filename=path,
                         mimetype='multipart/form-data'), 200

    except Exception:
        return jsonify({
            'message':
            '{} did not match any existing file. '
            'Aborting download.'.format(path)
        }), 400


@workflows_bp.route('/reana/<workflow_id>/files/upload', methods=['POST'])
@login_required
@pass_workflow(with_access=True, with_record=True)
def upload_reana_workflow_files(workflow_id, workflow=None, deposit=None):
    """Upload files to a workflow."""
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


@workflows_bp.route('/reana/<workflow_id>/files/<path:path>',
                    methods=['DELETE'])
@login_required
@pass_workflow(with_access=True)
def delete_reana_workflow_files(workflow_id, path=None, workflow=None):
    """Delete files from a workflow."""
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
