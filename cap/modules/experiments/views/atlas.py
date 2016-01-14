"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, g, jsonify, render_template
from flask_principal import RoleNeed
from flask_security import login_required
from invenio_access import DynamicPermission

from cap.modules.front.views import collection_records


atlas_bp = Blueprint(
    'cap_atlas',
    __name__,
    url_prefix='/ATLAS',
    template_folder='templates',
    static_folder='static',
)


@atlas_bp.before_request
@login_required
def restrict_bp_to_atlas_members():
    g.experiment = 'ATLAS'


atlas_group_need = RoleNeed('collaboration_atlas')
atlas_permission = DynamicPermission(atlas_group_need)


@atlas_bp.route('/')
@atlas_permission.require(403)
def atlas_landing():
    """Basic ATLAS landing view."""
    return render_template('atlas/landing_page.html')


@atlas_bp.route('/records')
@atlas_permission.require(403)
def atlas_records():
    """Basic ATLAS records view."""
    return collection_records(collection=g.experiment)
