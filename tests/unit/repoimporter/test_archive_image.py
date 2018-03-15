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
import mock
from cap.modules.repoimporter.image_importer import ImageImporter


def test_image_importer_if_username_and_token_in_params():
    image_importer = ImageImporter(username='atrisovi', token='fun_token')
    assert image_importer.username == 'atrisovi'
    assert image_importer.token == 'fun_token'
    assert image_importer.image_name is None
    assert image_importer.image_tag is None
    assert image_importer.location is None


def test_image_importer_if_no_username_and_token_in_params():
    image_importer = ImageImporter()
    assert image_importer.username is None
    assert image_importer.token is None
    assert image_importer.image_name is None
    assert image_importer.image_tag is None
    assert image_importer.location is None


def test_archive_image_if_colon_in_image_name():
    image_importer = ImageImporter()
    image_importer.archive_image_with_python = mock.Mock()
    image_importer.archive_image(
        "gitlab-registry.cern.ch/atrisovi/test-dockint:hello", "tmp")
    assert image_importer.image_name == \
        'gitlab-registry.cern.ch/atrisovi/test-dockint'
    assert image_importer.image_tag == 'hello'


def test_archive_image_if_no_colon_in_image_name():
    image_importer = ImageImporter()
    image_importer.archive_image_with_python = mock.Mock()
    image_importer.archive_image(
        "gitlab-registry.cern.ch/atrisovi/test-dockint", "tmp")
    assert image_importer.image_name == \
        'gitlab-registry.cern.ch/atrisovi/test-dockint'
    assert image_importer.image_tag == 'latest'


def test_archive_image_if_image_tag_in_params():
    image_importer = ImageImporter()
    image_importer.archive_image_with_python = mock.Mock()
    image_importer.archive_image(
        "gitlab-registry.cern.ch/atrisovi/test-dockint", "tmp",
        image_tag='my_image')
    assert image_importer.image_tag == 'my_image'


def test_archive_image_if_location_with_slash():
    image_importer = ImageImporter()
    image_importer.archive_image_with_python = mock.Mock()
    image_importer.archive_image(
        "gitlab-registry.cern.ch/atrisovi/test-dockint:hello", "tmp/")
    assert image_importer.location == 'tmp'
