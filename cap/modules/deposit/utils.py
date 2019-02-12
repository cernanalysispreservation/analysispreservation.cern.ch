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

import requests
import shutil
import tempfile

from invenio_db import db
from cap.config import FILES_URL_MAX_SIZE


def clean_empty_values(data):
    """Remove empty values from model."""
    if not isinstance(data, (dict, list)):
        return data
    if isinstance(data, list):
        return [v for v in (clean_empty_values(v) for v in data) if v]
    return {k: v for k, v in (
        (k, clean_empty_values(v)) for k, v in data.items()) if v}


def task_commit(record, response, filename, total):
    """Commit file to the record."""
    record.files[filename].file.set_contents(
        response,
        default_location=record.files.bucket.location.uri,
        size=total
    )
    db.session.commit()


def ensure_content_length(
        url, method='GET',
        session=None,
        max_size=FILES_URL_MAX_SIZE or 2**20,
        *args, **kwargs):
    """Add Content-Length when no present."""
    kwargs['stream'] = True
    session = session or requests.Session()
    r = session.request(method, url, *args, **kwargs)
    if 'Content-Length' not in r.headers:
        # stream content into a temporary file so we can get the real size
        spool = tempfile.SpooledTemporaryFile(max_size)
        shutil.copyfileobj(r.raw, spool)
        r.headers['Content-Length'] = str(spool.tell())
        spool.seek(0)
        # replace the original socket with our temporary file
        r.raw._fp.close()
        r.raw._fp = spool
    return r


def compare_files(files1, files2):
    """Compare file lists."""
    if files1 is None or files2 is None:
        return False
    if len(files1) != len(files2):
        return False

    checksums = (f['checksum'] for f in files2)
    for f in files1:
        if f['checksum'] not in checksums:
            return False

    return True
