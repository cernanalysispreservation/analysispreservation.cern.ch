"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, jsonify, render_template, g
from flask_login import login_required
from invenio_records.models import RecordMetadata
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
    print('Checking to see if user is a ATLAS member')


@atlas_bp.route('/')
def atlas_landing():
    """Basic ATLAS landing view."""
    return render_template('atlas/landing_page.html')


@atlas_bp.route('/records')
def atlas_records():
    """Basic ATLAS records view."""
    return collection_records(collection=g.experiment)
