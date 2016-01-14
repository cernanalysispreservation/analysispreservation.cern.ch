"""Access module."""

from __future__ import absolute_import, print_function

import redis

from flask_kvsession import KVSessionExtension
from simplekv.memory.redisstore import RedisStore

class Access(object):
    """Access extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)
            store = RedisStore(redis.StrictRedis())
            KVSessionExtension(store, app)

    def init_app(self, app):
        """Initialize configuration."""
        app.config.setdefault("SECURITY_LOGIN_USER_TEMPLATE",
                              "access/login_user.html")
