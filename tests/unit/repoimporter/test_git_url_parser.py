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
from pytest import mark

from cap.modules.repoimporter.errors import GitURLParsingError
from cap.modules.repoimporter.factory import create_git_api
from cap.modules.repoimporter.utils import parse_git_url


def test_parse_git_url_with_wrong_url():
    with pytest.raises(GitURLParsingError):
        parse_git_url('https://google.com')


def test_importer_with_wrong_url():
    with pytest.raises(GitURLParsingError):
        create_git_api(parse_git_url('https://google.com'))


def test_importer_with_scrambled_url():
    with pytest.raises(GitURLParsingError):
        create_git_api(parse_git_url('https://hubgit.com/cernanalysis/test'))


@mark.parametrize("url,parsed", [
    ('https://github.com/cernanalysispreservation/test-repo',
     ('github.com', 'cernanalysispreservation', 'test-repo', 'master', None,
      None)),
    ('https://github.com/cernanalysispreservation/test-repo/blob/test-branch/README.md',
     ('github.com', 'cernanalysispreservation', 'test-repo', 'test-branch',
      'README.md', 'README.md')),
    ('https://gitlab.cern.ch/pfokiano/test-repo/blob/test-branch/new-dir/test-nested-file.txt',
     ('gitlab.cern.ch', 'pfokiano', 'test-repo', 'test-branch',
      'new-dir/test-nested-file.txt', 'test-nested-file.txt')),
    ('https://github.com/cern/analysispreservation/blob/api-status-checks/docker/new/test.ini',
     ('github.com', 'cern', 'analysispreservation', 'api-status-checks',
      'docker/new/test.ini', 'test.ini'))
])
def test_parse_git_url_attrs(url, parsed):
    """Test the different url parsing combinations"""
    assert parsed == parse_git_url(url)
