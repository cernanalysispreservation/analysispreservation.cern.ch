# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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
# or submit itself to any jurisdiction.

"""Integration tests for CAP api."""
from __future__ import absolute_import, print_function
import imp

import json
from mock import patch
from pytest import mark

from reana_client.errors import FileDeletionError


@patch('cap.modules.workflows.views.ping', return_value='not ok!')
def test_reana_ping_not_ok(mock_ping, app, auth_headers_for_superuser, json_headers):
    with app.test_client() as client:
        resp = client.get('workflows/reana/ping', headers=auth_headers_for_superuser + json_headers)
        assert resp.json['message'] == 'not ok!'


@patch('cap.modules.workflows.views.ping', return_value=Exception())
def test_reana_ping_exception(mock_ping, app, auth_headers_for_superuser, json_headers):
    with app.test_client() as client:
        resp = client.get('workflows/reana/ping',
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 503


@patch('cap.modules.workflows.views.create_reana_workflow')
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_create_reana_workflow(mock_token, mock_created, app, get_record_pid_uuid,
                               auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_data = {
        "pid": pid,
        "workflow_name": "demo",
        "workflow_engine": "serial",
        "workflow_json": {
            "inputs": {
                "files": [],
                "parameters": {}
            },
            "outputs": {},
            "version": "0.3.0",
            "workflow": {
                "specification": {
                "steps": [
                    {
                    "commands": [
                        "python --version"
                    ],
                    "environment": "python:2.7-slim"
                    }
                ]
                },
                "type": "serial"
            }
        }
    }

    with app.test_client() as client:
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200


@patch('cap.modules.workflows.views.create_reana_workflow', side_effect=Exception())
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_create_reana_workflow_exception(mock_token, mock_created, app, get_record_pid_uuid,
                                         auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_data = {
        "pid": pid, "workflow_name": "demo", "workflow_engine": "yadage",
        "workflow_json": {}, "parameters": {}, "outputs": {}
    }

    with app.test_client() as client:
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 400


@patch('cap.modules.workflows.views.get_all_reana_workflows')
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_get_all_workflows(mock_token, mock_get_all, app, get_record_pid_uuid,
                           auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid

    with app.test_client() as client:
        resp = client.get('workflows/all/record/{}'.format(pid),
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200


@patch('cap.modules.workflows.views.get_reana_workflow_logs')
@patch('cap.modules.workflows.utils.resolve_uuid')
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_reana_workflow_logs(mock_token, mock_uuid, mock_logs, app, get_record_pid_uuid,
                             create_reana_workflow, auth_headers_for_superuser, json_headers):
    _, uuid = get_record_pid_uuid
    mock_workflow_id = '4e4e6afc-fd57-4f59-836a-40ae19d2d6d0'
    create_reana_workflow(uuid, mock_workflow_id)

    with app.test_client() as client:
        resp = client.get('workflows/reana/{}/logs'.format(mock_workflow_id),
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200
        assert resp.json['workflow_id'] == mock_workflow_id


@patch('cap.modules.workflows.views.start_reana_workflow', side_effect=Exception())
@patch('cap.modules.workflows.utils.resolve_uuid')
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_workflow_start_exception(mock_token, mock_uuid, mock_start, app, get_record_pid_uuid,
                                  create_reana_workflow, auth_headers_for_superuser, json_headers):
    _, uuid = get_record_pid_uuid
    mock_workflow_id = '4e4e6afc-fd57-4f59-836a-40ae19d2d6d0'
    create_reana_workflow(uuid, mock_workflow_id)
    mock_data = {'input_parameters': {}, 'operational_options': {}}

    with app.test_client() as client:
        resp = client.post('workflows/reana/{}/start'.format(mock_workflow_id),
                           data=json.dumps(mock_data), headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 400
        assert resp.json == {'message': 'An exception has occured, most probably '
                                        'the workflow cannot restart.'}


@patch('cap.modules.workflows.views.stop_reana_workflow', side_effect=Exception())
@patch('cap.modules.workflows.utils.resolve_uuid')
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_workflow_stop_exception(mock_token, mock_uuid, mock_stop, app, get_record_pid_uuid,
                                 create_reana_workflow, auth_headers_for_superuser, json_headers):
    _, uuid = get_record_pid_uuid
    mock_workflow_id = '4e4e6afc-fd57-4f59-836a-40ae19d2d6d0'
    create_reana_workflow(uuid, mock_workflow_id)

    with app.test_client() as client:
        resp = client.post('workflows/reana/{}/stop'.format(mock_workflow_id),
                           headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 400
        assert resp.json == {'message': 'An exception has occured, most probably '
                                        'the workflow is not running.'}


@patch('cap.modules.workflows.views.delete_reana_workflow', side_effect=Exception())
@patch('cap.modules.workflows.utils.resolve_uuid')
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_workflow_delete_not_found(mock_token, mock_uuid, mock_start, app, get_record_pid_uuid,
                                   auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_uuid.return_value = uuid
    mock_workflow_id = '7393815e-e3ef-4f7c-a0fe-a3a30a10ac2f'

    with app.test_client() as client:
        resp = client.delete('workflows/reana/{}/delete'.format(mock_workflow_id),
                             headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 404


@patch('cap.modules.workflows.views.list_reana_workflow_files')
@patch('cap.modules.workflows.utils.resolve_uuid')
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_workflow_list_files(mock_token, mock_uuid, mock_ls, app, get_record_pid_uuid,
                             create_reana_workflow, auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_workflow_id = '4e4e6afc-fd57-4f59-836a-40ae19d2d6d0'
    mock_uuid.return_value = "99dbe250-e0ce-41ec-a532-2b83d8529664"
    create_reana_workflow(uuid, mock_workflow_id)

    with app.test_client() as client:
        resp = client.get('workflows/reana/{}/files'.format(mock_workflow_id),
                          headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 200
        assert "files" in resp.json


@patch('cap.modules.workflows.views.delete_reana_workflow_files', side_effect=FileDeletionError())
@patch('cap.modules.workflows.utils.resolve_uuid')
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_workflow_delete_files_exception(mock_token, mock_uuid, mock_rm, app, get_record_pid_uuid,
                                         create_reana_workflow, auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_uuid.return_value = uuid
    mock_workflow_id = '4e4e6afc-fd57-4f59-836a-40ae19d2d6d0'
    mock_path = 'code/helloworld.py'
    create_reana_workflow(uuid, mock_workflow_id)

    with app.test_client() as client:
        resp = client.delete('workflows/reana/{}/files/{}'.format(mock_workflow_id, mock_path),
                             headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 400
        assert resp.json == {'message': '{} did not match any existing file. '
                                        'Aborting deletion.'.format(mock_path)}


@patch('cap.modules.workflows.views.download_reana_workflow_files', side_effect=Exception())
@patch('cap.modules.workflows.utils.resolve_uuid')
@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_workflow_download_files_exception(mock_token, mock_uuid, mock_download, app, get_record_pid_uuid,
                                           create_reana_workflow, auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_uuid.return_value = uuid
    mock_workflow_id = '7393815e-e3ef-4f7c-a0fe-a3a30a10ac2f'
    mock_path = 'code/code.py'
    create_reana_workflow(uuid, mock_workflow_id)

    with app.test_client() as client:
        resp = client.get('workflows/reana/{}/files/{}'.format(mock_workflow_id, mock_path),
                          headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 400
        assert resp.json == {'message': '{} did not match any existing file. '
                                        'Aborting download.'.format(mock_path)}
