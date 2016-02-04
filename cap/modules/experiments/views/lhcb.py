"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

import json

import pkg_resources
from flask import Blueprint, g, jsonify, render_template, request
from flask_principal import RoleNeed
from flask_security import login_required
from invenio_access import DynamicPermission
from invenio_collections.models import Collection

from cap.modules.front.views import collection_records, get_collections_tree


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


lhcb_group_need = RoleNeed('collaboration_lhcb')
lhcb_permission = DynamicPermission(lhcb_group_need)


@lhcb_bp.route('/')
@lhcb_permission.require(403)
def lhcb_landing():
    """Basic LHCb landing view."""
    collections = Collection.query.filter(
        Collection.name.in_(['LHCb'])).one().drilldown_tree()
    return render_template('lhcb/landing_page.html',
                           record_types=get_collections_tree(collections))


@lhcb_bp.route('/records')
@lhcb_permission.require(403)
def lhcb_records():
    """Basic LHCb records view."""
    return collection_records(collection=g.experiment)


@lhcb_bp.route('/analyses/short', methods=['GET', 'POST'])
@lhcb_permission.require(403)
def lhcb_analyses_short():
    title = request.args.get('title', '')

    filepath = pkg_resources.resource_filename('invenio_data.modules.deposit', 'scripts/bases/analyses_short.json')
    with open(filepath, 'r') as fp:
        data = json.load(fp)

    # print(data)

    analyses = data
    # print(json.dumps(data, indent=4, sort_keys=True))

    try:
        a = analyses[title]
    except:
        return jsonify({})

    return jsonify(a)


@lhcb_bp.route('/analyses', methods=['GET', 'POST'])
@lhcb_permission.require(403)
def lhcb_analyses():
    title = request.args.get('title', '')

    filepath = pkg_resources.resource_filename(
        'cap.modules.experiments.scripts', '/lhcb/analyses.json')

    with open(filepath, 'r') as fp:
        data = json.load(fp)

    # print(data)

    analyses = data
    # print(json.dumps(data, indent=4, sort_keys=True))

    try:
        a = analyses[title]
    except:
        return jsonify({})

    return jsonify(a)
