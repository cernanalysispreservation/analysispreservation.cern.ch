# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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
"""CAP Deposit utils."""

from __future__ import absolute_import, print_function

from collections import MutableMapping
from contextlib import suppress

from invenio_access.models import Role
from invenio_db import db
from invenio_search.proxies import current_search_client as es

from cap.modules.experiments.utils.das import cache_das_datasets_in_es_from_file  # noqa
from cap.modules.records.utils import url_to_api_url


def clean_empty_values(data):
    """Remove empty values from model."""
    if not isinstance(data, (dict, list)):
        return data
    if isinstance(data, list):
        return [v for v in (clean_empty_values(v) for v in data) if v]
    return {
        k: v
        for k, v in ((k, clean_empty_values(v)) for k, v in data.items()) if v
    }


def extract_actions_from_class(record_class):
    """Extract actions from class."""
    for name in dir(record_class):
        method = getattr(record_class, name, None)
        if method and getattr(method, '__deposit_action__', False):
            yield method.__name__


def add_read_permission_for_egroup(deposit, egroup):
    """Add read permission for egroup."""
    role = Role.query.filter_by(name=egroup).one()
    deposit._add_egroup_permissions(role, ['deposit-read'], db.session)
    deposit.commit()
    db.session.commit()


def fix_bucket_links(response):
    """Add /api/ to the bucket and object links."""
    def add_api_to_links(links):
        return {k: url_to_api_url(v)
                for k, v in links.items()} \
            if links else {}

    # bucket links
    response['links'] = add_api_to_links(response.get('links'))

    # object version links
    if response.get('contents'):
        for item in response['contents']:
            item['links'] = add_api_to_links(item.get('links'))

    return response


def delete_keys_from_dict(dictionary, keys):
    """Search for keys in a dict and delete them."""
    for key in keys:
        with suppress(KeyError):
            del dictionary[key]
    for value in dictionary.values():
        if isinstance(value, MutableMapping):
            delete_keys_from_dict(value, keys)


def schema_to_role(schema):
    """Get the role corresponding to experiment schema."""
    return {
        'cms-analysis': 'cms-members@cern.ch',
        'cms-stats-questionnaire': 'cms-members@cern.ch',
        'atlas-analysis': 'atlas-active-members-all@cern.ch',
        'alice-analysis': 'alice-member@cern.ch',
        'lhcb': 'lhcb-general@cern.ch'
    }[schema]


def create_das_index():
    """Recreate DAS index."""
    cache_das_datasets_in_es_from_file((
        {'name': 'test/test1'},
        {'name': 'test/test2'}
    ))


def update_das_data(record):
    """Mock DAS data for test deposits."""
    for field in ['mc_bg_datasets', 'mc_sig_datasets']:
        if record.get('input_data', {}).get(field):
            record['input_data'][field] = ['test/test1', 'test/test2']

    if record.get('input_data', {}).get('primary_datasets', []):
        record['input_data']['primary_datasets'] = [
            dict(path='test/test1'),
            dict(path='test/test2')
        ]
