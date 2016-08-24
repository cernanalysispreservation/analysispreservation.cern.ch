"""Access blueprint in order to dispatch the login request."""

from __future__ import absolute_import, print_function

from flask import Blueprint

access_blueprint = Blueprint('cap_access', __name__,
                             url_prefix='/access',
                             template_folder='templates')
