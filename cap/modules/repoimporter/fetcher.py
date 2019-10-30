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
from github import UnknownObjectException

from ..deposit.errors import FileUploadError
from .api import GitAPI
from .models import GitRepository
from .utils import ensure_content_length, name_git_record, parse_url


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
    record_id = str(record.id)
    user_id = current_user.id

    data_url = data['url']
    for_download = data['for_download']
    for_connection = data['for_connection']

    # TODO fix ROOT integration
    if data_url.startswith("root://"):
        response, total = download_from_root(data_url)
        save_files_to_record(record_id, response, data_url, name, total)
        return

    # connect the repo with webhooks to follow the new releases
    api = GitAPI.create(url=data_url, user_id=user_id)

    if for_download:
        if data['type'] == 'repo':
            archived_repo_url = api.archive_repo_url(ref=api.last_commit)
            download_repo.delay(record_id, name, data_url, archived_repo_url)
        else:
            archived_file_url = api.archive_file_url(url_attrs['filepath'])
            download_file.delay(record_id, name, data_url, archived_file_url)

    # throw if no hooks
    if for_connection:
        download_metadata_and_connect(record_id, name, data_url, user_id, api)


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


def download_metadata_and_connect(record_id, filename, url, user_id, api):
    """Save metadata to db and enable webhooks integration."""
    try:
        # check if webhooks already exist
        if not len(api.webhooks):
            hook_id, hook_secret = api.create_webhook()
            GitRepository.create_or_get(api, url, user_id, record_id,
                                        hook_id, hook_secret, filename,
                                        for_download=True)
        else:
            raise FileUploadError(
                'Operation aborted. Webhook already exists '
                'for repo {}.'.format(url))
    except UnknownObjectException:
        raise FileUploadError(
            'Webhook integration aborted. The repo {} does not exist, '
            'or you do not have access rights to it'.format(url))


@shared_task(
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 5, 'countdown': 10}
)
def download_repo(record_id, filename, url, archived_repo_url):
    """Download a full git repo and save it to a record, as a .tar file."""
    response = requests.get(archived_repo_url, stream=True)

    # retrieve the data with the correct content length
    if 'Content-Length' not in response.headers:
        response = ensure_content_length(response)

    total = int(response.headers.get('Content-Length'))
    response = response.raw
    save_files_to_record(record_id, response, url, filename, total)


@shared_task(
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 5, 'countdown': 10}
)
def download_file(record_id, filename, url, archived_file_url):
    """Download a single file from a git repo."""
    token = archived_file_url.get('token')
    file_url = archived_file_url.get('url')
    response = requests.get(file_url, stream=True, headers={
        'Authorization': 'token {}'.format(token)
    }).raw
    response.decode_content = True

    size = archived_file_url.get('size')
    total = size or int(response.headers.get('Content-Length'))
    save_files_to_record(record_id, response, url, filename, total)
