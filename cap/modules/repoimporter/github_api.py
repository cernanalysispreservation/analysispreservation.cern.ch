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
"""Github importer class."""

from __future__ import absolute_import, print_function

import hashlib
import hmac

import requests
from flask import request
from github import Github, GithubException, UnknownObjectException

from cap.modules.auth.ext import _fetch_token

from .errors import GitError, GitIntegrationError, GitRepositoryNotFound
from .utils import generate_secret, get_webhook_url


def test_github_connection():
    """Tests Github connection."""
    return GitHubAPI.ping()


class GitHubAPI(object):
    """GitHub-specific API class."""
    api_url = 'https://api.github.com'

    def __init__(self, host, owner, repo, branch, user_id=None):
        """Initialize a GitHub API instance."""
        self.host = host
        self.branch = branch
        self.owner = owner
        self.repo = repo
        self.repo_full_name = '{}/{}'.format(owner, repo)
        self.user_id = user_id

    @classmethod
    def ping(cls):
        """Ping the API."""
        resp = requests.get(cls.api_url,
                            headers={'Content-Type': 'application/json'})
        return resp.json, resp.status_code

    def __repr__(self):
        """Returns a string representation of the repo."""
        return 'Git client for {}/{}/{}'.format(self.host, self.repo_full_name,
                                                self.branch)

    @property
    def last_commit(self):
        """Retrieve the last commit sha for this branch/repo."""
        branch = self.project.get_branch(self.branch)
        return branch.commit.sha

    @property
    def project(self):
        try:
            project = self.api.get_repo(self.repo_full_name)
        except GithubException:
            raise GitRepositoryNotFound
        return project

    @property
    def repo_id(self):
        try:
            id_ = self.project.id
        except GithubException:
            raise GitRepositoryNotFound
        return id_

    @property
    def api(self):
        return Github(self.token)

    @property
    def token(self):
        token_obj = _fetch_token('github',
                                 self.user_id) if self.user_id else None
        token = token_obj.get('access_token') if token_obj else None
        return token

    def is_request_trusted(self, secret):
        """Verify if request comes from trusted source."""
        header = request.headers['X-Hub-Signature'].split('sha1=')[1]
        received = hmac.new(bytes(secret, 'utf-8'),
                            msg=request.data,
                            digestmod=hashlib.sha1)
        return hmac.compare_digest(received.hexdigest(), str(header))

    def create_webhook(self):
        """Create and enable a webhook for the specific repo."""
        url = get_webhook_url()
        secret = generate_secret()
        try:
            hook = self.project.create_hook("web",
                                            dict(url=url,
                                                 content_type='json',
                                                 secret=secret), ['push'],
                                            active=True)
        except UnknownObjectException:
            raise GitRepositoryNotFound

        return hook.id, secret

    def get_event_data(self):
        """Get event data from request payload."""
        return request.headers['X-Github-Event']

    def delete_webhook(self):
        """Delete the webhook from git. By convention, a single hook exists."""
        hook = self.project.get_hooks().get_page(0)[0]
        return requests.delete(
            hook.url, headers={'Authorization': 'token {}'.format(self.token)})

    def get_download_url(self):
        """Create url for repo download."""
        try:
            ref = self.last_commit or self.branch
            url = self.project.get_archive_link("tarball", ref=ref)
        except UnknownObjectException:
            raise GitIntegrationError(
                'Does not exist or you don\'t have access.')
        return url

    def get_params_for_file_download(self, filepath):
        """Get params for single file download."""
        try:
            file_desc = self.project.get_file_contents(filepath,
                                                       ref=self.branch)
        except GithubException:
            raise GitIntegrationError(
                'Does not exist or you don\'t have access.')

        if isinstance(file_desc, list):
            raise GitIntegrationError(
                '{} is not a single file.'.format(filepath))

        return file_desc.download_url + '?token={}'.format(
            self.token), file_desc.size
