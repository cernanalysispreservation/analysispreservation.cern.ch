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
from __future__ import absolute_import, print_function
from tempfile import SpooledTemporaryFile
import re
import shutil
import string
import random
import hashlib
import hmac

from flask import current_app

from .errors import GitURLParsingError
from .serializers import GitLabPayloadSchema, GitHubPayloadSchema

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
        raise GitURLParsingError

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
    return current_app.config.get('{}_OAUTH_ACCESS_TOKEN'.format(git.upper()))


def get_webhook_attrs(req):
    """GitHub/GitLab event and serializer, from the payload."""
    if 'X-Gitlab-Event' in req.headers.keys():
        event = req.headers.get('X-Gitlab-Event')
        event = event.lower().split()[0]
        serializer = GitLabPayloadSchema()
    else:
        event = req.headers.get('X-Github-Event')
        serializer = GitHubPayloadSchema()

    # return with payload
    return event, serializer


def name_git_record(data, type):
    """Create a name for the git repo / file downloaded."""
    name = '{}_{}_{}'.format(data['owner'],
                             data['repo'],
                             data['branch'])

    if type == 'repo':
        return '{}.tar.gz'.format(name)

    return '{}_{}'.format(name, data['filename'])


def ensure_content_length(resp):
    """
    Add Content-Length when it is not present.

    Streams content into a temp file, and replaces the original socket with it.
    """
    spool = SpooledTemporaryFile(current_app.config.get('FILES_URL_MAX_SIZE'))
    shutil.copyfileobj(resp.raw, spool)
    resp.headers['Content-Length'] = str(spool.tell())
    spool.seek(0)

    # replace the original socket with temp file
    resp.raw._fp.close()
    resp.raw._fp = spool
    return resp


def create_webhook_secret():
    """Create a random string to be used as a secret token for webhooks."""
    choices = string.ascii_letters + string.digits
    return ''.join(
        random.choice(choices) for i in range(32))


def verified_request(request, repo):
    """Verify the webhook POST, by comparing saved and received secret keys."""
    saved = repo.hook_secret

    if 'github' in repo.host:
        header = request.headers['X-Hub-Signature'].split('sha1=')[1]
        received = hmac.new(bytes(saved), msg=request.data,
                            digestmod=hashlib.sha1)
        return hmac.compare_digest(received.hexdigest(), str(header))
    else:
        received = request.headers.get('X-Gitlab-Token')
        return received == saved
