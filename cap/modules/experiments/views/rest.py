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
from flask_security import login_required
from invenio_collections.models import Collection

from cap.modules.records.views import collection_records, get_collections_tree
from ..permissions.alice import alice_permission
from ..permissions.atlas import atlas_permission
from ..permissions.cms import cms_permission
from ..permissions.lhcb import lhcb_permission

experiments_bp = Blueprint(
    'cap_experiments',
    __name__,
    url_prefix='/experiment',
    template_folder='templates',
    static_folder='static',
)

CAP_EXPERIMENT_MENU = [
    {
        'name': 'Working Groups',
        'id': 'itemId',
        'icon': 'fa fa-users',
        'link': '#',
        'menu': {
            'title': 'Working Groups',
            'icon': 'fa fa-users',
            'id': 'iteid',
            'items': [
                {
                    'name': 'WG1',
                    'link': '#',
                    'menu': {
                        'title': 'Working Groups',
                        'icon': 'fa fa-users',
                        'items': [
                            {
                                'name': 'WG1',
                                'link': '#'
                            }, {
                                'name': 'WG2',
                                'link': '#'
                            }, {
                                'name': 'WG3',
                                'link': '#'
                            }
                        ]
                    }
                }, {
                    'name': 'WG2',
                    'link': '#'
                }, {
                    'name': 'WG3',
                    'link': '#'
                }
            ]
        }
    }, {
        'name': 'Publications',
        'link': '/deposit',
        'icon': 'fa fa-book'
    }, {
        'name': 'My Records',
        'icon': 'fa fa-file-text-o',
        'link': '#',
        'menu': {
            "title": 'My Records',
            'icon': 'fa fa-file-text-o',
            'items': [
                {
                    'name': 'All',
                    'link': '#'
                }, {
                    'name': 'Published',
                    'link': '#',
                    'icon': ''

                }, {
                    'name': 'On Review',
                    'link': '#',
                    'icon': ''

                }, {
                    'name': 'Drafts',
                    'link': '#',
                    'icon': ''

                }
            ]
        }
    }
]

# def create_menu_rule(endpoint=None, experiment=None):


@experiments_bp.route('/menu')
def experiment_menu():
    """Experiment menu."""
    # _menu = {
    #     'title': g.experiment,
    #     'id': 'menuId',
    #     'icon': 'fa fa-bars',
    #     'items': CAP_EXPERIMENT_MENU,
    # }
    return jsonify(CAP_EXPERIMENT_MENU)


@experiments_bp.route('/records')
@alice_permission.require(403)
def alice_records():
    """Basic ALICE records view."""
    return collection_records(collection=g.experiment)
