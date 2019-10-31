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
import pytest
from mock import patch

from cap.modules.repoimporter.api import GitAPI
from cap.modules.repoimporter.utils import parse_url, get_access_token
from cap.modules.repoimporter.errors import GitCredentialsError, GitURLParsingError
from cap.modules.repoimporter import utils


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


def test_parse_url_with_wrong_url():
    with pytest.raises(GitURLParsingError) as exc:
        parse_url('https://google.com')


def test_importer_with_wrong_url():
    with pytest.raises(GitURLParsingError) as exc:
        git = GitAPI.create(url='https://google.com')


@patch('cap.modules.repoimporter.utils.get_access_token')
def test_missing_env_variable(mocked_token, app):
    mocked_token.return_value = None
    assert utils.get_access_token("GITHUB") is None


@pytest.mark.parametrize('host, owner, branch, git_archive, token_key', [
    ('https://github.com', 'cernanalysispreservation', 'master', GITHUB_ARCHIVE, 'GITHUB'),
    ('https://github.com', 'cernanalysispreservation', 'test-branch', GITHUB_ARCHIVE_BRANCH, 'GITHUB'),
    ('https://gitlab.cern.ch', 'pfokiano', 'master', GITLAB_ARCHIVE, 'GITLAB'),
    ('https://gitlab.cern.ch', 'pfokiano', 'test-branch', GITLAB_ARCHIVE_BRANCH, 'GITLAB')
])
def test_link_creation_from_attrs(app, host, owner, branch, git_archive, token_key):
    """Given the basic attributes required to access a Git client,
       this test checks if the url creation works correctly.
    """
    if utils.get_access_token(token_key) is None:
        pytest.skip("No access token found for Git integration. Skipping.")

    repo = GitAPI.create(host=host, owner=owner, repo='test-repo', branch=branch)
    archive_url = repo.archive_repo_url()
    assert archive_url == git_archive.format(get_access_token(token_key))


@pytest.mark.parametrize('host, owner, git_archive, token_key', [
    ('https://github.com', 'cernanalysispreservation', GITHUB_ARCHIVE_BRANCH, 'GITHUB'),
    ('https://gitlab.cern.ch', 'pfokiano', GITLAB_ARCHIVE_BRANCH, 'GITLAB'),
])
def test_link_creation_from_attrs_branch(app, host, owner, git_archive, token_key):
    """Given the basic attributes required to access a Git client,
       this test checks if the url creation works correctly.
    """
    if utils.get_access_token(token_key) is None:
        pytest.skip("No access token found for Git integration. Skipping.")

    repo = GitAPI.create(host=host, owner=owner, repo='test-repo', branch='test-branch')
    archive_url = repo.archive_repo_url()
    assert archive_url == git_archive.format(get_access_token(token_key))


@pytest.mark.parametrize('git_url, git_archive, token_key', [
    (GITHUB_TEST, GITHUB_ARCHIVE, 'GITHUB'),
    (GITLAB_TEST, GITLAB_ARCHIVE, 'GITLAB'),
    (GITHUB_TEST_BRANCH, GITHUB_ARCHIVE_BRANCH, 'GITHUB'),
    (GITLAB_TEST_BRANCH, GITLAB_ARCHIVE_BRANCH, 'GITLAB')
])
def test_link_creation_from_url(app, git_url, git_archive, token_key):
    """Given a git url, this test checks if the url creation works correctly."""
    if utils.get_access_token(token_key) is None:
        pytest.skip("No access token found for Git integration. Skipping.")

    repo = GitAPI.create(url=git_url)
    archive_url = repo.archive_repo_url()
    assert archive_url == git_archive.format(get_access_token(token_key))


def test_parse_url_attrs():
    """Test the different url parsing combinations"""
    # github
    attrs = parse_url('https://github.com/cernanalysispreservation/test-repo')
    assert attrs['host'] == 'https://github.com'
    assert attrs['owner'] == 'cernanalysispreservation'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'master'
    assert attrs['filepath'] == 'test-repo'
    assert attrs['filename'] == 'test-repo'

    attrs = parse_url('https://github.com/cernanalysispreservation/test-repo/tree/test-branch')
    assert attrs['host'] == 'https://github.com'
    assert attrs['owner'] == 'cernanalysispreservation'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'test-branch'
    assert attrs['filepath'] == 'test-repo'
    assert attrs['filename'] == 'test-repo'

    attrs = parse_url('https://github.com/cernanalysispreservation/test-repo/blob/test-branch/README.md')
    assert attrs['host'] == 'https://github.com'
    assert attrs['owner'] == 'cernanalysispreservation'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'test-branch'
    assert attrs['filepath'] == 'README.md'
    assert attrs['filename'] == 'README.md'

    # gitlab
    attrs = parse_url('https://gitlab.cern.ch/pfokiano/test-repo/blob/test-branch/new-dir/test-nested-file.txt')
    assert attrs['host'] == 'https://gitlab.cern.ch'
    assert attrs['owner'] == 'pfokiano'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'test-branch'
    assert attrs['filepath'] == 'new-dir/test-nested-file.txt'
    assert attrs['filename'] == 'test-nested-file.txt'

    attrs = parse_url('https://gitlab.cern.ch/pfokiano/test-repo/tree/test-branch')
    assert attrs['host'] == 'https://gitlab.cern.ch'
    assert attrs['owner'] == 'pfokiano'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'test-branch'
    assert attrs['filepath'] == 'test-repo'
    assert attrs['filename'] == 'test-repo'
