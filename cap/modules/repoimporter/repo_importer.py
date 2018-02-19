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


"""Abstract class RepoImporter."""

from abc import ABCMeta, abstractmethod

from flask import  current_app

from utils import parse_url


class RepoImporter:
    __metaclass__ = ABCMeta

    @staticmethod
    def create(url, ref=None):
        host, user, repo = parse_url(url)
        repo_name = "/".join([user, repo])

        if "gitlab" in host:
            from gitlab_importer import GitlabImporter
            token = current_app.config.get('GITLAB_OAUTH_ACCESS_TOKEN')
            gli = GitlabImporter(repo_name, ref, token)
            return gli

        if "github" in host:
            from github_importer import GithubImporter
            #token = current_app.config.get('GITHUB_OAUTH_ACCESS_TOKEN')
            ghi = GithubImporter(repo_name, ref, token=None)
            return ghi

    @abstractmethod
    def archive_repository(self):
        pass

    @abstractmethod
    def get_url_of_repository_archive(self):
        pass
