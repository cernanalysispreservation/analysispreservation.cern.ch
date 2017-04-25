from __future__ import absolute_import, print_function

from .views.ui import create_blueprint as ui_blueprint


class CAPDeposit(object):
    """CAPDeposit extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        app.register_blueprint(ui_blueprint())
        app.extensions['cap_deposit'] = self
