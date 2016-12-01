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

from flask import Blueprint, session, jsonify, redirect
from flask_security import login_required
from invenio_collections.models import Collection

from cap.modules.access.views import get_user_experiments

from cap.modules.experiments.permissions import collaboration_permissions

experiments_bp = Blueprint(
    'cap_experiments',
    __name__,
    url_prefix='/experiment',
    template_folder='templates',
    static_folder='static',
)

def CAP_EXPERIMENT_MENU(experiment):
    def _l(str):
        return str

    _menu = [
        {
            'name': 'Working Groups',
            'id': 'itemId',
            'icon': 'fa fa-users',
            'link': _l('app.working_groups'),
            'menu': {
                'title': 'Working Groups',
                'icon': 'fa fa-users',
                'id': 'itemid',
                'items': [
                    {
                        'name': 'WG1',
                        'link': _l('app.working_group_item({wg_name: "WG1"})')
                    }, {
                        'name': 'WG2',
                        'link': _l('app.working_group_item({wg_name: "WG2"})')
                    }, {
                        'name': 'WG3',
                        'link': _l('app.working_group_item({wg_name: "WG3"})')
                    }
                ]
            }
        }, {
            'name': 'Publications',
            'link': _l('app.publications'),
            'icon': 'fa fa-book'
        }, {
            'name': 'My Deposits',
            'icon': 'fa fa-file-text',
            'link': _l('app.deposit'),
            'menu': {
                "title": 'My Deposits',
                'icon': 'fa fa-file-text-o',
                'items': [
                    {
                        'name': 'All',
                        'link': _l('app.deposit')
                    }, {
                        'name': 'Published',
                        'link': _l('app.deposit({status: "published"})'),
                        'icon': ''

                    }, {
                        'name': 'On Review',
                        'link': _l('app.deposit({status: "published"})'),
                        'icon': ''

                    }, {
                        'name': 'Drafts',
                        'link': _l('app.deposit({status: "draft"})'),
                        'icon': ''
                    }, {
                        'name': 'Create CMS Analysis',
                        'link': _l('app.deposit_new_cms'),
                        'icon': ''
                    }, {
                        'name': 'Create LHCb Analysis',
                        'link': _l('app.deposit_new_lhcb'),
                        'icon': ''
                    }
                ]
            }
        }
    ]

    return _menu

# def create_menu_rule(endpoint=None, experiment=None):


@login_required
@experiments_bp.route('/<experiment>/menu')
def experiment_menu(experiment):
    """Experiment menu."""
    # _menu = {
    #     'title': g.experiment,
    #     'id': 'menuId',
    #     'icon': 'fa fa-bars',
    #     'items': CAP_EXPERIMENT_MENU,
    # }
    return jsonify(CAP_EXPERIMENT_MENU(experiment))


# TOFIX: Add explicit experiments array
@login_required
@experiments_bp.route('/set/<experiment>')
def set_global_experiment(experiment=None):
    if experiment in collaboration_permissions:
        if collaboration_permissions[experiment].can():
            session['current_experiment'] = experiment
            return redirect('/')
