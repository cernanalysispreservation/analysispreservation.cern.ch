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
from flask import current_app

from elasticsearch_dsl.query import Q
from invenio_db import db
from invenio_records.api import Record
from invenio_search.api import RecordsSearch


@shared_task
def sync_cms_ana_with_cadi():
    rs = RecordsSearch(index='deposits-records-cms-analysis-v0.0.1')
    updated = get_updated_cadi_lines()

    for ana in updated:
        code = ana.get('code', None)
        code = re.sub('^d', '', code)  # remove artefact from code names

        res = rs.query(Q('term', basic_info__analysis_number=code)
                       ).execute()
        for hit in res:
            record = Record.get_record(hit.meta.id)
            record['basic_info']['cadi_data'] = ana
            record.commit()

            print('Analysis number {} updated.'.format(code))

    db.session.commit()


def get_updated_cadi_lines():
    """Get CADI lines updated since yesterday."""
    url = current_app.config.get('CADI_GET_CHANGES_URL', None)
    now = datetime.today()
    yesterday = now - timedelta(days=1)

    resp = requests.post(url=url, params={
        'fromDate': yesterday.strftime("%d/%m/%Y"),
        'toDate': now.strftime("%d/%m/%Y")
    })

    data = resp.json().get('data', None)

    return data
