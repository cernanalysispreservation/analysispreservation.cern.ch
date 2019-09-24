"""Initialize extension."""

from __future__ import absolute_import, print_function
from cap.modules.schemas.models import Schema
from invenio_search import current_search


class CAPDeposit(object):
    """CAPDeposit extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""
        app.extensions['cap_deposit'] = self

        # fix to register mappings from DB
        # [TOBE_FIXED] better query, etc
        @app.before_first_request
        def register_mappings():
            schemas = Schema.query.all()
            for schema in schemas:
                current_search.mappings[schema.deposit_index] = {}
                current_search.mappings[schema.record_index] = {}
