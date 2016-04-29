"""CAP Fixtures."""

from __future__ import absolute_import, print_function

from .cli import fixtures


class CAPFixtures(object):
    """CAP fixtures extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        app.cli.add_command(fixtures)
