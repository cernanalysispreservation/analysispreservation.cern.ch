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

"""Cern Analysis Preservation CMS tasks for Celery."""


import json
import re
from datetime import date, datetime, timedelta

import requests
from flask import current_app

from cap.modules.deposit.api import (CAPDeposit, construct_access,
                                     set_egroup_permissions)
from elasticsearch_dsl import Q
from invenio_accounts.models import Role
from invenio_db import db
from invenio_search import RecordsSearch

#@shared_task
#def sync_cms_ana_with_cadi():
#    rs = RecordsSearch(index='deposits-records-cms-analysis-v0.0.1')
#    updated = get_updated_cadi_lines()
#
#    for ana in updated:
#        # remove artefact from code names
#        code = re.sub('^d', '', ana.get('code', None))
#
#        res = rs.query(Q('term', basic_info__analysis_number=code)
#                       ).execute()
#        for hit in res:
#            record = Record.get_record(hit.meta.id)
#            update_fields_in_record(record, ana)
#
#            print('Analysis number {} updated.'.format(code))


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


def get_cadi_entry_uuid(cadi_id):
    rs = RecordsSearch(index='deposits-records-cms-cadi-v0.0.1')
    res = rs.query(Q('match', cadi_id=cadi_id)).execute().hits.hits

    if res:
        return res[0]['_id']
    else:
        return None


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


def add_read_permission_to_cms_members(deposit):
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


def add_rishika_entries(file_path):
    with open(file_path, 'r') as fp:
        entries = json.load(fp)
        for entry in entries:
            if get_cadi_entry_uuid(entry['general_title']):
                print('CADI entry with cadi id {} already exist!'.format
                      (entry['general_title']))
            else:
                cadi_id = entry['basic_info'].pop('cadi_id')
                data = {
                    'basic_info': entry['basic_info'],
                }
                deposit = CAPDeposit.create(data=construct_cadi_entry(cadi_id,
                                                                      data))
                add_read_permission_to_cms_members(deposit)

                print('Cadi entry {} added.'.format(cadi_id))


def get_keys_mappings(keys):
    def _convert_from_camel_case(name):
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

    return {x: _convert_from_camel_case(x) for x in keys}


def add_or_update_cadi_entries():
    entries = get_all_cadi_entries()
    for entry in entries:
        # remove artefact from code names
        cadi_id = re.sub('^d', '', entry.get('code', None))
        uuid = get_cadi_entry_uuid(cadi_id)

        # update if already exists
        if uuid:
            deposit = CAPDeposit.get_record(uuid)
            if not 'cadi_info' in deposit:
                deposit['cadi_info'] = {}

            for cadi_key, cap_key in CADI_FIELD_TO_CAP_MAP.items():
                deposit['cadi_info'][cap_key] = entry.get(cadi_key, '') or ''
            deposit.commit()
            print('Cadi entry {} updated.'.format(cadi_id))

        # or create new cadi entry
        else:
            data = {
                'cadi_info': {v: entry.get(k, '') or ''
                              for k, v in CADI_FIELD_TO_CAP_MAP.items()}
            }

            deposit = CAPDeposit.create(data=construct_cadi_entry(cadi_id, data))

            add_read_permission_to_cms_members(deposit)

            print('Cadi entry {} added.'.format(cadi_id))


def get_all_cadi_entries():
    url = current_app.config.get('CADI_GET_ALL_URL')
    data = {
        "selWGs": "all"
    }

    resp = requests.post(url=url, data=json.dumps(data), headers={
        'Content-Type': 'application/json'})

    return resp.json()['data']


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
#
#
#def update_fields_in_record(record, cadi_record):
#    def set(d, path, val):
#        """ 
#        Set nested field in dictionary
#        path as a tuple of keys e.g. ('outer', 'inner', 'field').
#        """
#        for key in path[:-1]:
#            d = d.setdefault(key, {})
#        d[path[-1]] = val
#
#    for cadi_key, record_key in cadi_fields_to_record.items():
#        set(record, record_key, cadi_record[cadi_key])
#
#    record.commit()
