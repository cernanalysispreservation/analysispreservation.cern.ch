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

import requests
from flask import current_app
from invenio_access.models import Role
from invenio_db import db

from cap.modules.deposit.errors import AuthorizationError, \
    DataValidationError, FileUploadError
from cap.modules.records.utils import url_to_api_url
from cap.modules.services.serializers.zenodo import ZenodoDepositSchema


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


def get_zenodo_deposit_from_record(record, pid):
    """Get the related Zenodo information from a record."""
    try:
        index = [idx for idx, deposit in enumerate(record['_zenodo'])
                 if deposit['id'] == pid][0]

        # set an empty dict as tasks if there is none
        record['_zenodo'][index].setdefault('tasks', {})
        return record['_zenodo'][index]
    except IndexError:
        raise FileUploadError(
            'The Zenodo pid you provided is not associated with this record.')


def create_zenodo_deposit(token, data=None):
    """Create a Zenodo deposit using the logged in user's credentials."""
    zenodo_url = current_app.config.get("ZENODO_SERVER_URL")
    zenodo_data = {'metadata': data} if data else {}

    deposit = requests.post(
        url=f'{zenodo_url}/deposit/depositions',
        params=dict(access_token=token),
        json=zenodo_data,
        headers={'Content-Type': 'application/json'}
    )

    if not deposit.ok:
        if deposit.status_code == 401:
            raise AuthorizationError(
                'Authorization to Zenodo failed. Please reconnect.')
        if deposit.status_code == 400:
            data = deposit.json()
            if data.get('message') == 'Validation error.':
                raise DataValidationError(
                    'Validation error on creating the Zenodo deposit.',
                    errors=data.get('errors'))
        raise FileUploadError(
            'Something went wrong, Zenodo deposit not created.')

    data = ZenodoDepositSchema().dump(deposit.json()).data
    return data
