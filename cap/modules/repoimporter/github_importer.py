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

"""Github importer."""

from github import Github
from utils import parse_url
import repo_importer


class GithubImporter(repo_importer.RepoImporter):
    """Github importer class."""

    def __init__(self, repo, ref=None, token=None):
        """Initialize repo."""
        if repo.count('/') > 1:
            _host, _user, _repo = parse_url(repo)
            self.repo = '{}/{}'.format(_user, _repo)
        else:
            self.repo = repo
        self.token = token
        self.ref = ref

    def archive_repository(self):
        """Download and archive repo via PyGithub."""
        return self.get_url_of_repository_archive()

    def archive_file(self, file):
        """Retrieve file URL via PyGithub."""
        gh = Github(self.token)
        repo = gh.get_repo(self.repo)
        link = repo.get_file_contents(file, ref=self.ref)
        return {'url': link.download_url,
                'size': link.size, 'token': self.token}

    def get_url_of_repository_archive(self):
        """Retrieve repository archive URL via PyGithub."""
        gh = Github(self.token)
        repo = gh.get_repo(self.repo)
        if self.ref:
            link = repo.get_archive_link("tarball", ref=self.ref)
        else:
            link = repo.get_archive_link("tarball")
        return link
