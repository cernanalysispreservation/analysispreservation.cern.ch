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
import json
from six import BytesIO
from mock import patch


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


@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_validate_reana_workflow_spec(mock_token, app, users, create_deposit,
                                      auth_headers_for_superuser, json_headers):
    deposit = create_deposit(users['superuser'], 'cms-analysis', experiment='CMS')
    mock_data = b"""
        version: 0.3.0
        inputs:
          files:
            - code/helloworld.py
            - data/names.txt
          parameters:
            helloworld: code/helloworld.py
            inputfile: data/names.txt
            outputfile: results/greetings.txt
            sleeptime: 0
        workflow:
          type: serial
          specification:
            steps:
            - environment: 'python:2.7-slim'
              commands:
                - python "${helloworld}"
                  --inputfile "${inputfile}"
                  --outputfile "${outputfile}"
                  --sleeptime ${sleeptime}
        outputs:
          files:
            - results/greetings.txt
    """
    deposit.files['reana.yaml'] = BytesIO(mock_data)
    pid = deposit['_deposit']['id']
    mock_args = {
        "pid": pid,
        "files_to_validate": [
            {
                "path":"reana.yaml"
            }
        ]
    }

    with app.test_client() as client:
        resp = client.post('workflows/reana/validate', data=json.dumps(mock_args),
                           headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 200
        assert resp.json['errors'] == {}


@patch('cap.modules.workflows.utils.get_reana_token', return_value='test-token')
def test_validate_reana_workflow_spec_wrong(mock_token, app, users, create_deposit,
                                      auth_headers_for_superuser, json_headers):
    deposit = create_deposit(users['superuser'], 'cms-analysis', experiment='CMS')
    mock_data = b"""
        version: 0.3.0
        inputs:
          files:
            - code/helloworld.py
            - data/names.txt
          parameters:
            helloworld: code/helloworld.py
            inputfile: data/names.txt
            outputfile: results/greetings.txt
            sleeptime: 0
        workflow:
          specification:
            steps:
            - environment: 'python:2.7-slim'
              commands:
                - python "${helloworld}"
                  --inputfile "${inputfile}"
                  --outputfile "${outputfile}"
                  --sleeptime ${sleeptime}
        outputs:
          files:
            - results/greetings.txt
    """
    deposit.files['reana.yaml'] = BytesIO(mock_data)
    pid = deposit['_deposit']['id']
    mock_args = {
        "pid": pid,
        "files_to_validate": [
            {
                "path":"reana.yaml"
            }
        ]
    }

    with app.test_client() as client:
        resp = client.post('workflows/reana/validate', data=json.dumps(mock_args),
                           headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 200
        assert resp.json['errors'] == {"reana.yaml": "'type' is a required property"}
