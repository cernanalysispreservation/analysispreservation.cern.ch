"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, current_app

blueprint = Blueprint(
    'cap_alpaca',
    __name__,
    template_folder='templates',
    static_folder='static',
)
