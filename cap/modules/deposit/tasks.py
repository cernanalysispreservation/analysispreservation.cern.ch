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
"""Zenodo Upload Tasks."""

from __future__ import absolute_import, print_function

import requests
from flask import current_app
from celery import chord, group, current_task, shared_task

from invenio_files_rest.models import FileInstance
from invenio_db import db

from cap.modules.experiments.errors import ExternalAPIException
from .utils import get_zenodo_deposit_from_record


def create_zenodo_upload_tasks(files, recid, token,
                               zenodo_depid, zenodo_bucket_url):
    """Create the upload tasks and get the results."""
    current_app.logger.info(
        f'Uploading files to Zenodo {zenodo_depid}: {files}.')

    # the only way to have a task that waits for
    # other tasks to finish is the `chord` structure
    upload_callback = save_results_to_record.s(depid=zenodo_depid, recid=recid)
    upload_tasks = group(
        upload.s(filename, recid, token, zenodo_bucket_url)
        for filename in files
    )

    chord(upload_tasks, upload_callback).delay()


@shared_task(autoretry_for=(Exception, ),
             retry_kwargs={
                 'max_retries': 5,
                 'countdown': 10
             })
def upload(filename, recid, token, zenodo_bucket_url):
    """Upload file to Zenodo."""
    from cap.modules.deposit.api import CAPDeposit
    record = CAPDeposit.get_record(recid)

    file_obj = record.files[filename]
    file_ins = FileInstance.get(file_obj.file_id)
    task_id = current_task.request.id

    with open(file_ins.uri, 'rb') as fp:
        try:
            resp = requests.put(
                url=f'{zenodo_bucket_url}/{filename}',
                data=fp,
                params=dict(access_token=token),
            )

            current_app.logger.error(
                f'{task_id}: Zenodo upload of file `{filename}`: {resp.status_code}.')  # noqa

            status = resp.status_code
            msg = resp.json()
        except (ValueError, ExternalAPIException) as err:
            status = 'FAILED'
            msg = str(err)

            current_app.logger.error(
                f'{task_id}: Something went wrong with the task:\n{msg}')
        finally:
            return {
                'task_id': task_id,
                'result': {'file': filename, 'status': status, 'message': msg}
            }


@shared_task(autoretry_for=(Exception, ),
             retry_kwargs={
                 'max_retries': 5,
                 'countdown': 10
             })
def save_results_to_record(tasks, depid, recid):
    """Save the results of uploading to the record."""
    from cap.modules.deposit.api import CAPDeposit
    record = CAPDeposit.get_record(recid)

    # update the tasks of the specified zenodo deposit (filename: status)
    # this way we can attach multiple deposits
    zenodo = get_zenodo_deposit_from_record(record, depid)
    for task in tasks:
        zenodo['tasks'][task['task_id']] = task['result']

    record.commit()
    db.session.commit()

    current_app.logger.info(
        f'COMPLETED: Zenodo {depid} uploads:\n{tasks}')
