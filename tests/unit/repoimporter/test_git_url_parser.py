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

from cap.modules.repoimporter.api import GitAPIProvider
from cap.modules.repoimporter.utils import parse_url
from cap.modules.repoimporter.errors import GitURLParsingError


def test_parse_url_with_wrong_url():
    with pytest.raises(GitURLParsingError) as exc:
        parse_url('https://google.com')


def test_importer_with_wrong_url():
    with pytest.raises(GitURLParsingError) as exc:
        GitAPIProvider.create('https://google.com')


def test_importer_with_scrambled_url():
    with pytest.raises(GitURLParsingError) as exc:
        GitAPIProvider.create('https://hubgit.com/cernanalysis/test')


def test_parse_url_attrs():
    """Test the different url parsing combinations"""
    attrs = parse_url('https://github.com/cernanalysispreservation/test-repo')
    assert attrs['host'] == 'https://github.com'
    assert attrs['owner'] == 'cernanalysispreservation'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'master'
    assert attrs['filepath'] is None
    assert attrs['filename'] is None

    attrs = parse_url('https://github.com/cernanalysispreservation/test-repo/tree/test-branch')
    assert attrs['host'] == 'https://github.com'
    assert attrs['owner'] == 'cernanalysispreservation'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'test-branch'
    assert attrs['filepath'] is None
    assert attrs['filename'] is None

    attrs = parse_url('https://github.com/cernanalysispreservation/test-repo/blob/test-branch/README.md')
    assert attrs['host'] == 'https://github.com'
    assert attrs['owner'] == 'cernanalysispreservation'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'test-branch'
    assert attrs['filepath'] == 'README.md'
    assert attrs['filename'] == 'README.md'

    attrs = parse_url('https://gitlab.cern.ch/pfokiano/test-repo/blob/test-branch/new-dir/test-nested-file.txt')
    assert attrs['host'] == 'https://gitlab.cern.ch'
    assert attrs['owner'] == 'pfokiano'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'test-branch'
    assert attrs['filepath'] == 'new-dir/test-nested-file.txt'
    assert attrs['filename'] == 'test-nested-file.txt'

    attrs = parse_url('https://gitlab.cern.ch/pfokiano/test-repo/tree/test-branch')
    assert attrs['host'] == 'https://gitlab.cern.ch'
    assert attrs['owner'] == 'pfokiano'
    assert attrs['repo'] == 'test-repo'
    assert attrs['branch'] == 'test-branch'
    assert attrs['filepath'] is None
    assert attrs['filename'] is None

    attrs = parse_url('https://github.com/cern/analysispreservation/blob/api-status-checks/docker/new/test.ini')
    assert attrs['host'] == 'https://github.com'
    assert attrs['owner'] == 'cern'
    assert attrs['repo'] == 'analysispreservation'
    assert attrs['branch'] == 'api-status-checks'
    assert attrs['filepath'] == 'docker/new/test.ini'
    assert attrs['filename'] == 'test.ini'
