from __future__ import absolute_import, print_function

from invenio_indexer.signals import before_record_index
from invenio_deposit.config import DEPOSIT_UI_NEW_TEMPLATE, \
    DEPOSIT_UI_INDEX_TEMPLATE
from cap.config import DEPOSIT_GROUPS

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


    # @staticmethod
    # def init_config(app):
    #     app.config.setdefault()