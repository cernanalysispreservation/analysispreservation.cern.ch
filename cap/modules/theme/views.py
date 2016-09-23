"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, current_app, render_template

from cap.modules.access.views import (get_user_experiments,
                                      redirect_user_to_experiment)

blueprint = Blueprint(
        'cap_theme',
        __name__,
        template_folder='templates',
        static_folder='static',
        )


@blueprint.route('/')
@redirect_user_to_experiment
# @register_menu(blueprint, 'main.index', 'Search')
def index():
    """Frontpage blueprint."""
    experiments = get_user_experiments()
    return render_template('cap_theme/home.html',
            experiments=experiments)


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
