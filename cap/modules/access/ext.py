# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
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

"""Access module."""

from __future__ import absolute_import, print_function

import re
import json
import redis

from flask import session, request, current_app
from flask_kvsession import KVSessionExtension
from simplekv.memory.redisstore import RedisStore

from invenio_accounts_rest.views import blueprint as accounts_blueprint
from invenio_query_parser.ast import (AndOp, DoubleQuotedValue, Keyword,
                                      KeywordOp, OrOp)

from cap.modules.user.utils import get_remote_account_by_id

ALL_USERS_REGEX = r'^.*\/users\/?$'
SINGLE_USER_REGEX = r'^.*\/users\/[0-9]+$'


class CAPAccess(object):
    """Access extension."""

    def __init__(self, app=None):
        """Extension initialization."""

        @accounts_blueprint.after_request
        def update_users(response):
            """Update users with profile info."""
            try:
                if response.content_type == 'application/json':
                    data = json.loads(response.data)

                    # /users/<id>
                    if re.match(SINGLE_USER_REGEX, request.base_url):
                        data['profile'] = get_remote_account_by_id(
                            data['id']).get('profile', {})

                    # /users/ or /users
                    if re.match(ALL_USERS_REGEX, request.base_url):
                        for user in data['hits']['hits']:
                            user['profile'] = get_remote_account_by_id(
                                user['id']).get('profile', {})

                    response.data = json.dumps(data, indent=4)
            finally:
                return response

        if app:
            self.init_app(app)
            store = RedisStore(redis.StrictRedis(
                host=app.config.get('ACCESS_SESSION_REDIS_HOST', 'localhost'),
                password=app.config.get('REDIS_PASSWORD', '')
            ))
            KVSessionExtension(store, app)

    def init_app(self, app):
        """Initialize configuration."""
        app.extensions['cap-access'] = self


def generate_query_ast(items, begin, end):
    """Generate the AST of an Or query with the list of items."""
    if end - begin == 1:
        return items[begin]
    elif end - begin == 2:
        return OrOp(items[begin], items[begin + 1])
    else:
        middle = begin + (end - begin) / 2
        return OrOp(
            generate_query_ast(items, begin, middle),
            generate_query_ast(items, middle, end)
        )
