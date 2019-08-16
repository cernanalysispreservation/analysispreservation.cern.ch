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
from uuid import uuid4

from invenio_pidstore.models import PersistentIdentifier

from cap.modules.reana.models import ReanaJob


#################
# api/reana/create
#################
def test_create_workflow_returns_404_when_record_does_not_exist(
        client, auth_headers_for_superuser, json_headers):
    data = {
        'record_id': 'wrong_pid',
        'workflow_name': 'test_workflow',
        'workflow_json': {}
    }

    resp = client.post('/reana/create',
                       data=json.dumps(data),
                       headers=auth_headers_for_superuser + json_headers)

    assert resp.status_code == 404


#################
# api/reana/jobs
#################
def test_get_reana_jobs_when_user_not_logged_in_returns_401(
        client, users, record):
    resp = client.get('/reana/jobs/{}'.format(
        record['_deposit']['pid']['value']))

    assert resp.status_code == 401


def test_get_reana_jobs_when_recid_doesnt_exists_returns_404(
        client, auth_headers_for_superuser):
    resp = client.get('/reana/jobs/{}'.format('non-existing-pid'),
                      headers=auth_headers_for_superuser)

    assert resp.status_code == 404


def test_get_reana_jobs_when_no_jobs_returns_empty_list(
        client, auth_headers_for_superuser, record):
    pid = record['_deposit']['pid']['value']

    resp = client.get('/reana/jobs/{}'.format(pid),
                      headers=auth_headers_for_superuser)

    assert resp.json == []


def test_get_reana_jobs_returns_list_with_user_jobs(client, db, users,
                                                    auth_headers_for_superuser,
                                                    record):
    pid = record['_deposit']['pid']['value']
    uuid = PersistentIdentifier.get('recid', pid).object_uuid
    id_ = uuid4()
    db.session.add(
        ReanaJob(user_id=users['superuser'].id,
                 record_id=uuid,
                 reana_id=id_,
                 name='my_workflow_run',
                 params={
                     'param_1': 1,
                     'param_2': 2
                 }))
    db.session.commit()

    resp = client.get('/reana/jobs/{}'.format(pid),
                      headers=auth_headers_for_superuser)

    serialized_reana_job = {
        'name': 'my_workflow_run',
        'params': {
            'param_1': 1,
            'param_2': 2
        },
        'output': {},
        'reana_id': str(id_)
    }

    assert resp.json == [serialized_reana_job]
