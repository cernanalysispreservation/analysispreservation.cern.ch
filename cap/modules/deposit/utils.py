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


"""CAP Deposit utils."""

from __future__ import absolute_import, print_function
from tempfile import SpooledTemporaryFile
import shutil

from cap.config import FILES_URL_MAX_SIZE


def name_git_record(data, type):
    """Create a name for the git repo / file downloaded."""
    name = '{}_{}_{}'.format(data['owner'],
                             data['repo'],
                             data['branch'])

    return name + '.tar.gz' \
        if type == 'repo' \
        else '{}_{}'.format(name, data['filename'])


def clean_empty_values(data):
    """Remove empty values from model."""
    if not isinstance(data, (dict, list)):
        return data
    if isinstance(data, list):
        return [v for v in (clean_empty_values(v) for v in data) if v]
    return {k: v for k, v in (
        (k, clean_empty_values(v)) for k, v in data.items()) if v}


def ensure_content_length(resp):
    """
    Add Content-Length when it is not present.

    Streams content into a temp file, and replaces the original socket with it.
    """
    spool = SpooledTemporaryFile(FILES_URL_MAX_SIZE)
    shutil.copyfileobj(resp.raw, spool)
    resp.headers['Content-Length'] = str(spool.tell())
    spool.seek(0)

    # replace the original socket with temp file
    resp.raw._fp.close()
    resp.raw._fp = spool
    return resp
