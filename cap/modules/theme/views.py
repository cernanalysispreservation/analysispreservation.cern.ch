"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, render_template

blueprint = Blueprint(
    'cap_theme',
    __name__,
    template_folder='templates',
    static_folder='static',
)
