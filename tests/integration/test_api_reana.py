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

from cap.modules.reana.models import ReanaJob


#################
# api/reana/jobs
#################
def test_get_reana_jobs_when_user_not_logged_in_returns_401(app, users, deposit):
    with app.test_client() as client:
        resp = client.get('/reana/jobs/{}'.format(deposit.id))

        assert resp.status_code == 401

def test_get_reana_jobs_when_depid_doesnt_exists_returns_404(app,
                                                             auth_headers_for_superuser):
    with app.test_client() as client:
        resp = client.get('/reana/jobs/{}'.format('non-existing-pid'),
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 404

def test_get_reana_jobs_when_no_jobs_returns_empty_list(app, auth_headers_for_superuser,
                                                        deposit):
    with app.test_client() as client:
        resp = client.get('/reana/jobs/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_superuser)

        assert json.loads(resp.data) == []

def test_get_reana_jobs_returns_list_with_user_jobs(db, app, users,
                                                    auth_headers_for_superuser,
                                                    deposit):
    db.session.add(ReanaJob(
        user=users['superuser'],
        record=deposit.get_record_metadata(),
        name='my_workflow_run',
        params={
            'param_1': 1,
            'param_2': 2
    }))
    db.session.commit()

    with app.test_client() as client:
        resp = client.get('/reana/jobs/{}'.format(deposit['_deposit']['id']),
                          headers=auth_headers_for_superuser)

        serialized_reana_job = {
            'name': 'my_workflow_run',
            'params':{
                'param_1': 1,
                'param_2': 2
            },
            'output': {}
        }

        assert json.loads(resp.data) == [serialized_reana_job]
