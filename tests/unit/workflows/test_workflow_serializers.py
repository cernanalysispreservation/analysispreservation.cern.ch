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

from __future__ import absolute_import, print_function
from cap.modules.workflows.serializers import ReanaWorkflowLogsSchema, ReanaWorkflowSchema


def test_reana_workflow_schema(app):
    workflow = {
        'name': 'demo',
        'reana_name': 'slug-demo-name',
        'workflow_id': 'abcd0123-0000-0000-abcd-000111222333',
        'workflow_json': {
            "workflow": {
                "type": "serial",
                "specification": {
                    "steps": [{"environment": "python:2.7-slim",
                               "commands": ["python '${helloworld}'"]}]}
            },
            "inputs": {"files": ["code/helloworld.py"],
                       "parameters": {"helloworld": "code/helloworld.py"}},
            "outputs": {"files": ["results/results.txt"]}
        },
        'run_number': 1,
        'status': 'created',

        'record_uuid': '9ee3a516-7e97-4e50-852f-636c0b881f3a',
        'depid': 'e10e543aa2e3469ab0367e97ff931a69',
        'user_id': 1,
    }

    serializer = ReanaWorkflowSchema()
    result = serializer.dump(workflow).data
    assert result == {
        u'depid': u'e10e543aa2e3469ab0367e97ff931a69',
        u'links': {'all': '/api/workflows/all/record/e10e543aa2e3469ab0367e97ff931a69',
                   'clone': '/api/workflows/reana/abcd0123-0000-0000-abcd-000111222333/clone',
                   'create': '/api/workflows/reana',
                   'delete': '/api/workflows/reana/abcd0123-0000-0000-abcd-000111222333',
                   'files': '/api/workflows/reana/abcd0123-0000-0000-abcd-000111222333/files',
                   'logs': '/api/workflows/reana/abcd0123-0000-0000-abcd-000111222333/logs',
                   'self': '/api/workflows/reana/abcd0123-0000-0000-abcd-000111222333',
                   'start': '/api/workflows/reana/abcd0123-0000-0000-abcd-000111222333/start',
                   'status': '/api/workflows/reana/abcd0123-0000-0000-abcd-000111222333/status',
                   'stop': '/api/workflows/reana/abcd0123-0000-0000-abcd-000111222333/stop'},
        u'name': u'demo', u'record_uuid': u'9ee3a516-7e97-4e50-852f-636c0b881f3a',
        u'run_number': 1, u'status': u'created',
        u'workflow_id': u'abcd0123-0000-0000-abcd-000111222333',
        u'workflow_json': {
            'inputs': {'files': ['code/helloworld.py'],
                       'parameters': {'helloworld': 'code/helloworld.py'}},
            'outputs': {'files': ['results/results.txt']},
            'workflow': {
                'specification': {
                    'steps': [{'commands': ["python '${helloworld}'"], 'environment': 'python:2.7-slim'}]},
                'type': 'serial'}},
        u'reana_name': u'slug-demo-name'
    }


def test_reana_logs_schema():
    logs = {
        'logs': '{"workflow_logs": "this is a tracking log at 2019-09-12T12:34:18.074285", '
                '"job_logs": {}, "engine_specific": null}',
        'user': '9ee3a516-7e97-4e50-852f-636c0b881f3a',
        'workflow_id': 'abcd0123-0000-0000-abcd-000111222333', 'name': 'demo.1'
    }

    serializer = ReanaWorkflowLogsSchema()
    result = serializer.dump(logs).data
    assert result == {
        'logs': {'engine_specific': None,
                 'job_logs': {},
                 'workflow_logs': 'this is a tracking log at 2019-09-12T12:34:18.074285'},
        'workflow_id': 'abcd0123-0000-0000-abcd-000111222333',
        'name': 'demo.1'
    }
