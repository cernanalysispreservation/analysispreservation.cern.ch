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
from flask import current_app

from cap.modules.deposit.api import construct_access, set_egroup_permissions
from cap.modules.deposit.errors import DepositDoesNotExist
from cap.modules.fixtures.utils import (add_read_permission_for_egroup,
                                        bulk_index_from_source,
                                        get_entry_uuid_by_unique_field)
from elasticsearch import helpers
from elasticsearch_dsl import Q
from invenio_accounts.models import Role
from invenio_db import db
from invenio_search import RecordsSearch
from invenio_search.proxies import current_search_client as es

CADI_FIELD_TO_CAP_MAP = {
    "name": "name",
    "description": "description",
    "contact": "contact",
    "creatorDate": "created",
    "URL": "twiki",
    "PAPER": "paper",
    "PAS": "pas",
    "publicationStatus": "publication_status",
    "status": "status",
}


DAS_DATASETS_MAPPING = {
    "mappings": {
        "doc": {
            "properties": {
                "name": {
                    "type": "completion",
                    "analyzer": "standard"
                }
            }
        }
    }
}


def construct_cadi_entry(cadi_id, data):
    schema = 'https://{}/schemas/deposits/records/cms-analysis-v0.0.1.json'.format(
        current_app.config.get('JSONSCHEMAS_HOST'))

    entry = {
        '$schema': schema,
        'basic_info': {
            'cadi_id': cadi_id
        },
        'general_title': cadi_id
    }

    entry.update(data)

    return entry


def get_entries_from_cadi_db():
    url = current_app.config.get('CADI_GET_ALL_URL')
    data = { "selWGs": "all" }

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


def synchronize_cadi_entries(limit=None):
    """Add/update all CADI entries connecting with CADI database."""

    entries = get_entries_from_cadi_db()
    for entry in entries[0:limit]:
        # remove artefact from code names
        cadi_id = re.sub('^d', '', entry.get('code', None))

        try:  # update if already exists
            uuid = get_entry_uuid_by_unique_field('deposits-records-cms-analysis-v0.0.1',
                                                  {'basic_info__cadi_id': cadi_id})

            deposit = CAPDeposit.get_record(uuid)

            if 'cadi_info' not in deposit:
                deposit['cadi_info'] = {}
            for cadi_key, cap_key in CADI_FIELD_TO_CAP_MAP.items():
                deposit['cadi_info'][cap_key] = entry.get(cadi_key, '') or ''
            deposit.commit()

            print('Cadi entry {} updated.'.format(cadi_id))

        except DepositDoesNotExist:  # or create new cadi entry
            data = construct_cadi_entry(cadi_id, {
                'cadi_info': {v: entry.get(k, '') or ''
                              for k, v in CADI_FIELD_TO_CAP_MAP.items()}
            })

            deposit = CAPDeposit.create(data=data)
            add_read_permission_for_egroup(deposit, 'cms-members@cern.ch')

            print('Cadi entry {} added.'.format(cadi_id))



def cache_das_datasets_in_es_from_file(file):
    """
    Cache datasets names from DAS in ES,
    so can be used for autocompletion.

    As change has to be tranparent
    * put everything under index with a different name
    * redirect alias to point to newly created index
    * remove old index
    """
    if es.indices.exists('das-datasets-v1'):
        old_index, new_index = ('das-datasets-v1',
                                'das-datasets-v2')
    else:
        old_index, new_index = ('das-datasets-v2',
                                'das-datasets-v1')

    # create new index
    es.indices.create(index=new_index, body=DAS_DATASETS_MAPPING)

    # index datasets from file under new index
    try:
        with open(file, 'r') as fp:
            res = json.load(fp)
            source = [x['dataset'][0] for x in res]
            bulk_index_from_source(new_index, 'doc', source)
    except:
        # delete index if sth went wrong
        es.indices.delete(index=old_index)
        raise

    # add newly created index under das-datasets alias
    es.indices.put_alias(index=new_index, name='das-datasets')

    # remove old index
    es.indices.delete(index=old_index)

    print("Datasets are safe in ES.")
