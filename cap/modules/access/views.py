# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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

"""Access blueprint in order to dispatch the login request."""

from __future__ import absolute_import, print_function

from functools import wraps

from flask import Blueprint, current_app, g, redirect, session, url_for, abort, jsonify
from flask_login import current_user
from flask_principal import AnonymousIdentity, RoleNeed, identity_loaded

from cap.utils import obj_or_import_string
from cap.modules.experiments.permissions import collaboration_permissions


access_blueprint = Blueprint('cap_access', __name__,
                             url_prefix='/access',
                             template_folder='templates')


@access_blueprint.route('/user')
def get_user():
    if False: # FIXME: remove after making local login work
        return """
{
  "collaborations": [
    "ATLAS",
    "LHCb",
    "CMS",
    "ALICE"
  ],
  "current_experiment": "ATLAS",
  "deposit_groups": [
    {
      "deposit_group": "cms-analysis",
      "description": "Create a CMS Analysis (analysis metadata, workflows, etc)",
      "name": "CMS Analysis"
    },
    {
      "deposit_group": "lhcb",
      "description": "Create an LHCb Analysis (analysis metadata, workflows, etc)",
      "name": "LHCb Analysis"
    },
    {
      "deposit_group": "cms-questionnaire",
      "description": "Create a CMS Questionnaire",
      "name": "CMS Questionnaire"
    },
    {
      "deposit_group": "atlas-workflows",
      "description": "Create a ATLAS Workflow",
      "name": "ATLAS Workflow"
    }
  ],
  "email": "info@inveniosoftware.org",
  "id": 1
}
"""
    if current_user.is_authenticated:
        _user = {
            "id": current_user.id,
            "email": current_user.email,
            "collaborations": get_user_experiments(),
            "deposit_groups": get_user_deposit_groups(),
            "current_experiment": session.get("current_experiment", ""),
        }

        response = jsonify(_user)
        response.status_code = 200
        return response
    else:
        response = jsonify(False)
        response.status_code = 200
        return response


# TO_REMOVE after deletion of endpoints
def redirect_user_to_experiment(f):
    """Decorator for redirecting users to their experiments."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        experiments = get_user_experiments()
        collab_pages = current_app.config.get('CAP_COLLAB_PAGES', {})

        # if user is in more than one experiment, he won't be redirected
        if len(experiments) == 1:
            return redirect(url_for(collab_pages[experiments[0]]))
        else:
            return f(*args, **kwargs)

    return decorated_function


def get_user_experiments():
    """Return an array with user's experiments."""
    experiments = [collab for collab, needs in
                   collaboration_permissions.items() if needs.can()]
    return experiments


def get_user_deposit_groups():
    """Get Deposit Groups."""

    # Set deposit groups for user
    deposit_groups = current_app.config.get('DEPOSIT_GROUPS', {})
    user_deposit_groups = []
    for group, obj in deposit_groups.iteritems():
        # Check if user has permission for this deposit group
        if obj_or_import_string(
                obj['create_permission_factory_imp']).can():
            group_data = {}
            group_data['name'] = obj.get('name', '')
            group_data['deposit_group'] = group
            group_data['description'] = obj.get('description', '')
            user_deposit_groups.append(group_data)

    return user_deposit_groups
