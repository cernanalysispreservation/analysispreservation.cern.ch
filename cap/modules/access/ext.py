"""Access module."""

from __future__ import absolute_import, print_function

import redis
from flask import session
from flask_kvsession import KVSessionExtension
from invenio_query_parser.ast import (AndOp, DoubleQuotedValue, Keyword,
                                      KeywordOp, NotOp, OrOp)
from simplekv.memory.redisstore import RedisStore

from .loader import update_identity


class CAPAccess(object):
    """Access extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)
            store = RedisStore(redis.StrictRedis())
            KVSessionExtension(store, app)

    def init_app(self, app):
        """Initialize configuration."""
        app.extensions['cap-access'] = self


def authenticated_query(query, **kwargs):
    """Enhance query with user authentication rules."""

    collaborations_dictionary = {
        'collaboration_alice': [],
        'collaboration_atlas': [
            KeywordOp(
                Keyword('collections'),
                DoubleQuotedValue('atlasworkflows'))
        ],
        'collaboration_cms': [
            KeywordOp(
                Keyword('collections'),
                DoubleQuotedValue('cmsanalysis')),
            KeywordOp(
                Keyword('collections'),
                DoubleQuotedValue('cmsquestionnaire'))
        ],
        'collaboration_lhcb': [
            KeywordOp(
                Keyword('collections'),
                DoubleQuotedValue('lhcbanalysis'))
        ]
    }

    if 'identity.provides' in session:
        ast_expressions = []
        for need in session['identity.provides']:
            if need.method == 'role':
                if need.value in collaborations_dictionary:
                    for item in collaborations_dictionary[need.value]:
                        ast_expressions.append(item)

        if len(ast_expressions) >= 1:
            query.query = AndOp(
                generate_query_ast(ast_expressions, 0, len(ast_expressions)),
                query.query
            )
            return

    query.query = AndOp(
        query.query,
        KeywordOp(
            Keyword('collections'),
            DoubleQuotedValue('public')),
    )


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
