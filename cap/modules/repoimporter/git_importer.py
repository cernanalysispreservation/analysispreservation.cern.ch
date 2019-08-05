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

import requests
from github import Github
from gitlab import Gitlab
from flask import jsonify

from utils import parse_url, get_access_token


class GitImporter:
    """Github / Gitlab importer class."""

    def __init__(self, host=None, owner=None,
                 repo=None, branch='master', url=None):
        """Initialize an importer and extract the attributes needed."""
        if all([host, owner, repo]):
            self.host = host.strip('/')
            self.owner = owner
            self.repo = repo
            self.branch = branch
        elif url:
            url_attrs = parse_url(url)
            self.host, self.owner, self.repo, self.branch = \
                (url_attrs['host'], url_attrs['owner'],
                 url_attrs['repo'], url_attrs['branch'])
        else:
            raise ValueError(
                'Instance could not be created.'
                'Try again using another url '
                '(GitHub / CERN GitLab) or new credentials')

        # git related attributes, can be used separately
        repo_name = '{}/{}'.format(self.owner, self.repo)
        if 'github' in self.host:
            self.git = 'github'
            self.token = get_access_token(self.git.upper())
            self.git_client = Github(self.token)
            self.project = self.git_client.get_repo(repo_name)
        else:
            self.git = 'gitlab'
            self.token = get_access_token(self.git.upper())
            self.git_client = Gitlab(self.host, private_token=self.token)
            self.project = self.git_client.projects.get(repo_name)

    def __repr__(self):
        """Returns a string representation of the repo."""
        return """
            Git client info: {}
            Host:\t{}
            Owner:\t{}
            Repo:\t{}
            Branch:\t{}
        """.format(self.git, self.host, self.owner, self.repo, self.branch)

    def archive_repo_url(self):
        """Create url for repo download."""
        if self.git == 'github':
            return self.project.get_archive_link("tarball", ref=self.branch)
        else:
            return '{}/api/v4/projects/{}/repository/archive' \
                   '?sha={}&private_token={}'.format(self.host,
                                                     self.project.id,
                                                     self.branch,
                                                     self.token)

    def archive_file_url(self, filepath):
        """Create url for single file download."""
        if self.git == 'github':
            link = self.project.get_file_contents(filepath, ref=self.branch)
            return {'url': link.download_url + '?token={}'.format(self.token),
                    'size': link.size,
                    'token': self.token}
        else:
            link = '{}/api/v4/projects/{}/repository/files/{}/raw' \
                   '?ref={}&private_token={}'.format(self.host,
                                                     self.project.id,
                                                     filepath,
                                                     self.branch,
                                                     self.token)
            return {'url': link,
                    'size': None,
                    'token': self.token}


def _test_connection(client=None):
    """Tests the Git connections."""
    if not client:
        return jsonify({'error': 'No client found.'}), 500

    headers = {'Content-Type': 'application/json'}
    token = get_access_token(client.upper())

    if client == 'github':
        resp = requests.get('https://api.github.com',
                            headers=headers)
    else:
        resp = requests.get('https://gitlab.cern.ch/api/v4/projects'
                            '?private_token='.format(token), headers=headers)

    return resp.json(), resp.status_code
