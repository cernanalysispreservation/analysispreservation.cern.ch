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


"""Gitlab importer."""

import repo_importer
from utils import parse_url


class GitlabImporter(repo_importer.RepoImporter):

    def __init__(self, repo, ref=None, token=None):
        if repo.count('/') > 1:
            _host, _user, _repo = parse_url(repo)
            self.repo = '{}/{}'.format(_user, _repo)
        else:
            self.repo = repo
        self.token = token
        self.ref = ref  # branch/tag/commit

    def archive_repository(self):
        """Download and archive repo via python-gitlab."""
        return self.get_url_of_repository_archive()

    def archive_file(self, file):
        pass

    def get_url_of_repository_archive(self):
        """Retrieve repository archive URL."""
        if self.ref:
            self.ref = self.ref.replace('/', '%2F')
        else:
            self.ref = "master"
        host = "https://gitlab.cern.ch"
        url = '{}/{}/repository/{}/archive.tar.gz'.format(
            host,
            self.repo,
            self.ref)
        if self.token:
            url = url + "?private_token=" + self.token
        return url
