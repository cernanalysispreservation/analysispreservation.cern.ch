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

import json
import tarfile

import responses
from invenio_files_rest.models import ObjectVersion
from mock import patch

from cap.modules.repoimporter.models import (GitSnapshot, GitWebhook,
                                             GitWebhookSubscriber)
from cap.modules.repoimporter.serializers import GitLabPayloadSchema

REPO = 'https://gitlab.cern.ch/pfokiano/test-repo'
PRIVATE_REPO = 'https://gitlab.cern.ch/analysispreservation/test-private-repo'
FILE = 'https://gitlab.cern.ch/pfokiano/test-repo/blob/master/README.md'

ARCHIVE = 'https://gitlab.cern.ch/api/v4/projects/70646/repository/archive?sha=master&private_token={}'

REPO_BODY = b"\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\x03\xed\xd4MK\x031\x10\x06" \
            b"\xe0=\xf7W,x\xaef\x93\x9dl{\xf0P\xb0GA\xc4{\xc9\x97\x15\xe96e" \
            b"\x1b\xc1\x9f\xef\xb4\x05\xc1\x95j\x0f\x1b\xa5\xf4}.\x13" \
            b"\x92@&;;\xd9\x98\xf7\xc5r\x15\xadY-^\x82\xf1\xa1+\x86'\x98\xd6z" \
            b"\x1fY?\xf2b]T\x8a4\x91\x14J\x12\xcfW5\x0f\x8be\x86\\\xbey" \
            b"\xdb&\xd3\xf1\x91]\x8c\xe9\xa7}\xbf\xad\xf7/w&H\x96.\xb6mX" \
            b"\xa7[SM\x8c\xae\xbc\xf3\xda\x91\x9d\x1a\x8eV:\xa1\xac\x9e\n\xaf" \
            b"\x943\xf5DJ\xfb\xac\xdd\xe8\xbfs\x86\xe1\xa4\xb0M\xe3M\x17_\x83K" \
            b"\xe3S\xff\x80\x937\xde\xec\xcf\xd8\xf5C\xd3\xd0\xf1\xfe\xe7\xf1" \
            b"\xd7\xfe\x97\x8dRT\xd0_|\x80\x0b\xef\xff\xc7\xf9\xec\xee~~\xdd" \
            b"\xfa\x8cg\x1c\xde\xff\xfax\xfde\xbf\xfeJ\xd0.f\xcc\xe9S\xae" \
            b"\xfa\xe7m\xac\xc1\xae\x7fU>q\xa2\xe5\xc3!\xd1\x11\xdev\x00\x00" \
            b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x803\xf4\x01" \
            b"\x17v\xbd\xac\x00(\x00\x00"

FILE_BODY = 'Test Project'


class MockGitlab(object):
    last_commit = 'test_sha1'
    repo_id = 'repo-id'
    token = 'a1232123a'

    host = 'host'
    owner = 'owner'
    repo = 'repo'
    branch = 'branch'

    def create_webhook(self):
        return 'hook-id', 'hook-secret'

    def get_download_url(self):
        return 'https://gitlab.cern.ch/repo'

    def get_params_for_file_download(self, path=None):
        return ('https://gitlab.cern.ch/file', None)


@patch('cap.modules.repoimporter.factory.GitLabAPI', return_value=MockGitlab())
@responses.activate
def test_download_archive(mock_git_api, client, db, get_git_attributes,
                          json_headers):
    """
    Given a git url, check if the link correctly identifies the repo, downloads
    the data, and then CAP is able to retrieve them from a bucket.
    """
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {'url': REPO, 'type': 'repo', 'download': True, 'webhook': False}

    responses.add(responses.GET,
                  'https://gitlab.cern.ch/repo',
                  body=REPO_BODY,
                  content_type='application/octet-stream',
                  headers={
                      'Content-Length': '272',
                      'Content-Type': 'application/octet-stream'
                  },
                  stream=True,
                  status=200)

    resp = client.post('/deposits/{}/actions/upload'.format(pid),
                       headers=headers + json_headers,
                       data=json.dumps(data))
    assert resp.status_code == 201

    resp = client.get('/deposits/{}/files'.format(pid), headers=headers)
    assert resp.status_code == 200

    obj = ObjectVersion.get(
        bucket.id,
        'repositories/gitlab.cern.ch/pfokiano/test-repo/master.tar.gz')
    tar_obj = tarfile.open(obj.file.uri)
    repo_file_name = tar_obj.getmembers()[1]
    repo_content = tar_obj.extractfile(repo_file_name).read()

    assert repo_content == b'# Test Project\n\n'


@patch('cap.modules.repoimporter.factory.GitLabAPI', return_value=MockGitlab())
@responses.activate
def test_download_file(mock_git_api, client, db, get_git_attributes,
                       json_headers):
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {'url': FILE, 'type': 'file', 'download': True, 'webhook': False}

    responses.add(responses.GET,
                  'https://gitlab.cern.ch/file',
                  body=FILE_BODY,
                  content_type='text/plain',
                  headers={
                      'Content-Length': '12',
                      'Content-Type': 'text/plain; charset=utf-8',
                  },
                  stream=True,
                  status=200)

    resp = client.post('/deposits/{}/actions/upload'.format(pid),
                       headers=headers + json_headers,
                       data=json.dumps(data))
    assert resp.status_code == 201

    resp = client.get('/deposits/{}/files'.format(pid), headers=headers)
    assert resp.status_code == 200

    obj = ObjectVersion.get(
        bucket.id,
        'repositories/gitlab.cern.ch/pfokiano/test-repo/master/README.md')
    open_file = open(obj.file.uri)
    repo_content = open_file.read()
    assert repo_content == FILE_BODY


@patch('cap.modules.repoimporter.factory.GitLabAPI', return_value=MockGitlab())
@responses.activate
def test_connect_repo(mock_git_api, client, db, get_git_attributes,
                      json_headers):
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {'url': REPO, 'type': 'repo', 'download': False, 'webhook': True}

    resp = client.post('/deposits/{}/actions/upload'.format(pid),
                       headers=headers + json_headers,
                       data=json.dumps(data))
    assert resp.status_code == 201

    hook = GitWebhookSubscriber.query.filter_by(record_id=deposit.id).one()
    assert hook.webhook.repo.name == 'repo'


@patch('cap.modules.repoimporter.factory.GitLabAPI', return_value=MockGitlab())
@responses.activate
def test_connect_already_connected_repo(mock_git_api, client, db,
                                        get_git_attributes, json_headers):
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {'url': REPO, 'type': 'repo', 'download': False, 'webhook': True}

    url = '/deposits/{}/actions/upload'.format(pid)
    data = json.dumps(data)

    # first upload
    resp = client.post(url, headers=headers + json_headers, data=data)
    assert resp.status_code == 201

    # second upload - should fail
    resp = client.post(url, headers=headers + json_headers, data=data)
    assert resp.status_code == 400


#@patch('cap.modules.repoimporter.views.download_repo')
#@patch('cap.modules.repoimporter.factory.GitLabAPI.get_download_url',
#       lambda x: 'https://gitlab.cern.ch/download_url')
#def test_push_event(mock_download_repo, client, db, deposit, record,
#                    gitlab_repo, gitlab_token, superuser):
#    webhook = GitWebhook(event_type='push',
#                         repo_id=gitlab_repo.id,
#                         secret='alibrandi')
#    db.session.add(webhook)
#    subscriber = GitWebhookSubscriber(record_id=deposit.id,
#                                      user_id=superuser.id,
#                                      type='download')
#    webhook.subscribers.append(subscriber)
#    db.session.commit()
#
#    resp = client.post('/repos/event',
#                       headers=push_event_headers,
#                       data=json.dumps(push_event_payload))
#
#    assert resp.status_code == 200
#
#    # snapshot was saved in the db
#    snapshot = GitSnapshot.query.one()
#    assert snapshot.payload == GitLabPayloadSchema().dump(
#        push_event_payload).data
#    assert snapshot.webhook_id == webhook.id
#
#    # download repo task was fired
#    mock_download_repo.delay.assert_called_with(
#        str(deposit.id), 'antrzcin', 'test', 'master', None,
#        'https://gitlab.cern.ch/download_url')
