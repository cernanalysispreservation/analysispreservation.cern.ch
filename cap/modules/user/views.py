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

"""User blueprint in order to dispatch the login request."""

from __future__ import absolute_import, print_function

from flask import Blueprint, current_app, jsonify, request
from flask_login import current_user, login_user
from flask_security.utils import verify_password
from flask_security.views import logout
from werkzeug.local import LocalProxy

from cap.config import DEBUG
from cap.modules.access.utils import login_required
from cap.modules.schemas.utils import get_schemas_for_user

_datastore = LocalProxy(lambda: current_app.extensions['security'].datastore)

user_blueprint = Blueprint('cap_user', __name__,
                           template_folder='templates')


@user_blueprint.route('/me')
@login_required
def get_user():
    """Return logged in user."""
    deposit_groups = get_user_deposit_groups()
    _user = {
        "id": current_user.id,
        "email": current_user.email,
        "deposit_groups": deposit_groups,
    }

    response = jsonify(_user)
    response.status_code = 200
    return response


def get_user_deposit_groups():
    """Get Deposit Groups."""
    # Set deposit groups for user
    schemas = get_schemas_for_user()

    dep_groups = [{
        'name': schema.fullname,
        'deposit_group': schema.name,
        'schema_path': schema.deposit_path
    } for schema in schemas]

    return dep_groups


user_blueprint.route('/logout', endpoint='logout')(logout)


# Registered only on DEBUG mode
def login():
    """Login local user."""
    login_form_data = request.get_json()
    username = login_form_data.get('username')
    password = login_form_data.get('password')
    # Fetch user from db
    user = _datastore.get_user(username)

    next = request.args.get('next')

    if user and verify_password(password, user.password):
        try:
            login_user(user)
            return jsonify({
                "user": current_user.email,
                "next": next
            })
        except Exception:
            return jsonify({
                "error":
                    "Something went wrong with the login. Please try again"
            }), 400
    else:
        return jsonify({
            "error":
                "The credentials you enter are not correct. Please try again"
        }), 403


if DEBUG:
    user_blueprint.add_url_rule(
        '/login/local', 'local_login', login, methods=['POST'])
