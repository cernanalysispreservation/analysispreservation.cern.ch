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
from flask import current_app

GIT_REG = r'(?P<host>https://[github\.com|gitlab\.cern\.ch]+)[:|\/]' \
            r'(?P<owner>[a-zA-Z][\w.-]+)\/(?P<repo>[\w.-]+)(/)?'

GIT_REG_FOR_BRANCH = r'(?P<host>https://[github\.com|gitlab\.cern\.ch]+)' \
                     r'[:|\/](?P<owner>[a-zA-Z][\w.-]+)\/(?P<repo>[\w.-]+)' \
                     r'/tree/(?P<branch>.+)'

GIT_REG_FOR_FILE = r'(?P<host>https://[github\.com|gitlab\.cern\.ch]+)[:|\/]' \
                     r'(?P<owner>[a-zA-Z][\w.-]+)\/(?P<repo>[\w.-]+)' \
                     r'/blob/(?P<branch>[-a-zA-Z]+)/(?P<filepath>.+)'


def parse_url(url):
    """Parse a git url, and extract the associated information."""
    url = url[:-4] if url.endswith('.git') else url

    # select the correct regex according to the type of file
    if 'tree' in url:
        pattern = GIT_REG_FOR_BRANCH
    elif 'blob' in url:
        pattern = GIT_REG_FOR_FILE
    else:
        pattern = GIT_REG

    match = re.search(pattern, url, re.IGNORECASE)
    if not match:
        raise ValueError('The URL cannot be parsed, provide a valid git URL.')

    url_results = match.groupdict()
    url_results['branch'] = 'master' \
        if 'branch' not in url_results.keys() else url_results['branch']

    # if blob, we need to figure out if path/name are the same
    # else, we have a standard repo, so we know the path is owner/repo/branch
    if 'blob' in url:
        url_results['filename'] = url_results['filepath'].split('/')[-1]
    else:
        url_results['filename'] = url_results['filepath'] = url_results['repo']

    return url_results


def get_access_token(git):
    """Get token from the environment variable."""
    return current_app.config.get('{}_OAUTH_ACCESS_TOKEN'.format(git))
