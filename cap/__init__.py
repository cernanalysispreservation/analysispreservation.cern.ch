# -*- coding: utf-8 -*-

"""cap."""

from __future__ import absolute_import, print_function

from .config import GITLAB_OAUTH_ACCESS_TOKEN


class ServerConfigurationException(Exception):
    """Custom exception for gitlab oauth."""

    def __init__(self):
        super(ServerConfigurationException, self).__init__('No gitlab access token provided')


if GITLAB_OAUTH_ACCESS_TOKEN is None:
    raise ServerConfigurationException()
