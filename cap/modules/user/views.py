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

from cap.modules.access.utils import login_required
from cap.modules.experiments.permissions import (
    collaboration_permissions, collaboration_permissions_factory)
from cap.utils import obj_or_import_string
from flask import Blueprint, current_app, jsonify, redirect, session, request
from flask_login import current_user
from flask_principal import Permission
from flask_security.views import logout


user_blueprint = Blueprint('cap_user', __name__,
                           template_folder='templates')


@user_blueprint.route('/me')
@login_required
def get_user():
    """Returns logged in user."""
    user_experiments = get_user_experiments()
    deposit_groups = get_user_deposit_groups()
    current_experiment = session.get('current_experiment', '')
    if user_experiments and not current_experiment:
        current_experiment = user_experiments[0]
    _user = {
        "id": current_user.id,
        "email": current_user.email,
        "collaborations": user_experiments,
        "deposit_groups": deposit_groups,
        "current_experiment": current_experiment,
    }

    response = jsonify(_user)
    response.status_code = 200
    return response


@user_blueprint.route('/ping')
def ping():
    response = jsonify("Pong")
    response.status_code = 200
    return response


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
        needs = obj_or_import_string(
            obj['create_permission_factory_imp'])
        if Permission(*needs).can():
            group_data = {}
            group_data['name'] = obj.get('name', '')
            group_data['deposit_group'] = group
            group_data['description'] = obj.get('description', '')
            user_deposit_groups.append(group_data)

    return user_deposit_groups


def CAP_EXPERIMENT_MENU():
    def _l(str):
        return str

    def users_deposit_groups():
        groups = get_user_deposit_groups()
        res = []
        for group in groups:
            res.append({
                'name': group.get("name", group.get("deposit_group", "")),
                'link': _l('app.deposit_new.index({deposit_group:"' + group.get("deposit_group", "") + '"})'),
                'icon': ''
            })

        return res

    _menu = [
        {
            'name': 'Collaboration',
            'link': _l('app.shared'),
            'icon': 'fa fa-share-square'
        },
        {
            'name': 'Search',
            'link': _l('app.search'),
            'icon': 'fa fa-search'
        },
        {
            'name': 'My Deposits',
            'icon': 'fa fa-file-text',
            'link': _l('app.deposit_list'),
            'menu': {
                "title": 'My Deposits',
                'icon': 'fa fa-file-text-o',
                'items': [
                    {
                        'name': 'My shared deposits',
                        'link': _l('app.deposit({status: "published"})'),
                        'icon': 'fa fa-share-square-o'

                    }, {
                        'name': 'My drafts',
                        'link': _l('app.deposit({status: "draft"})'),
                        'icon': 'fa fa-pencil-square'
                    }
                ]
            }
        },
        {
            'name': 'Create',
            'icon': 'fa fa-file-text',
            'link': _l('app.select_deposit_new'),
            'menu': {
                "title": 'Create',
                'icon': 'fa fa-file-text-o',
                'items': users_deposit_groups()
            }
        }
    ]

    return _menu


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


@user_blueprint.route('/ldap/user/name')
@login_required
def ldap_user_by_name():
    """LDAP user by username query."""
    query = request.args.get('query', None)

    if not query:
        return jsonify([])

    lc = ldap.initialize('ldap://xldap.cern.ch')
    lc.search_ext(
        'OU=Users,OU=Organic Units,DC=cern,DC=ch',
        ldap.SCOPE_ONELEVEL,
        '(&(cernAccountType=Primary)(displayName=*{}*))'.format(query),
        ['displayName'],
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=5, cookie='')]
    )
    res = lc.result()[1]

    res = [x[1]['displayName'][0] for x in res]
    return jsonify(res)


@user_blueprint.route('/ldap/user')
@login_required
def ldap_user():
    """LDAP user by name query."""
    query = request.args.get('query', None)
    sf = request.args.get('sf', 'cn')
    rf_all = request.args.get('all', 0)
    rf = map(lambda x: x.encode('ascii', 'ignore'),
             request.args.getlist('rf'))
    if not rf:
        rf = ['cn']
    if rf_all:
        rf = LDAP_USER_RESP_FIELDS

    if not query:
        return jsonify([])

    lc = ldap.initialize('ldap://xldap.cern.ch')
    lc.search_ext(
        'OU=Users,OU=Organic Units,DC=cern,DC=ch',
        ldap.SCOPE_ONELEVEL,
        '{}=*{}*'.format(sf, query),
        rf,
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=20, cookie='')]
    )
    res = lc.result()[1]
    return jsonify(res)


@user_blueprint.route('/ldap/egroup')
@login_required
def ldap_egroup():
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
            True, size=20, cookie='')]
    )
    res = lc.result()
    return jsonify(res)


@user_blueprint.route('/menu')
@login_required
def experiment_menu():
    """Experiment menu."""
    return jsonify(CAP_EXPERIMENT_MENU())


# TOFIX: Add explicit experiments array
@user_blueprint.route('/set/experiment/<experiment>')
@login_required
def set_global_experiment(experiment=None):
    if experiment in collaboration_permissions_factory:
        if collaboration_permissions_factory[experiment]().can():
            session['current_experiment'] = experiment
            return redirect('/')


user_blueprint.route('/logout', endpoint='logout')(logout)
