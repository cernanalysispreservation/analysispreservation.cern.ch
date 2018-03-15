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

from cap.modules.repoimporter.github_importer import GithubImporter
from cap.modules.repoimporter.gitlab_importer import GitlabImporter
from cap.modules.repoimporter.repo_importer import RepoImporter


def test_importer_factory_github():
    gh = RepoImporter.create("https://github.com/cernanalysispreservation/analysispreservation.cern.ch")  
    assert isinstance(gh, GithubImporter)


def test_importer_factory_gitlab():
    gh = RepoImporter.create("https://gitlab.cern.ch/atrisovi/root-examples")
    assert isinstance(gh, GitlabImporter)


def test_get_gitlab_url():
    gh = RepoImporter.create("https://gitlab.cern.ch/atrisovi/root-examples")
    link = gh.get_url_of_repository_archive()
    assert "tar" in link
