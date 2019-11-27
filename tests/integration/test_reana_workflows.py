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

import json
from mock import patch

from flask_security import login_user
from jsonschema.exceptions import ValidationError

WORKFLOW_ID = 'abcd0123-0000-0000-abcd-000111222333'
WORKFLOW_JSON = {
    "workflow": {
        "type": "serial",
        "specification": {
            "steps": [{
                "environment": "python:2.7-slim",
                "commands": ["python '${helloworld}'"]
            }]
        }
    },
    "inputs": {
        "files": ["code/helloworld.py"],
        "parameters": {"helloworld": "code/helloworld.py"}
    },
    "outputs": {
        "files": ["results/results.txt"]
    }
}
WORKFLOW_CREATE_RESPONSE = {
    'message': 'Workflow workspace created',
    'workflow_id': WORKFLOW_ID,
    'workflow_name': 'demo.1'
}
WORKFLOW_STATUS = {
    "created": "2019-11-26T11:21:28", "id": WORKFLOW_ID, "logs": "{}",
    "name": "brown-jackdaw.1",
    "progress": {
        "current_command": None, "current_step_name": None,
        "failed": {"job_ids": [], "total": 0},
        "finished": {"job_ids": [], "total": 0},
        "run_started_at": None,
        "running": {"job_ids": [], "total": 0},
        "total": {"job_ids": [], "total": 0}
    }, "status": "created", "user": "9ee3a516-7e97-4e50-852f-636c0b881f3a"
}
WORKFLOW_LOGS = {
    'logs': '{"workflow_logs": "this is a tracking log at 2019-09-12T12:34:18.074285", '
            '"job_logs": {}, "engine_specific": null}',
    'user': '9ee3a516-7e97-4e50-852f-636c0b881f3a',
    'workflow_id': WORKFLOW_ID, 'name': 'demo.1'
}
WORKFLOW_FILES = [{
    'last-modified': '2019-09-12T11:25:30',
    'name': '_yadage/yadage_snapshot_backend.json', 'size': 2
}, {
    'last-modified': '2019-09-12T11:25:30',
    'name': '_yadage/yadage_snapshot_workflow.json', 'size': 1943
}]


@patch('cap.modules.workflows.views.ping', return_value='not ok!')
def test_reana_ping_not_ok(mock_ping, app, auth_headers_for_superuser, json_headers):
    with app.test_client() as client:
        resp = client.get('workflows/reana/ping',
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 400
        assert resp.json['message'] == 'not ok!'


@patch('cap.modules.workflows.views.ping', side_effect=Exception())
def test_reana_ping_exception(mock_ping, app, auth_headers_for_superuser,json_headers):
    with app.test_client() as client:
        resp = client.get('workflows/reana/ping',
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 503


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.generate_slug', return_value='slug-demo')
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_create_reana_workflow(mock_token, mock_slug, mock_created, app,
                               get_record_pid_uuid, auth_headers_for_superuser,
                               json_headers):

    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200
        assert resp.json == {
            'name': 'demo', 'reana_name': 'slug-demo',
            'status': 'created', 'run_number': 1,
            'workflow_id': WORKFLOW_ID,
            'workflow_json': WORKFLOW_JSON,
            'record_uuid': str(uuid),
            'depid': pid,
            'links': {
                'all': '/api/workflows/all/record/{}'.format(pid),
                'create': '/api/workflows/reana',
                'clone': '/api/workflows/reana/{}/clone'.format(WORKFLOW_ID),
                'delete': '/api/workflows/reana/{}'.format(WORKFLOW_ID),
                'files': '/api/workflows/reana/{}/files'.format(WORKFLOW_ID),
                'logs': '/api/workflows/reana/{}/logs'.format(WORKFLOW_ID),
                'self': '/api/workflows/reana/{}'.format(WORKFLOW_ID),
                'start': '/api/workflows/reana/{}/start'.format(WORKFLOW_ID),
                'status': '/api/workflows/reana/{}/status'.format(WORKFLOW_ID),
                'stop': '/api/workflows/reana/{}/stop'.format(WORKFLOW_ID)
            }
        }


@patch('cap.modules.workflows.views.create_workflow', side_effect=ValidationError('Error'))
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_create_reana_workflow_validation_error(mock_token, mock_created, app, get_record_pid_uuid,
                                                auth_headers_for_superuser, json_headers):

    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 400
        assert resp.json['message'] == 'Error'


@patch('cap.modules.workflows.views.create_workflow', side_effect=Exception())
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_create_reana_workflow_exception(mock_token, mock_created, app, get_record_pid_uuid,
                                         auth_headers_for_superuser, json_headers):

    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 503


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.generate_slug', return_value='slug-demo')
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_get_workflows_by_user(mock_token, mock_slug, mock_created, app,
                               get_record_pid_uuid,auth_headers_for_superuser,
                               json_headers):

    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        # create workflow
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200

        # retrieve workflow list
        resp = client.get('workflows/', headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200
        assert resp.json[0]['workflow_id'] == WORKFLOW_ID
        assert resp.json[0]['workflow_json'] == WORKFLOW_JSON


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.generate_slug', return_value='slug-demo')
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_get_workflows_by_record(mock_token, mock_slug, mock_created, app, get_record_pid_uuid,
                                 auth_headers_for_superuser, json_headers):

    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        # create workflow
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200

        # workflows found
        resp = client.get('workflows/all/record/{}'.format(pid),
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200
        assert resp.json[0]['workflow_id'] == WORKFLOW_ID
        assert resp.json[0]['workflow_json'] == WORKFLOW_JSON

        # no workflows found
        resp = client.get('workflows/all/record/{}'.format('FAKE-PID'),
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 404


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.generate_slug', return_value='slug-demo')
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_clone_reana_workflow(mock_token, mock_slug, mock_created, app, get_record_pid_uuid,
                              auth_headers_for_superuser, json_headers):

    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        # create workflow
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200

        # clone workflow
        resp = client.get('workflows/reana/{}/clone'.format(WORKFLOW_ID),
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200
        assert resp.json['name'] == 'demo'
        assert resp.json['workflow_json'] == WORKFLOW_JSON


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.get_workflow_status', return_value=WORKFLOW_STATUS)
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_reana_workflow_status(mock_token, mock_status, mock_create, app, get_record_pid_uuid,
                               auth_headers_for_superuser, json_headers):

    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        # create workflow
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200

        # get status
        resp = client.get('workflows/reana/{}/status'.format(WORKFLOW_ID),
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200
        assert resp.json == WORKFLOW_STATUS


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.get_workflow_logs', return_value=WORKFLOW_LOGS)
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_reana_workflow_logs(mock_token, mock_status, mock_create, app, users,
                             get_record_pid_uuid, auth_headers_for_superuser, json_headers):

    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_request_context():
        login_user(users['superuser'])

        with app.test_client() as client:
            # create workflow
            resp = client.post('workflows/reana', data=json.dumps(mock_data),
                               headers=auth_headers_for_superuser + json_headers)
            assert resp.status_code == 200

            # get logs
            resp = client.get('workflows/reana/{}/logs'.format(WORKFLOW_ID),
                              headers=auth_headers_for_superuser + json_headers)
            assert resp.status_code == 200
            assert resp.json == {
                'logs': {'engine_specific': None, 'job_logs': {},
                         'workflow_logs': u'this is a tracking log at 2019-09-12T12:34:18.074285'},
                'record_uuid': uuid,
                'workflow_id': WORKFLOW_ID,
                'name': 'demo.1'
            }


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.start_workflow', side_effect=Exception())
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_workflow_start_exception(mock_token, mock_start, mock_create, app, get_record_pid_uuid,
                                  auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        # create workflow
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200

        # start workflow
        resp = client.post('workflows/reana/{}/start'.format(WORKFLOW_ID),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 400
        assert resp.json['message'] == 'An exception has occurred, most probably ' \
                                       'the workflow cannot restart.'


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.stop_workflow', side_effect=Exception())
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_workflow_stop_exception(mock_token, mock_stop, mock_create, app, get_record_pid_uuid,
                                 auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        # create workflow
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200

        # stop workflow
        resp = client.post('workflows/reana/{}/stop'.format(WORKFLOW_ID),
                           headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 400
        assert resp.json['message'] == 'An exception has occurred, most probably ' \
                                       'the workflow is not running.'


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.delete_workflow', side_effect=Exception())
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_workflow_delete_exception(mock_token, mock_start, mock_create, app,
                                   get_record_pid_uuid, auth_headers_for_superuser,
                                   json_headers):
    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        # create workflow
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200

        # delete workflow with exception
        resp = client.delete('workflows/reana/{}/'.format(WORKFLOW_ID),
                             headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 400
        assert resp.json['message'] == 'Workflow {} does not exist. ' \
                                       'Aborting deletion.'.format(WORKFLOW_ID)


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.list_files', return_value=WORKFLOW_FILES)
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_workflow_list_files(mock_token, mock_ls, mock_create, app, get_record_pid_uuid,
                             auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_client() as client:
        # create workflow
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200

        # list uploaded files
        resp = client.get('workflows/reana/{}/files'.format(WORKFLOW_ID),
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200
        assert resp.json == {
            "files": [{
                "last-modified": "2019-09-12T11:25:30",
                "name": "_yadage/yadage_snapshot_backend.json", "size": 2
            }, {
                "last-modified": "2019-09-12T11:25:30",
                "name": "_yadage/yadage_snapshot_workflow.json", "size": 1943
            }],
            "record_uuid": uuid, "workflow_id": WORKFLOW_ID
        }


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.list_files', side_effect=Exception())
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_workflow_list_files_exception(mock_token, mock_ls, mock_create, app, users,
                                       auth_headers_for_superuser, json_headers,
                                       get_record_pid_uuid,):
    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)

    with app.test_request_context():
        login_user(users['superuser'])

        with app.test_client() as client:
            # create workflow
            resp = client.post('workflows/reana', data=json.dumps(mock_data),
                               headers=auth_headers_for_superuser + json_headers)
            assert resp.status_code == 200

            # list files with exception
            resp = client.get('workflows/reana/{}/files'.format(WORKFLOW_ID),
                              headers=auth_headers_for_superuser + json_headers)
            assert resp.status_code == 400
            assert resp.json['message'] == 'File list from workflow {} could not be ' \
                                           'retrieved. Aborting listing.'.format(WORKFLOW_ID)


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.download_file', side_effect=Exception())
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_workflow_download_file_exception(mock_token, mock_download, mock_create, app, users,
                                          get_record_pid_uuid, auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)
    mock_path = 'code/code.py'

    with app.test_request_context():
        login_user(users['superuser'])

        with app.test_client() as client:
            # create workflow
            resp = client.post('workflows/reana', data=json.dumps(mock_data),
                               headers=auth_headers_for_superuser + json_headers)
            assert resp.status_code == 200

            # download files with exception
            resp = client.get('workflows/reana/{}/files/{}'.format(WORKFLOW_ID, mock_path),
                              headers=auth_headers_for_superuser + json_headers)
            assert resp.status_code == 400
            assert resp.json['message'] == '{} did not match any existing file.' \
                                           ' Aborting download.'.format(mock_path)


@patch('cap.modules.workflows.views.create_workflow', return_value=WORKFLOW_CREATE_RESPONSE)
@patch('cap.modules.workflows.views.upload_file', side_effect=KeyError())
@patch('cap.modules.workflows.views.get_reana_token', return_value='test-token')
def test_workflow_upload_files_exception(mock_token, mock_upload, mock_create, app,
                                         get_record_pid_uuid, auth_headers_for_superuser,
                                         json_headers):
    pid, uuid = get_record_pid_uuid
    mock_data = dict(name="demo", pid=pid, workflow_json=WORKFLOW_JSON)
    mock_upload = {
        'files_to_upload': [{
            'path': 'tmp/example1.txt',
            'new_path': 'data/example1.txt'
        }]
    }

    with app.test_client() as client:
        # create workflow
        resp = client.post('workflows/reana', data=json.dumps(mock_data),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200

        # upload files with exception
        resp = client.post('workflows/reana/{}/files/upload'.format(WORKFLOW_ID),
                           data=json.dumps(mock_upload),
                           headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200
        assert resp.json == {'workflow_id': WORKFLOW_ID,
                             'successful': [],
                             'errors': ['tmp/example1.txt']}
