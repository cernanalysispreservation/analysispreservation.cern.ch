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


"""CAP Deposit utils."""

from __future__ import absolute_import, print_function
from tempfile import SpooledTemporaryFile
import shutil

import requests
from invenio_db import db
from celery import shared_task

from cap.config import FILES_URL_MAX_SIZE
from cap.modules.repoimporter.git_importer import GitImporter


def name_git_record(data, type):
    """Create a name for the git repo / file downloaded."""
    name = '{}_{}_{}'.format(data['owner'],
                             data['repo'],
                             data['branch'])

    return name + '.tar.gz' \
        if type == 'repo' \
        else '{}_{}'.format(name, data['filename'])


def clean_empty_values(data):
    """Remove empty values from model."""
    if not isinstance(data, (dict, list)):
        return data
    if isinstance(data, list):
        return [v for v in (clean_empty_values(v) for v in data) if v]
    return {k: v for k, v in (
        (k, clean_empty_values(v)) for k, v in data.items()) if v}


@shared_task(max_retries=5)
def download_from_git(record, name, url_attrs, data):
    """Download the contents of a url, either local or from git (file/repo)."""
    data_type, data_url = data['type'], data['url']

    # differentiate between local files and urls
    if data_url.startswith("root://"):
        from xrootdpyfs.xrdfile import XRootDPyFile
        response = XRootDPyFile(data_url, mode='r-')
        total = response.size
    else:
        try:
            git = GitImporter(url=data_url)
            if data_type == 'repo':
                url = git.archive_repo_url()
                response = requests.get(url, stream=True)

                if 'Content-Length' not in response.headers:
                    response = ensure_content_length(response)

                total = int(response.headers.get('Content-Length'))
                response = response.raw
            else:
                archived_file = git.archive_file_url(url_attrs['filepath'])
                url = archived_file.get('url', None)
                size = archived_file.get('size', None)
                token = archived_file.get('token', None)
                headers = {'Authorization': 'token {}'.format(token)}

                response = requests.get(url, stream=True, headers=headers).raw
                response.decode_content = True
                total = size or int(response.headers.get('Content-Length'))
        except TypeError as exc:
            download_from_git.retry(exc=exc, countdown=10)

    task_commit(record, response, name, total)


def task_commit(record, response, filename, total):
    """Commit file to the record."""
    record.files[filename].file.set_contents(
        response,
        default_location=record.files.bucket.location.uri,
        size=total
    )
    db.session.commit()


def ensure_content_length(resp):
    """
    Add Content-Length when it is not present.

    Streams content into a temp file, and replaces the original socket with it.
    """
    spool = SpooledTemporaryFile(FILES_URL_MAX_SIZE)
    shutil.copyfileobj(resp.raw, spool)
    resp.headers['Content-Length'] = str(spool.tell())
    spool.seek(0)

    # replace the original socket with temp file
    resp.raw._fp.close()
    resp.raw._fp = spool
    return resp
