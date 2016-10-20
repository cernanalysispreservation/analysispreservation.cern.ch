from __future__ import absolute_import, print_function

from cap.config import DEPOSIT_GROUPS
from invenio_deposit.config import (DEPOSIT_UI_INDEX_TEMPLATE,
                                    DEPOSIT_UI_NEW_TEMPLATE)
from invenio_deposit.signals import post_action

from .indexers import index_published_record
from .views.ui import create_blueprint as ui_blueprint


class CAPDeposit(object):
    """CAPDeposit extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)
        self.register_signals()

    def init_app(self, app):
        """Flask application initialization."""
        app.register_blueprint(ui_blueprint())
        app.extensions['cap_deposit'] = self

    def register_signals(self):
        post_action.connect(index_published_record)

    # @staticmethod
    # def init_config(app):
    #     app.config.setdefault()
