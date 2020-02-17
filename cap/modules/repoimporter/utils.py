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

import random
import re
import shutil
import string
from tempfile import SpooledTemporaryFile

from flask import current_app, url_for
from flask_login import current_user
from invenio_db import db
from sqlalchemy.orm.exc import NoResultFound

from .errors import GitIntegrationError, GitURLParsingError
from .models import GitRepository, GitWebhook, GitWebhookSubscriber


def parse_git_url(url):
    """Parse a git url, and extract the associated information."""
    git_regex = re.compile(
        '''
        (?:https|http)://
        (?P<host>(?:github\.com|gitlab\.cern\.ch|gitlab-test\.cern\.ch))
        [:|\/]
        (?P<owner>[\w-]+)\/
        (?P<repo>[\w\.-]+)
            (?:\.git|/tree/|/blob/)?/?
        (?P<branch>[\w-]+)?/?
        (?P<filepath>.+)?
    ''', re.VERBOSE | re.MULTILINE | re.IGNORECASE)

    try:
        host, owner, repo, branch, filepath = re.match(git_regex, url).groups()
    except (ValueError, TypeError, AttributeError):
        raise GitURLParsingError

    branch = branch or 'master'  # default value for branch
    filename = filepath.split('/')[-1] if filepath else None

    return host, owner, repo, branch, filepath, filename


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


def create_webhook(record_id, host, api, subscriber_type, type_='push'):
    """
    Create webhook.

    By passing the connected git api, we can download the repo and associated
    metadata, and create a webhook that will automatically update the db
    if a repo remote changes.
    """
    with db.session.begin_nested():
        repo = GitRepository.create_or_get(api.repo_id, api.host, api.owner,
                                           api.repo, api.branch)
        try:
            webhook = GitWebhook.query.filter_by(event_type=type_,
                                                 repo_id=repo.id).one()
        except NoResultFound:
            hook_id, hook_secret = api.create_webhook()
            webhook = GitWebhook(event_type=type_,
                                 repo_id=repo.id,
                                 external_id=hook_id,
                                 secret=hook_secret)
            db.session.add(webhook)

        try:
            GitWebhookSubscriber.query.filter_by(record_id=record_id,
                                                 user_id=current_user.id,
                                                 webhook_id=webhook.id,
                                                 type=subscriber_type).one()
            raise GitIntegrationError(
                'Analysis already connected with this webhook.')
        except NoResultFound:
            subscriber = GitWebhookSubscriber(record_id=record_id,
                                              type=subscriber_type,
                                              user_id=current_user.id)
            webhook.subscribers.append(subscriber)

    db.session.commit()


def get_webhook_url():
    if current_app.config.get('DEBUG'):
        assert 'WEBHOOK_NGROK_URL' in current_app.config
        return current_app.config['WEBHOOK_NGROK_URL']
    else:
        return url_for(current_app.config['WEBHOOK_ENDPOINT'], _external=True)


def generate_secret():
    """Create a random string to be used as a secret token for webhooks."""
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choice(chars) for i in range(32))
