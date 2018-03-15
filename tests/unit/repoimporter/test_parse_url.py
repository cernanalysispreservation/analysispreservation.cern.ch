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

from pytest import mark, raises

from cap.modules.repoimporter.utils import parse_url


@mark.parametrize("url,result", [
    ("https://gitlab.cern.ch/atrisovi/my-internal-project.git",
     ("gitlab.cern.ch", "atrisovi", "my-internal-project")),
    ("https://gitlab.cern.ch/atrisovi/root-examples",
     ("gitlab.cern.ch", "atrisovi", "root-examples")),
    ("gitlab.cern.ch/atrisovi/root-examples",
     ("gitlab.cern.ch", "atrisovi", "root-examples")),
    ("https://GitHub.com/enaVerse/enaVerse.github.io.git",
     ("github.com", "enaverse", "enaverse.github.io")),
    ("https://github.com/tiborsimko/myrepo",
     ("github.com", "tiborsimko", "myrepo")),
    ("git@github.com:tiborsimko/myrepo",
     ("github.com", "tiborsimko", "myrepo")),
    ("https://github.com/atrisovic/cap-import.git",
     ("github.com", "atrisovic", "cap-import")),
])
def test_parse_url_when_parsed_correctly(url, result):
    assert parse_url(url) == result


@mark.parametrize("url", [
    ("ssh://git@gitlab.cern.ch:7999/atrisovi/root-examples.git"),
    ("https://github.com/"),
    ("gitgub.com/enaVerse")
])
def test_parse_url_when_url_incorrect_raises_ValueError(url):

    with raises(ValueError):
        parse_url(url)
