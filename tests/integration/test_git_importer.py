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
import pytest

from invenio_files_rest.models import ObjectVersion
from cap.modules.repoimporter.utils import get_access_token


GITHUB_TEST = 'https://github.com/cernanalysispreservation/test-repo'
GITLAB_TEST = 'https://gitlab.cern.ch/pfokiano/test-repo'

GITHUB_TEST_BRANCH = GITHUB_TEST + '/tree/test-branch'
GITLAB_TEST_BRANCH = GITLAB_TEST + '/tree/test-branch'

GITHUB_ARCHIVE = 'https://codeload.github.com/cernanalysispreservation/test-repo/legacy.tar.gz/master'
GITLAB_ARCHIVE = 'https://gitlab.cern.ch/api/v4/projects/70646/repository/archive?sha=master&private_token={}'

GITHUB_ARCHIVE_BRANCH = 'https://codeload.github.com/cernanalysispreservation/test-repo/legacy.tar.gz/test-branch'
GITLAB_ARCHIVE_BRANCH = 'https://gitlab.cern.ch/api/v4/projects/70646/repository/archive' \
                        '?sha=test-branch&private_token={}'

GITHUB_FILE = 'https://github.com/cernanalysispreservation/test-repo/blob/master/README.md'
GITLAB_FILE = 'https://gitlab.cern.ch/pfokiano/test-repo/blob/master/README.md'

GITHUB_FILE_BRANCH = 'https://github.com/cernanalysispreservation/test-repo/blob/test-branch/README.md'
GITLAB_FILE_BRANCH = 'https://gitlab.cern.ch/pfokiano/test-repo/blob/test-branch/README.md'


@pytest.mark.parametrize('git_url, git, git_record', [
    (GITHUB_TEST, 'GITHUB', 'cernanalysispreservation_test-repo_master.tar.gz'),
    (GITLAB_TEST, 'GITLAB', 'pfokiano_test-repo_master.tar.gz')
])
def test_download_archive_from_url_master(app, db, get_git_attributes, json_headers,
                                          git_url, git, git_record):
    """Given a git url, check if the link correctly identifies the repo, downloads
       the data, and then CAP is able to retrieve them from a bucket.
    """
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {'url': git_url, 'type': 'repo'}

    if get_access_token(git) is "CHANGE_ME":
        pytest.skip("No access token found for Git integration. Skipping.")

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/upload'.format(pid),
                           headers=headers + json_headers, data=json.dumps(data))
        assert resp.status_code == 201

        resp = client.get('/deposits/{}/files'.format(pid), headers=headers)
        assert resp.status_code == 200

        obj = ObjectVersion.get(bucket.id, git_record)
        tar_obj = tarfile.open(obj.file.uri)
        repo_file_name = tar_obj.getmembers()[1]
        repo_content = tar_obj.extractfile(repo_file_name).read()

        assert repo_content == 'test repo for cap\n'


@pytest.mark.parametrize('git_url, git, git_record', [
    (GITHUB_TEST_BRANCH, 'GITHUB', 'cernanalysispreservation_test-repo_test-branch.tar.gz'),
    (GITLAB_TEST_BRANCH, 'GITLAB', 'pfokiano_test-repo_test-branch.tar.gz')
])
def test_download_archive_from_url_branch(app, db, get_git_attributes, json_headers,
                                          git_url, git, git_record):
    """Given a git url, check if the link correctly identifies the repo, downloads its data,
       and then CAP is able to retrieve them from a bucket.
    """
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {'url': git_url, 'type': 'repo'}

    if get_access_token(git) is "CHANGE_ME":
        pytest.skip("No access token found for Git integration. Skipping.")

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/upload'.format(pid),
                           headers=headers+json_headers, data=json.dumps(data))
        assert resp.status_code == 201

        resp = client.get('/deposits/{}/files'.format(pid), headers=headers)
        assert resp.status_code == 200

        obj = ObjectVersion.get(bucket.id, git_record)
        tar_obj = tarfile.open(obj.file.uri)
        repo_file_name = tar_obj.getmembers()[1]
        repo_content = tar_obj.extractfile(repo_file_name).read()

        assert repo_content == 'test repo for cap - branch\n'


@pytest.mark.parametrize('git_url, git, git_record', [
    (GITHUB_FILE, 'GITHUB', 'cernanalysispreservation_test-repo_master_README.md'),
    (GITLAB_FILE, 'GITLAB', 'pfokiano_test-repo_master_README.md')
])
def test_download_file_from_url_master(app, db, get_git_attributes, json_headers,
                                       git_url, git, git_record):
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {'url': git_url, 'type': 'url'}

    if get_access_token(git) is "CHANGE_ME":
        pytest.skip("No access token found for Git integration. Skipping.")

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/upload'.format(pid),
                           headers=headers + json_headers, data=json.dumps(data))
        assert resp.status_code == 201

        resp = client.get('/deposits/{}/files'.format(pid), headers=headers)
        assert resp.status_code == 200

        obj = ObjectVersion.get(bucket.id, git_record)
        open_file = open(obj.file.uri)
        repo_content = open_file.read()
        assert repo_content == 'test repo for cap\n'


@pytest.mark.parametrize('git_url, git, git_record', [
    (GITHUB_FILE_BRANCH, 'GITHUB', 'cernanalysispreservation_test-repo_test-branch_README.md'),
    (GITLAB_FILE_BRANCH, 'GITLAB', 'pfokiano_test-repo_test-branch_README.md')
])
def test_download_file_from_url_branch(app, db, get_git_attributes, json_headers,
                                       git_url, git, git_record):
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {'url': git_url, 'type': 'url'}

    if get_access_token(git) is "CHANGE_ME":
        pytest.skip("No access token found for Git integration. Skipping.")

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/upload'.format(pid),
                           headers=headers + json_headers, data=json.dumps(data))
        assert resp.status_code == 201

        resp = client.get('/deposits/{}/files'.format(pid), headers=headers)
        assert resp.status_code == 200

        obj = ObjectVersion.get(bucket.id, git_record)
        open_file = open(obj.file.uri)
        repo_content = open_file.read()
        assert repo_content == 'test repo for cap - branch\n'


def test_download_gitlab_archive_private(app, db, get_git_attributes, json_headers):
    owner, deposit, pid, bucket, headers = get_git_attributes
    data = {
        'url': 'https://gitlab.cern.ch/analysispreservation/test-private-repo',
        'type': 'repo'
    }

    if get_access_token('GITLAB') is None:
        pytest.skip("No access token found for Git integration. Skipping.")

    with app.test_client() as client:
        resp = client.post('/deposits/{}/actions/upload'.format(pid),
                           headers=headers + json_headers,
                           data=json.dumps(data))
        assert resp.status_code == 201

        resp = client.get('/deposits/{}/files'.format(pid), headers=headers)
        assert resp.status_code == 200

        obj = ObjectVersion.get(bucket.id, 'analysispreservation_test-private-repo_master.tar.gz')
        tar_obj = tarfile.open(obj.file.uri)
        repo_file_name = tar_obj.getmembers()[1]
        repo_content = tar_obj.extractfile(repo_file_name).read()

        assert repo_content == 'test repo for cap'
