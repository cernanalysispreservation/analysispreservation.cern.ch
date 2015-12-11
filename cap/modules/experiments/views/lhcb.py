"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, jsonify, render_template, request, g
from flask_login import login_required
from invenio_records.models import RecordMetadata
from cap.modules.front.views import collection_records
import json
import pkg_resources

lhcb_bp = Blueprint(
    'cap_lhcb',
    __name__,
    url_prefix='/LHCb',
    template_folder='templates',
    static_folder='static',
)


@lhcb_bp.before_request
@login_required
def restrict_bp_to_lhcb_members():
    g.experiment = 'LHCb'
    print('Checking to see if user is a LHCb member')


@lhcb_bp.route('/')
def lhcb_landing():
    """Basic LHCb landing view."""
    return render_template('lhcb/landing_page.html')


@lhcb_bp.route('/records')
def lhcb_records():
    """Basic LHCb records view."""
    return collection_records(collection=g.experiment)


@lhcb_bp.route('/analyses/short', methods=['GET', 'POST'])
def lhcb_analyses_short():
    title = request.args.get('title', '')

    filepath = pkg_resources.resource_filename('invenio_data.modules.deposit', 'scripts/bases/analyses_short.json')
    with open(filepath, 'r') as fp:
        data = json.load(fp)

    # print(data)

    analyses = data
    print(json.dumps(data, indent=4, sort_keys=True))

    try:
        a = analyses[title]
    except:
        return jsonify({})

    return jsonify(a)


@lhcb_bp.route('/analyses', methods=['GET', 'POST'])
def lhcb_analyses():
    title = request.args.get('title', '')

    filepath = pkg_resources.resource_filename(
        'cap.modules.experiments.scripts', '/lhcb/analyses.json')

    with open(filepath, 'r') as fp:
        data = json.load(fp)

    # print(data)

    analyses = data
    print(json.dumps(data, indent=4, sort_keys=True))

    try:
        a = analyses[title]
    except:
        return jsonify({})

    return jsonify(a)
