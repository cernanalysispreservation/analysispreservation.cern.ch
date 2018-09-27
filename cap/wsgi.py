"""REST-only WSGI application for Invenio flavours."""

from __future__ import absolute_import, print_function

from cap.factory import create_api

#: WSGI application for Invenio REST API.
application = create_api()
