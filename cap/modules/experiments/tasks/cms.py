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

import re
from datetime import datetime, timedelta

import requests
from celery import shared_task
from elasticsearch_dsl.query import Q
from flask import current_app
from invenio_db import db
from invenio_records.api import Record
from invenio_search.api import RecordsSearch

#cadi_fields_to_record = {
#    'description': ('basic_info', 'abstract'),
#    'URL': ('basic_info', 'twiki'),
#    'PAS': ('basic_info', 'pas'),
#    'Conference': ('additional_resources', 'conference', 'name'),
#    'conferenceStatus': ('additional_resources', 'conference', 'status'),
#}
#
#
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
#
#    db.session.commit()
#
#
#def get_updated_cadi_lines():
#    """Get CADI lines updated since yesterday."""
#    url = current_app.config.get('CADI_GET_CHANGES_URL', None)
#    now = datetime.today()
#    yesterday = now - timedelta(days=1)
#
#    resp = requests.post(url=url, params={
#        'fromDate': yesterday.strftime("%d/%m/%Y"),
#        'toDate': now.strftime("%d/%m/%Y")
#    })
#
#    data = resp.json().get('data', None)
#
#    return data
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
