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

import ldap
import requests
from flask import Blueprint, current_app, jsonify, request
from flask_login import current_user, login_user
from flask_security.utils import verify_password
from flask_security.views import logout
from werkzeug.local import LocalProxy

from cap.config import DEBUG
from cap.modules.access.utils import login_required
from cap.modules.schemas.models import Schema

_datastore = LocalProxy(lambda: current_app.extensions['security'].datastore)

user_blueprint = Blueprint('cap_user', __name__,
                           template_folder='templates')


@user_blueprint.route('/me')
@login_required
def get_user():
    """Returns logged in user."""
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
    schemas = Schema.get_user_deposit_schemas()

    dep_groups = [{
        'name': schema.fullname,
        'deposit_group': schema.name.replace('deposits/records/', '')
    } for schema in schemas]

    return dep_groups


LDAP_USER_RESP_FIELDS = [
    'cn',
    'displayName',
    'mail',
    'memberOf',
    'company',
    'department',
    'cernAccountType',
    'objectClass'
]

LDAP_EGROUP_RESP_FIELDS = [
    'cn',
    'displayName',
    'description',
    'mail',
    'member',
    'objectClass'
]


@user_blueprint.route('/ldap/user/mail')
@login_required
def ldap_user_by_mail():
    """LDAP user by username query."""
    query = request.args.get('query', None)

    if not query:
        return jsonify([])

    lc = ldap.initialize('ldap://xldap.cern.ch')
    lc.search_ext(
        'OU=Users,OU=Organic Units,DC=cern,DC=ch',
        ldap.SCOPE_ONELEVEL,
        '(&(cernAccountType=Primary)(mail=*{}*))'.format(query),
        ['mail'],
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=7, cookie='')]
    )
    res = lc.result()[1]

    res = [x[1]['mail'][0] for x in res]
    return jsonify(res)


@user_blueprint.route('/ldap/egroup/mail')
@login_required
def ldap_egroup_mail():
    """LDAP egroup query."""
    query = request.args.get('query', None)
    sf = request.args.get('sf', 'cn')

    if not query:
        return jsonify([])

    lc = ldap.initialize('ldap://xldap.cern.ch')
    lc.search_ext(
        'OU=e-groups,OU=Workgroups,DC=cern,DC=ch',
        ldap.SCOPE_ONELEVEL,
        '{}=*{}*'.format(sf, query),
        LDAP_EGROUP_RESP_FIELDS,
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=7, cookie='')]
    )
    res = lc.result()[1]

    res = [x[1]['mail'][0] for x in res]
    return jsonify(res)


@user_blueprint.route('/orcid')
@login_required
def get_orcid():
    """Get ORCID identifier registered for given name."""
    name = request.args.get('name', None)
    res = {}

    if not name:
        return jsonify(res)

    names = name.split()
    url = "https://pub.orcid.org/v2.1/search/?" \
        "q=given-names:{}+AND+family-name:{}" \
        .format(names[0], names[-1])

    resp = requests.get(url=url, headers={
        'Content-Type': 'application/json'
    })
    data = resp.json().get('result', [])

    # return only if one result
    if len(data) == 1:
        res['orcid'] = data[0]['orcid-identifier']['path']

    return jsonify(res)


user_blueprint.route('/logout', endpoint='logout')(logout)


# Registered only on DEBUG mode
def login():
    """Login local user."""
    login_form_data = request.get_json()
    username = login_form_data.get('username')
    password = login_form_data.get('password')
    # Fetch user from db
    user = _datastore.get_user(username)

    if user and verify_password(password, user.password):
        try:
            login_user(user)
            return current_user.email
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
