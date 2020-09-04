"""Initialize extension."""

from __future__ import absolute_import, print_function
import json

from invenio_files_rest.views import blueprint as files_blueprint
from cap.modules.deposit.utils import fix_bucket_links


class CAPDeposit(object):
    """CAPDeposit extension."""

    def __init__(self, app=None):
        """Extension initialization."""
        if app:
            self.init_app(app)

    def init_app(self, app):
        """Flask application initialization."""

        @files_blueprint.after_request
        def update_file_links(response):
            try:
                if response.content_type == 'application/json':
                    resp_json = json.loads(response.data)
                    response.data = json.dumps(
                        fix_bucket_links(resp_json))
            finally:
                return response

        app.extensions['cap_deposit'] = self
