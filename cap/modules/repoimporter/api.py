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

"""Github/Gitlab importer class."""

from __future__ import absolute_import, print_function

import requests
from flask import current_app
from flask_login import current_user
from github import Github, UnknownObjectException
from gitlab import Gitlab

from .errors import GitCredentialsError, GitClientNotFound, GitIntegrationError
from .utils import parse_url, create_webhook_secret
from cap.modules.auth.ext import _fetch_token
from cap.modules.deposit.errors import FileUploadError


def _test_connection(client=None):
    """Tests the Git connections."""
    if not client:
        raise GitClientNotFound('The available client was not found.')

    return GitHubAPI.ping() if client == 'github' \
        else GitLabAPI.ping()


def _get_webhook_config(git_url):
    """Get the correct webhook config according to the host."""
    url = current_app.config['WEBHOOK_URL']
    secret = create_webhook_secret()

    # for github we need config and events,
    # gitlab has one dict for everything
    if 'gitlab' in git_url:
        return dict(url=url, push_events=True, token=secret), secret
    else:
        return (
            dict(url=url, content_type='json', secret=secret),
            ['push'], secret
        )


class GitAPIProvider(object):
    """Base Git API factory."""

    @staticmethod
    def create(url, user_id=None):
        """Creates a GitHub/GitLab api instance, based on the provided args."""
        if not url:
            raise GitCredentialsError

        _attrs = parse_url(url)
        host, owner, repo, branch = (
            _attrs['host'], _attrs['owner'], _attrs['repo'], _attrs['branch'])

        return GitHubAPI(host, owner, repo, branch, user_id) \
            if 'github' in host \
            else GitLabAPI(host, owner, repo, branch, user_id)


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

        user_id = user_id if user_id else current_user.id
        token_obj = _fetch_token('github', user_id)

        if not token_obj:
            raise GitIntegrationError(
                'Connect to GitHub from the CAP interface to access and '
                'download your repositories (Settings -> Integrations')

        try:
            self.token = token_obj.get('access_token')
            self.api = Github(self.token)
            self.project = self.api.get_repo(self.repo_full_name)
            self.repo_id = self.project.id
        except UnknownObjectException:
            raise FileUploadError('Invalid repo URL. Please check again.')

    def __repr__(self):
        """Returns a string representation of the repo."""
        return """
        Git client info:
            host:\t{}
            repo:\t{} - {}
        """.format(self.host, self.repo_full_name, self.branch)

    @classmethod
    def ping(cls):
        """Ping the API."""
        resp = requests.get(cls.api_url, headers={
            'Content-Type': 'application/json'
        })
        return resp.json, resp.status_code

    @property
    def last_commit(self):
        """Retrieve the last commit sha for this branch/repo."""
        branch = self.project.get_branch(self.branch)
        return branch.commit.sha

    def create_webhook(self):
        """Create and enable a webhook for the specific repo."""
        config, events, secret = _get_webhook_config(self.host)
        hook = self.project.create_hook("web", config, events, active=True)
        return hook.id, secret

    def delete_webhook(self):
        """Delete the webhook from git. By convention, a single hook exists."""
        hook = self.project.get_hooks().get_page(0)[0]
        return requests.delete(hook.url, headers={
            'Authorization': 'token {}'.format(self.token)
        })

    def archive_repo_url(self, ref=None):
        """Create url for repo download."""
        if not ref:
            ref = self.branch
        return self.project.get_archive_link("tarball", ref=ref)

    def archive_file_url(self, filepath):
        """Create url for single file download."""
        link = self.project.get_file_contents(filepath, ref=self.branch)
        return {
            'url': link.download_url + '?token={}'.format(self.token),
            'size': link.size,
            'token': self.token
        }


class GitLabAPI(object):
    """GitLab-specific API class."""
    api_url = 'https://gitlab.cern.ch/api/v4/projects'

    def __init__(self, host, owner, repo, branch, user_id=None):
        """Initialize a GitLab API instance."""
        self.host = host
        self.branch = branch
        self.owner = owner
        self.repo = repo
        self.repo_full_name = '{}/{}'.format(owner, repo)

        user_id = user_id if user_id else current_user.id
        token_obj = _fetch_token('gitlab', user_id)

        if not token_obj:
            raise GitIntegrationError(
                'Connect to GitLab from the CAP interface to access and '
                'download your repositories (Settings -> Integrations')

        try:
            self.token = token_obj.get('access_token')
            self.api = Gitlab(host, oauth_token=self.token)
            self.project = self.api.projects.get(self.repo_full_name)
            self.repo_id = self.project.get_id()
        except UnknownObjectException:
            raise FileUploadError('Invalid repo URL. Please check again.')

    def __repr__(self):
        """Returns a string representation of the repo."""
        return """
           Git client info:
               host:\t{}
               repo:\t{} - {}
           """.format(self.host, self.repo_full_name, self.branch)

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

    def create_webhook(self):
        """Create and enable a webhook for the specific repo."""
        config, secret = _get_webhook_config(self.host)
        hook = self.project.hooks.create(config)
        return hook.get_id(), secret

    def delete_webhook(self):
        """Delete the webhook from git. By convention, a single hook exists."""
        hook = self.project.hooks.list()[0]
        return self.project.hooks.delete(hook.get_id())

    def archive_repo_url(self, ref=None):
        """Create url for repo download."""
        if not ref:
            ref = self.branch
        return '{}/{}/repository/archive' \
               '?sha={}&access_token={}'.format(self.api_url,
                                                self.project.id,
                                                ref, self.token)

    def archive_file_url(self, filepath):
        """Create url for single file download."""
        link = '{}/{}/repository/files/{}/raw' \
               '?ref={}&access_token={}'.format(self.api_url,
                                                self.project.id,
                                                filepath,
                                                self.branch,
                                                self.token)
        return {
            'url': link,
            'size': None,
            'token': self.token
        }
