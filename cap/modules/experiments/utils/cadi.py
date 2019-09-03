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

"""Cern Analysis Preservation utils for CADI database."""

import json

import requests
from elasticsearch_dsl import Q
from flask import current_app
from invenio_db import db
from invenio_search import RecordsSearch

from cap.modules.deposit.api import CAPDeposit
from cap.modules.deposit.errors import DepositDoesNotExist
from cap.modules.schemas.models import Schema

from ..errors import ExternalAPIException
from ..serializers import CADISchema
from .common import generate_krb_cookie


def get_sso_cookie_for_cadi():
    """Get sso cookie needed to authenticate to CADI."""
    principal, kt = current_app.config['KRB_PRINCIPALS']['CADI']
    url = current_app.config['CADI_AUTH_URL']
    return generate_krb_cookie(principal, kt, url)


def synchronize_cadi_entries(limit=None):
    """Synchronize CMS analysis with CADI database.

    Updates cadi_info in existing analysis.

    If analysis with given CADI id doesn't exist yet,
    new deposit will be created.
    All members of CMS will get a read access.

    :params int limit: number of entries to update
    """
    entries = get_all_from_cadi()
    serializer = CADISchema()

    for entry in entries[:limit]:
        cadi_info = serializer.dump(entry).data
        cadi_id = cadi_info['cadi_id']

        try:  # update if cadi deposit already exists
            deposit = get_deposit_by_cadi_id(cadi_id)

            if deposit.get('cadi_info') == cadi_info:
                print('No changes in cadi entry {}.'.format(cadi_id))

            else:
                deposit['cadi_info'] = cadi_info
                deposit.commit()
                db.session.commit()

                print('Cadi entry {} updated.'.format(cadi_id))

        except (DepositDoesNotExist):
            cadi_deposit = build_cadi_deposit(cadi_id, cadi_info)
            deposit = CAPDeposit.create(data=cadi_deposit, owner=None)
            deposit._add_experiment_permissions('CMS', ['deposit-read'])
            deposit.commit()
            db.session.commit()

            print('Cadi entry {} added.'.format(cadi_id))


def get_from_cadi_by_id(cadi_id):
    """Retrieve entry with given id from CADI database.

    :params str cadi_id: CADI identifier
    :returns: entry from CADI
    :rtype dict
    """
    url = current_app.config.get('CADI_GET_RECORD_URL').format(id=cadi_id)

    cookie = get_sso_cookie_for_cadi()
    response = requests.get(url, cookies=cookie)

    if not response.ok:
        raise ExternalAPIException(response)

    data = response.json()
    entry = data['data'][0] if data['data'] else {}

    return entry


def get_all_from_cadi():
    """Retrieve all active entries from CADI database.

    Entries with status inactive|superseded will be skipped.

    :returns: list of CADI entries
    :rtype list of dict
    """
    url = current_app.config.get('CADI_GET_ALL_URL')

    cookie = get_sso_cookie_for_cadi()
    response = requests.post(url=url,
                             data=json.dumps({"selWGs": "all"}),
                             headers={'Content-Type': 'application/json'},
                             cookies=cookie)

    if not response.ok:
        raise ExternalAPIException(response)

    all_entries = response.json()['data']

    # filter out inactive or superseded entries
    entries = [entry for entry in all_entries
               if entry['status'] not in ['Inactive', 'SUPERSEDED']]

    return entries


def build_cadi_deposit(cadi_id, cadi_info):
    """Build CMS analysis deposit, based on CADI entry."""
    schema = Schema.get_latest('deposits/records/cms-analysis').fullpath

    return {
        '$schema': schema,
        'cadi_info': cadi_info,
        'general_title': cadi_id,
        'basic_info': {
            'cadi_id': cadi_id
        }
    }


def get_deposit_by_cadi_id(cadi_id):
    """Return deposit with given cadi id.

    :params str cadi_id: CADI identifier

    :rtype `cap.modules.deposits.api:CAPDeposit`
    """
    rs = RecordsSearch(index='deposits-records')

    res = rs.query(Q('match', basic_info__cadi_id__keyword=cadi_id)) \
        .execute().hits.hits

    if not res:
        raise DepositDoesNotExist
    else:
        uuid = res[0]['_id']
        deposit = CAPDeposit.get_record(uuid)

    return deposit


# KEEP IN MIND: DUE TO API PROBLEMS, CALL TO CADI SERVER SOMETIMES FAIL
#
# def get_updated_entries_from_cadi(from_date=None, until_date=None):
#    """Get CADI lines updated since yesterday."""
#    url = current_app.config.get('CADI_GET_CHANGES_URL')
#    now = datetime.today()
#    yesterday = now - timedelta(days=1)
#
#    resp = requests.post(url=url, params={
#        'fromDate': from_date or yesterday.strftime("%d/%m/%Y"),
#        'toDate': until_date or now.strftime("%d/%m/%Y")
#    })
#
#    data = resp.json().get('data', None)
#
#    return data
