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

"""Cern Analysis Preservation CMS utils."""


import json
import re
from datetime import datetime, timedelta

import requests
from cap.modules.deposit.api import construct_access, set_egroup_permissions
from cap.modules.deposit.errors import DepositDoesNotExist
from elasticsearch_dsl import Q
from flask import current_app

from invenio_accounts.models import Role
from invenio_db import db
from invenio_search import RecordsSearch

CADI_FIELD_TO_CAP_MAP = {
    "name": "name",
    "description": "description",
    "creatorName": "creator_name",
    "creatorDate": "creator_date",
    "updaterName": "updater_name",
    "updaterDate": "updater_date",
    "contact": "contact",
    "URL": "url",
    "PAPER": "paper",
    "PAPERTAR": "papertar",
    "appDate": "app_date",
    "preApprovalTalk": "pre_approval_talk",
    "approvalTalk": "approval_talk",
    "awg": "awg",
    "committee": "comittee",
    "Conference": "conference",
    "PAS": "pas",
    "publi": "publi",
    "publicationStatus": "publication_status",
    "remarks": "remarks",
    "targetConference": "target_conference",
    "targetDatePreApp": "target_date_pre_app",
    "targetDatePhyApp": "target_date_phy_app",
    "targetDatePub": "target_date_pub",
    "targetJournal": "target_journal",
    "targetPubPeriod": "target_pub_period",
    "sources": "sources",
    "samples": "samples",
    "status": "status",
    "statusWeb": "status_web"
}


def add_read_permission_for_cms_members(deposit):
    with db.session.begin_nested():
        role = Role.query.filter_by(name='cms-members@cern.ch').one()
        permissions = [{
            'action': 'deposit-read',
            'identity': 'cms-members@cern.ch',
            'op': 'add',
            'type': 'egroup'
        }]

        access = set_egroup_permissions(role, permissions, deposit.id,
                                        db.session, construct_access())
    db.session.commit()

    deposit['_access'] = access
    deposit.commit()


def construct_cadi_entry(cadi_id, data):
    schema = 'https://{}/schemas/deposits/records/cms-cadi-v0.0.1.json'.format(
        current_app.config.get('JSONSCHEMAS_HOST'))

    entry = {
        '$schema': schema,
        'cadi_id': cadi_id,
        'general_title': cadi_id
    }

    entry.update(data)

    return entry


def get_cadi_entry_uuid(cadi_id):
    rs = RecordsSearch(index='deposits-records-cms-cadi-v0.0.1')
    res = rs.query(Q('match', cadi_id=cadi_id)).execute().hits.hits

    if res:
        return res[0]['_id']
    else:
        raise DepositDoesNotExist


def get_keys_mappings(keys):
    def _convert_from_camel_case(name):
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

    return {x: _convert_from_camel_case(x) for x in keys}


def get_entries_from_cadi_db():
    url = current_app.config.get('CADI_GET_ALL_URL')
    data = {
        "selWGs": "all"
    }

    resp = requests.post(url=url, data=json.dumps(data), headers={
        'Content-Type': 'application/json'})

    all_entries = resp.json()['data']

    # we dont want inactive or superseded entries
    entries = [x for x in all_entries
               if x['status'] not in ['Inactive',
                                      'SUPERSEDED']]

    return entries


def get_updated_cadi_lines(from_date=None, until_date=None):
    """Get CADI lines updated since yesterday."""
    url = current_app.config.get('CADI_GET_CHANGES_URL')
    now = datetime.today()
    yesterday = now - timedelta(days=1)

    resp = requests.post(url=url, params={
        'fromDate': from_date or yesterday.strftime("%d/%m/%Y"),
        'toDate': until_date or now.strftime("%d/%m/%Y")
    })

    data = resp.json().get('data', None)

    return data
