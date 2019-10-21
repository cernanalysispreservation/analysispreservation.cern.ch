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

"""Repo downloader utils."""

from __future__ import absolute_import, print_function

import requests
from celery import shared_task
from flask_login import current_user
from invenio_db import db
from invenio_files_rest.models import FileInstance, ObjectVersion

from ..deposit.errors import FileUploadError
from .api import GitAPI
from .models import GitRepository
from .utils import ensure_content_length, name_git_record, parse_url
from .views import enable_webhook


def fetch_from_git(data, record):
    """
    Fetches data from GitHub/GitLab.

    It can download files/repos and save them to a record, as well as use the
    repo metadata to create a webhook that updates the db on repo changes.
    """
    try:
        # use the name/branch to create  file key for the record
        # if it cannot be parsed, it is not a valid url
        url_attrs = parse_url(data['url'])
        name = name_git_record(url_attrs, data['type'])
    except ValueError:
        raise FileUploadError('URL could not be parsed. Try again with '
                              'correct GitHub / CERN GitLab link.')

    data_url = data['url']
    record_id = str(record.id)
    for_download = data['for_download']
    for_connection = data['for_connection']

    # TODO fix ROOT integration
    if data_url.startswith("root://"):
        response, total = download_from_root(data_url)
        save_files_to_record(record_id, response, data_url, name, total)
        return

    # connect the repo with webhooks to follow the new releases
    if for_connection:
        download_metadata_and_connect(data_url, record_id, name)

    if for_download:
        if data['type'] == 'repo':
            download_repo.delay(data_url, record_id, name)
        else:
            filepath = url_attrs['filepath']
            download_file.delay(data_url, record_id, name, filepath)


def save_files_to_record(record_id, response, url, filename, total):
    """Commit file to the record."""
    from cap.modules.deposit.api import CAPDeposit
    record = CAPDeposit.get_record(record_id)

    # create a FileInstance in the record, to keep the data
    _files = record.files
    obj = ObjectVersion.create(bucket=_files.bucket, key=filename)
    obj.file = FileInstance.create()
    _files.flush()
    _files[filename]['source_url'] = url

    _file = _files[filename].file
    _file.set_contents(
        response,
        default_location=record.files.bucket.location.uri,
        size=total
    )
    _file.writable = True
    print('\nFile {} saved with size {}\n'.format(filename, total))
    db.session.commit()


def download_from_root(url):
    """Get data from a ROOT integration."""
    from xrootdpyfs.xrdfile import XRootDPyFile
    response = XRootDPyFile(url, mode='r-')
    total = response.size
    return response, total


def download_metadata_and_connect(url, record_id, name):
    """Save metadata to db and enable webhooks integration."""
    api = GitAPI.create(url=url)
    repo = GitRepository.create_or_get(api, url, current_user.id,
                                       record_id, name,
                                       for_download=True)
    if not repo.hook:
        enable_webhook(api.repo_id, branch=api.branch)


@shared_task(
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 5, 'countdown': 10}
)
def download_repo(url, record_id, name, ref=None):
    """Download a full git repo and save it to a record, as a .tar file."""
    api = GitAPI.create(url=url)
    if not ref:
        ref = api.last_commit

    repo_url = api.archive_repo_url(ref=ref)
    response = requests.get(repo_url, stream=True)

    # retrieve the data with the correct content length
    if 'Content-Length' not in response.headers:
        response = ensure_content_length(response)

    total = int(response.headers.get('Content-Length'))
    response = response.raw
    save_files_to_record(record_id, response, url, name, total)


@shared_task(
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 5, 'countdown': 10}
)
def download_file(url, record_id, name, filepath):
    """Download a single file from a git repo."""
    api = GitAPI.create(url=url)
    archived_file = api.archive_file_url(filepath)

    token = archived_file.get('token')
    file_url = archived_file.get('url')
    response = requests.get(file_url, stream=True, headers={
        'Authorization': 'token {}'.format(token)
    }).raw
    response.decode_content = True

    size = archived_file.get('size')
    total = size or int(response.headers.get('Content-Length'))
    save_files_to_record(record_id, response, url, name, total)
