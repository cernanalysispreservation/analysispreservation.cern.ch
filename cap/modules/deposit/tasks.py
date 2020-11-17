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
"""Tasks."""

from __future__ import absolute_import, print_function

import requests
from flask import current_app
from celery import shared_task
from invenio_db import db
from invenio_files_rest.models import FileInstance, ObjectVersion


@shared_task(autoretry_for=(Exception, ),
             retry_kwargs={
                 'max_retries': 5,
                 'countdown': 10
             })
def upload_to_zenodo(files, bucket, token, zenodo_depid, zenodo_bucket_url):
    """Upload to Zenodo the files the user selected."""
    for filename in files:
        file_obj = ObjectVersion.get(bucket, filename)
        file_ins = FileInstance.get(file_obj.file_id)

        with open(file_ins.uri, 'rb') as fp:
            file = requests.put(
                url=f'{zenodo_bucket_url}/{filename}',
                data=fp,
                params=dict(access_token=token),
            )

            if not file.ok:
                current_app.logger.error(
                    f'Uploading file {filename} to deposit {zenodo_depid} '
                    f'failed with {file.status_code}.')
