"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, render_template

blueprint_static = Blueprint(
    'cap_static',
    __name__,
    template_folder='templates',
    static_folder='static',
)

blueprint = Blueprint(
    'cap',
    __name__,
    template_folder='templates',
    static_folder='static',
)

theme_blueprint = Blueprint(
    'invenio_theme',
    'invenio_theme',
    template_folder='templates',
    static_folder='static',
)

search_blueprint = Blueprint(
    'invenio_search_ui',
    'invenio_search_ui',
    template_folder='templates',
    static_folder='static',
)

deposit_blueprint = Blueprint(
    'invenio_deposit_ui',
    'invenio_deposit',
    static_folder='static',
)


@blueprint.route('/', defaults={'path': ''})
@blueprint.route('/<path:path>')
def index(path):
    return render_template('cap/app_base.html')


@blueprint.route('/templates/app')
def templates():
    return render_template('cap/app.html')
