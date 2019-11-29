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
from mock import patch
import json
import tarfile
import responses

from invenio_files_rest.models import ObjectVersion
from cap.modules.repoimporter.models import GitRepository


REPO = 'https://github.com/cernanalysispreservation/test-repo'
FILE = 'https://github.com/cernanalysispreservation/test-repo/blob/master/README.md'

REPO_BODY = b'\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\x03\xed\xd4\xc1N\x830\x18' \
            b'\x07p\xce>\x05/\x80\xc2\xb7\xb6\xc0a\x07\x13w\xf4\xe2\x0b,-\x94' \
            b'\xb9\x04(i\xbbE\xdf\xde\xa2^\xc4\xa0\x99a1\xcb\xfe\xbfKIK' \
            b'\xd2~\xf9\xf7\xeb _\xb6\xbb\xd6(\xd9n\x9f\xb5\xac\xb5\x8d\x96' \
            b'\x97\x06B\x88\xf71\x98\x8ea\x91E\xd9\x8a\x0bN\x82\xe7\x9c\x87' \
            b'\xf9\x8c\xf1\x15\x8fvg8\xcb7\x07\xe7\xa5\r[Zc\xfcO\xff\xfd' \
            b'\xb6>-\xeeBp\x8a+\xd3u\xba\xf7kE*WT\x88F5\xacH\xd3\xa6P\xaa\xccKQ' \
            b'\xc9\xb4.\xa9\x0c\x93\xa9*$k\xea\x9b\xff>3,\xa7\xd2\xb6\x97' \
            b'\xbdl_\xdd\xde\rV;m\x8f\xd2\xefM\x9fx\xed|b\xf5`\x92\xcf{q\xf7' \
            b'\xe7=\xc6~\xc8s>\xdf\xff\xe1\xfbk\xffSF\xc4"\xbe`\x9d\xb3\xae' \
            b'\xbc\xffO\xc8\xffis\xff\xf0\xb8\xb9\xed\xeaS\xf7\xf8x\xff\xd9|' \
            b'\xfeD\xd3\xfc\x89\x8d\xf7\xe5\x1c\x05O]y\xfec\xcc\xf1\x18s\xdc' \
            b'\x18\x1bWr\xc0\xeb\x0e\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' \
            b'\x00\x00\x00\x00pq\xde\x00h\xd6\xb3\xb6\x00(\x00\x00'

FILE_BODY = b'\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\x03+I-.Q(J-\xc8WH' \
            b'\xcb/RHN,\xe0\x02\x00\xeb\xd5!\xe0\x12\x00\x00\x00'


class MockGithub(object):
    last_commit = 'test_sha1'
    repo_id = 'repo-id'

    host = 'host'
    owner = 'owner'
    repo = 'repo'
    branch = 'branch'

    def create_webhook(self):
        return 'hook-id', 'hook-secret'

    def archive_repo_url(self, ref=None):
        return 'https://example.com/repo'

    def archive_file_url(self, path=None):
        return {'url': 'https://example.com/file',
                'size': 18,
                'token': 'test-token'}


@patch('cap.modules.repoimporter.api.GitHubAPI', return_value=MockGithub())
@responses.activate
def test_download_archive(mock_git_api, client, db, get_git_attributes, json_headers):
    """
    Given a git url, check if the link correctly identifies the repo, downloads
    the data, and then CAP is able to retrieve them from a bucket.
    """
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {
        'url': REPO,
        'type': 'repo',
        'download': True,
        'webhook': False
    }

    responses.add(responses.GET,
                  'https://example.com/repo',
                  body=REPO_BODY,
                  content_type='application/x-gzip',
                  headers={
                      'Transfer-Encoding': 'chunked',
                      'Content-Length': '287'
                  },
                  stream=True,
                  status=200)

    resp = client.post('/deposits/{}/actions/upload'.format(pid),
                       headers=headers + json_headers,
                       data=json.dumps(data))
    assert resp.status_code == 201

    resp = client.get('/deposits/{}/files'.format(pid), headers=headers)
    assert resp.status_code == 200

    obj = ObjectVersion.get(bucket.id, 'cernanalysispreservation_test-repo_master.tar.gz')
    tar_obj = tarfile.open(obj.file.uri)
    repo_file_name = tar_obj.getmembers()[1]
    repo_content = tar_obj.extractfile(repo_file_name).read()

    assert repo_content == b'test repo for cap\n'


@patch('cap.modules.repoimporter.api.GitHubAPI', return_value=MockGithub())
@responses.activate
def test_download_file(mock_git_api, client, db, get_git_attributes, json_headers):
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {
        'url': FILE,
        'type': 'url',
        'download': True,
        'webhook': False
    }

    responses.add(responses.GET,
                  'https://example.com/file',
                  body=FILE_BODY,
                  content_type='text/plain',
                  headers={
                      'Content-Length': '38',
                      'Content-Encoding': 'gzip',
                      'Content-Type': 'text/plain; charset=utf-8'
                  },
                  stream=True,
                  status=200)

    resp = client.post('/deposits/{}/actions/upload'.format(pid),
                       headers=headers + json_headers,
                       data=json.dumps(data))
    assert resp.status_code == 201

    resp = client.get('/deposits/{}/files'.format(pid), headers=headers)
    assert resp.status_code == 200

    obj = ObjectVersion.get(bucket.id, 'cernanalysispreservation_test-repo_master_README.md')
    open_file = open(obj.file.uri)
    repo_content = open_file.read()
    assert repo_content == 'test repo for cap\n'


@patch('cap.modules.repoimporter.api.GitHubAPI', return_value=MockGithub())
@responses.activate
def test_connect_repo(mock_git_api, client, db, get_git_attributes, json_headers):
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {
        'url': REPO,
        'type': 'repo',
        'download': False,
        'webhook': True
    }

    resp = client.post('/deposits/{}/actions/upload'.format(pid),
                       headers=headers + json_headers,
                       data=json.dumps(data))
    assert resp.status_code == 201

    repo = GitRepository.query.filter_by(repo_id='repo-id').one()
    assert repo
    assert repo.hook


@patch('cap.modules.repoimporter.api.GitHubAPI', return_value=MockGithub())
@responses.activate
def test_connect_already_connected_repo(mock_git_api, client, db, get_git_attributes, json_headers):
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {
        'url': REPO,
        'type': 'repo',
        'download': False,
        'webhook': True
    }

    url = '/deposits/{}/actions/upload'.format(pid)
    data = json.dumps(data)

    # first upload
    resp = client.post(url, headers=headers + json_headers, data=data)
    assert resp.status_code == 201

    # second upload - should fail
    resp = client.post(url, headers=headers + json_headers, data=data)
    assert resp.status_code == 400
