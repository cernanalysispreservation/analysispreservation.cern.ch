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
"""Gitlab importer API."""

from __future__ import absolute_import, print_function

import requests
from flask import request
from flask_login import current_user
from gitlab import Gitlab
from gitlab.exceptions import GitlabGetError

from cap.modules.auth.ext import _fetch_token

from .errors import GitError, GitIntegrationError
from .utils import generate_secret, get_webhook_url


def test_gitlab_connection():
    """Tests Gitlab connection."""
    return GitLabAPI.ping()


class GitLabAPI(object):
    """Cern GitLab-specific API class."""
    api_url = 'https://gitlab.cern.ch/api/v4/projects'

    def __init__(self, host, owner, repo, branch, user_id=None):
        """Initialize a GitLab API instance."""
        self.host = host if host.startswith('http') else 'https://{}'.format(
            host)
        self.api_url = '{}/api/v4/projects'.format(self.host)
        self.branch = branch
        self.owner = owner
        self.repo = repo
        self.repo_full_name = '{}/{}'.format(owner, repo)
        self.user_id = user_id

    def __repr__(self):
        """Returns a string representation of the repo."""
        return 'Git client for {}/{}/{}'.format(self.host, self.repo_full_name,
                                                self.branch)

    @classmethod
    def ping(cls):
        """Ping the API."""
        token = _fetch_token('gitlab', current_user.id)
        resp = requests.get(cls.api_url + '?access_token='.format(token),
                            headers={'Content-Type': 'application/json'})
        return resp.json, resp.status_code

    @property
    def last_commit(self):
        branch = self.project.branches.get(self.branch)
        return branch.attributes['commit']['id']

    @property
    def project(self):
        return self.api.projects.get(self.repo_full_name)

    @property
    def repo_id(self):
        return self.project.get_id()

    @property
    def api(self):
        return Gitlab(self.host, oauth_token=self.token)

    @property
    def token(self):
        token_obj = _fetch_token('gitlab',
                                 self.user_id) if self.user_id else None
        if not token_obj:
            raise GitIntegrationError(
                'CERN Gitlab requires authorization - '
                'connect your CERN account: Settings -> Integrations.')
        return token_obj.get('access_token')

    def is_request_trusted(self, secret):
        """Verify if request comes from trusted source."""
        return request.headers.get('X-Gitlab-Token') == secret

    def get_event_data(self):
        """Get event data from request payload."""
        event = request.headers.get('X-Gitlab-Event', '')
        return event.lower().split()[0]

    def create_webhook(self):
        """Create and enable a webhook for the specific repo."""
        url = get_webhook_url()
        secret = generate_secret()
        hook = self.project.hooks.create(
            dict(url=url, push_events=True, token=secret))
        return hook.get_id(), secret

    def delete_webhook(self):
        """Delete the webhook from git. By convention, a single hook exists."""
        hook = self.project.hooks.list()[0]
        return self.project.hooks.delete(hook.get_id())

    def get_download_url(self):
        """Create url for repo download."""
        ref = self.last_commit or self.branch
        download_url = '{}/{}/repository/archive?sha={}&access_token={}' \
            .format(self.api_url, self.project.id, ref, self.token)

        self._validate_download_url(download_url)

        return download_url

    def get_params_for_file_download(self, filepath):
        """Get params for single file download."""
        download_url = '{}/{}/repository/files/{}/raw?ref={}&access_token={}'.format(  # noqa
            self.api_url, self.project.id, filepath, self.branch, self.token)
        self._validate_download_url(download_url)
        size = None
        return download_url, size

    def _validate_download_url(self, url):
        response = requests.head(url)

        if response.status_code != 200:
            raise GitIntegrationError(
                'Does not exist or you don\'t have access.')
