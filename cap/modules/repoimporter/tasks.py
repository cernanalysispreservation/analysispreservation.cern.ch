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
from celery import shared_task
from invenio_db import db

from cap.modules.repoimporter.errors import GitError

from .factory import create_git_api
from .models import GitWebhookSubscriber
from .utils import ensure_content_length


@shared_task(autoretry_for=(Exception, ),
             retry_kwargs={
                 'max_retries': 5,
                 'countdown': 10
             })
def download_repo(record_id, filename, download_url, auth_headers=None):
    """Download a repository as a .tar file under record files."""
    response = requests.get(download_url, stream=True, headers=auth_headers)

    # retrieve the data with the correct content length
    if 'Content-Length' not in response.headers:
        response = ensure_content_length(response)

    size = int(response.headers.get('Content-Length'))
    response = response.raw

    from cap.modules.deposit.api import CAPDeposit
    record = CAPDeposit.get_record(record_id)

    # temporary workaround, we save empty file, when downloading failed
    # so we can show it in UI (with tag FAILED)
    failed = True if response.status != 200 else False
    if failed:
        print(f'Downloading content from {download_url}'
              f'failed ({response.status}).')

    record.save_file(response, filename, size, failed)


@shared_task(autoretry_for=(Exception, ),
             retry_kwargs={
                 'max_retries': 5,
                 'countdown': 10
             })
def download_repo_file(record_id,
                       filename,
                       download_url,
                       size=None,
                       auth_headers=None):
    """Download a single file from a git repo under record files."""
    response = requests.get(download_url, stream=True,
                            headers=auth_headers).raw

    response.decode_content = True
    size = size or int(response.headers.get('Content-Length'))

    from cap.modules.deposit.api import CAPDeposit
    record = CAPDeposit.get_record(record_id)

    # temporary workaround, we save empty file, when downloading failed
    # so we can show it in UI (with tag FAILED)
    failed = True if response.status != 200 else False
    if failed:
        print(f'Downloading content from {download_url}'
              f'failed ({response.status}).')

    record.save_file(response, filename, size, failed)


@shared_task
def ping_webhooks():
    subscribers = GitWebhookSubscriber.query.filter_by(status='active').all()

    for subscriber in subscribers:
        repo = subscriber.repo
        api = create_git_api(repo.host, repo.owner, repo.name,
                             subscriber.webhook.branch, subscriber.user_id)
        try:
            api.ping_webhook(subscriber.webhook.external_id)
        except GitObjectNotFound:
            subscriber.status = 'deleted'
            db.session.commit()
