"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, jsonify, render_template, g
from flask_login import login_required
from invenio_records.models import RecordMetadata
from cap.modules.front.views import collection_records

alice_bp = Blueprint(
    'cap_alice',
    __name__,
    url_prefix='/ALICE',
    template_folder='templates',
    static_folder='static',
)


@alice_bp.before_request
@login_required
def restrict_bp_to_alice_members():
    g.experiment = 'ALICE'
    print('Checking to see if user is a ALICE member')


@alice_bp.route('/')
def alice_landing():
    """Basic ALICE landing view."""
    return render_template('alice/landing_page.html')


@alice_bp.route('/records')
def alice_records():
    """Basic ALICE records view."""
    return collection_records(collection=g.experiment)
