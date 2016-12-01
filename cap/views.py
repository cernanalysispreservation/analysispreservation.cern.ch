"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, render_template

blueprint = Blueprint(
    'cap',
    __name__,
    template_folder='templates',
    static_folder='static',
)


@blueprint.route('/', defaults={'path': ''})
@blueprint.route('/<path:path>')
def index(path):
    return render_template('cap/app_base.html')


@blueprint.route('/templates/app')
def templates():
    return render_template('cap/app.html')
