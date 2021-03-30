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

from flask import current_app
from invenio_oauthclient.models import RemoteAccount

from .utils import path_value_equals


def equals(record, path, value, **kwargs):
    data = path_value_equals(path, record)
    return True if data and data == value else False


def not_equals(record, path, value, **kwargs):
    data = path_value_equals(path, record)
    return True if data and data != value else False


def exists(record, path, value, **kwargs):
    data = path_value_equals(path, record)
    return True if data else False


def is_in(record, path, value, **kwargs):
    data = path_value_equals(path, record)
    return True if data and value in data else False


def is_not_in(record, path, value, **kwargs):
    data = path_value_equals(path, record)
    return True if data and value not in data else False


def is_egroup_member(record, path, value, **kwargs):
    submitter_id = kwargs.get('default_ctx', {}).get('submitter_id')
    groups = get_cern_extra_data_egroups(submitter_id)

    return True if value in groups else False


CONDITION_METHODS = {
    # path/metadata conditions
    'equals': equals,
    'not_equals': not_equals,
    'exists': exists,
    'is_in': is_in,
    'is_not_in': is_not_in,
    # mail/permission conditions
    'is_egroup_member': is_egroup_member,
}


def get_cern_extra_data_egroups(user_id):
    client_id = current_app.config['CERN_APP_CREDENTIALS']['consumer_key']
    account = RemoteAccount.get(
        user_id=user_id,
        client_id=client_id,
    )
    groups = []

    if account:
        groups = account.extra_data.get('groups', [])

    return groups
