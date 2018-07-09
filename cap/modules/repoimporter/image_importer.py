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


"""Image importer."""

from subprocess import check_call


class ImageImporter:
    """ImageImporter saves docker images."""

    def __init__(self, username=None, token=None):
        """Initialize state."""
        self.username = username
        self.token = token

    def archive_image(self, image_name, location):
        """Archives image."""
        location = location.rstrip('/')

        if self.token is None:
            check_call(["skopeo", "copy",
                        "docker://{}".format(image_name),
                        "dir:{}".format(location)])
        else:
            cred = "--src-creds={}:{}".format(self.username, self.token)
            check_call(["skopeo", "copy", cred,
                        "docker://{}".format(image_name),
                        "dir:{}".format(location)])
