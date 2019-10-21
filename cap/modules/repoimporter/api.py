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
from github import Github
from gitlab import Gitlab

from .errors import GitCredentialsError, GitClientNotFound
from .utils import parse_url, get_access_token, create_webhook_secret


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


class GitAPI(object):
    """Base Git API class."""

    def __init__(self, host, owner, repo, branch):
        """Initialize an importer and extract the main attributes."""
        self.host = host
        self.branch = branch
        self.owner = owner
        self.repo = repo
        self.repo_full_name = '{}/{}'.format(owner, repo)

    def __repr__(self):
        """Returns a string representation of the repo."""
        return """
        Git client info:
            Host:\t{}
            Repo:\t{}
            Branch:\t{}
        """.format(self.host, self.repo_full_name, self.branch)

    @staticmethod
    def create(url=None,  # URL OR SPECIFIC ATTRIBUTES
               host=None, owner=None,
               repo=None, branch='master'):
        """Creates a GitHub/GitLab api instance, based on the provided args."""
        if url:
            _attrs = parse_url(url)
            host, owner, repo, branch = (_attrs['host'], _attrs['owner'],
                                         _attrs['repo'], _attrs['branch'])
        elif not all([host, owner, repo]):
            # no url and no attributes
            raise GitCredentialsError

        return GitHubAPI(host, owner, repo, branch) \
            if 'github' in host \
            else GitLabAPI(host, owner, repo, branch)


class GitHubAPI(GitAPI):
    """GitHub-specific API class."""
    api_url = 'https://api.github.com'

    def __init__(self, host, owner, repo, branch='master'):
        """Initialize a GitHub API instance."""
        super(GitHubAPI, self).__init__(host, owner, repo, branch)
        self.token = get_access_token('GITHUB')

        self.api = Github(self.token)
        self.project = self.api.get_repo(self.repo_full_name)
        self.repo_id = self.project.id

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


class GitLabAPI(GitAPI):
    """GitLab-specific API class."""
    api_url = 'https://gitlab.cern.ch/api/v4/projects'

    def __init__(self, host, owner, repo, branch='master'):
        """Initialize a GitLab API instance."""
        super(GitLabAPI, self).__init__(host, owner, repo, branch)
        self.token = get_access_token('GITLAB')

        self.api = Gitlab(host, private_token=self.token)
        self.project = self.api.projects.get(self.repo_full_name)
        self.repo_id = self.project.get_id()

    @classmethod
    def ping(cls):
        """Ping the API."""
        token = get_access_token('GITLAB')
        resp = requests.get(cls.api_url + '?private_token='.format(token),
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
               '?sha={}&private_token={}'.format(self.api_url,
                                                 self.project.id,
                                                 ref,
                                                 self.token)

    def archive_file_url(self, filepath):
        """Create url for single file download."""
        link = '{}/{}/repository/files/{}/raw' \
               '?ref={}&private_token={}'.format(self.api_url,
                                                 self.project.id,
                                                 filepath,
                                                 self.branch,
                                                 self.token)
        return {
            'url': link,
            'size': None,
            'token': self.token
        }
