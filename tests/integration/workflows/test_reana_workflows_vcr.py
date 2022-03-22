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
from mock import patch
import pytest

from reana_client.errors import FileDeletionError


@pytest.mark.vcr()
def test_reana_workflow_logs(app, get_record_pid_uuid, create_reana_workflow,
                             auth_headers_for_superuser, json_headers):
    _, uuid = get_record_pid_uuid
    mock_workflow_id = '4e4e6afc-fd57-4f59-836a-40ae19d2d6d0'
    create_reana_workflow(uuid, mock_workflow_id)

    with app.test_client() as client:
        resp = client.get('workflows/reana/{}/logs'.format(mock_workflow_id),
                          headers=auth_headers_for_superuser + json_headers)
        assert resp.status_code == 200
        assert resp.json['workflow_id'] == mock_workflow_id


@pytest.mark.vcr()
@patch('cap.modules.workflows.views.workflow_start', side_effect=Exception())
def test_workflow_start_exception(mock_start, app, get_record_pid_uuid, create_reana_workflow,
                                  auth_headers_for_superuser, json_headers):
    _, uuid = get_record_pid_uuid
    mock_workflow_id = '4e4e6afc-fd57-4f59-836a-40ae19d2d6d0'
    create_reana_workflow(uuid, mock_workflow_id)
    mock_data = {'input_parameters': {}, 'operational_options': {}}

    with app.test_client() as client:
        resp = client.post('workflows/reana/{}/start'.format(mock_workflow_id),
                           data=json.dumps(mock_data), headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 400
        assert resp.json == {'message': 'An exception has occured, most probably '
                                        'the workflow cannot start/restart.'}


@pytest.mark.vcr()
@patch('cap.modules.workflows.views.workflow_stop', side_effect=Exception())
def test_workflow_stop_exception(mock_stop, app, get_record_pid_uuid,
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


@pytest.mark.vcr()
def test_workflow_list_files(app, get_record_pid_uuid, create_reana_workflow,
                             auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_workflow_id = '4e4e6afc-fd57-4f59-836a-40ae19d2d6d0'
    create_reana_workflow(uuid, mock_workflow_id)

    with app.test_client() as client:
        resp = client.get('workflows/reana/{}/files'.format(mock_workflow_id),
                          headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 200
        assert "files" in resp.json


@pytest.mark.vcr()
@patch('cap.modules.workflows.views.delete_workflow_files', side_effect=FileDeletionError())
def test_workflow_delete_files_exception(mock_rm, app, get_record_pid_uuid,
                                         create_reana_workflow, auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_workflow_id = '4e4e6afc-fd57-4f59-836a-40ae19d2d6d0'
    mock_path = 'code/helloworld.py'
    create_reana_workflow(uuid, mock_workflow_id)

    with app.test_client() as client:
        resp = client.delete('workflows/reana/{}/files/{}'.format(mock_workflow_id, mock_path),
                             headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 400
        assert resp.json == {'message': '{} did not match any existing file. '
                                        'Aborting deletion.'.format(mock_path)}


@pytest.mark.vcr()
@patch('cap.modules.workflows.views.download_workflow_files', side_effect=Exception())
def test_workflow_download_files_exception(mock_download, app, get_record_pid_uuid,
                                           create_reana_workflow, auth_headers_for_superuser, json_headers):
    pid, uuid = get_record_pid_uuid
    mock_workflow_id = '7393815e-e3ef-4f7c-a0fe-a3a30a10ac2f'
    mock_path = 'code/code.py'
    create_reana_workflow(uuid, mock_workflow_id)

    with app.test_client() as client:
        resp = client.get('workflows/reana/{}/files/{}'.format(mock_workflow_id, mock_path),
                          headers=auth_headers_for_superuser + json_headers)

        assert resp.status_code == 400
        assert resp.json == {'message': '{} did not match any existing file. '
                                        'Aborting download.'.format(mock_path)}
