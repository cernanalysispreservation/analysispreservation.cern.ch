# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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

from pytest import raises
from cap.modules.reana.models import ReanaJob
from sqlalchemy.orm.exc import NoResultFound
from uuid import uuid4


def test_get_jobs_when_no_jobs_for_user_returns_empty_list(users, record_metadata):
    assert ReanaJob.get_jobs(users['superuser'].id,
                             record_metadata.id) == []


def test_get_record_id_from_workflow_id_when_no_jobs_for_user_raises_no_result_found(db):
    with raises(NoResultFound):
        ReanaJob.get_record_from_workflow_id(None)


def test_get_jobs_when_record_id_given_returns_all_the_jobs_created_by_this_user(db,
                                                                                 users,
                                                                                 record_metadata):
    reana_job_1 = ReanaJob(user=users['superuser'],
                           record=record_metadata,
                           reana_id=uuid4(),
                           name='my_workflow_run_1')
    db.session.add(reana_job_1)
    reana_job_2 = ReanaJob(user=users['superuser'],
                           record=record_metadata,
                           reana_id=uuid4(),
                           name='my_workflow_run_1')
    db.session.add(reana_job_2)
    reana_job_3 = ReanaJob(user=users['cms_user'],
                           record=record_metadata,
                           reana_id=uuid4(),
                           name='another_users_workflow_run')
    db.session.add(reana_job_3)
    db.session.commit()

    jobs = ReanaJob.get_jobs(users['superuser'].id, record_metadata.id)

    assert len(jobs) == 2
    assert reana_job_1 in jobs
    assert reana_job_2 in jobs
    assert reana_job_3 not in jobs
