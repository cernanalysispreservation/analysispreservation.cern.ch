"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, render_template

blueprint = Blueprint(
    'cap_theme',
    __name__,
    template_folder='templates',
    static_folder='static',
)


@blueprint.route('/')
# @register_menu(blueprint, 'main.index', 'Search')
def index():
    """Frontpage blueprint."""

    return render_template('cap_theme/home.html')


@blueprint.route('/search')
def search():
    """CAP Search page."""
    return render_template('cap_theme/search.html')
