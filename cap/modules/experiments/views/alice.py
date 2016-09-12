# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

from flask import Blueprint, g, jsonify, render_template
from flask_principal import RoleNeed
from flask_security import login_required
from invenio_access import DynamicPermission
from invenio_collections.models import Collection

from cap.modules.records.views import collection_records, get_collections_tree

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


alice_group_need = RoleNeed('collaboration_alice')
alice_permission = DynamicPermission(alice_group_need)


@alice_bp.route('/')
@alice_permission.require(403)
def alice_landing():
    """Basic ALICE landing view."""
    collections = Collection.query.filter(
        Collection.name.in_(['ALICE'])).one().drilldown_tree()
    return render_template('alice/landing_page.html',
                           record_types=get_collections_tree(collections))


@alice_bp.route('/records')
@alice_permission.require(403)
def alice_records():
    """Basic ALICE records view."""
    return collection_records(collection=g.experiment)
