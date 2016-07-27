"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, render_template, current_app

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


def page_not_found(e):
    """Error handler to show a 404.html page in case of a 404 error."""
    return render_template(current_app.config['THEME_404_TEMPLATE']), 404


def internal_error(e):
    """Error handler to show a 500.html page in case of a 500 error."""
    return render_template(current_app.config['THEME_500_TEMPLATE']), 500
