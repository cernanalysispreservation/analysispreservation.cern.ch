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


"""Importer utils."""

import re


def parse_url(url):
    """Verify url to find and return host, username and repository."""
    # Pattern host/username/repository or host:username/repository
    pattern =  \
        r"(?P<host>github\.com|gitlab\.cern\.ch)[:|\/]" + \
        r"(?P<user>[a-zA-Z][\w.-]+)\/(?P<repo>[\w.-]+)"
    match = re.search(pattern, url.lower(), re.IGNORECASE)
    if not match:
        raise ValueError(
            "The URL cannot be parsed, please provide a valid URL.")
    p = match.groupdict()
    # Remove '.git' if it is there
    if p['repo'].endswith(".git"):
        p['repo'] = p['repo'][:-4]
    return p['host'], p['user'], p['repo']
