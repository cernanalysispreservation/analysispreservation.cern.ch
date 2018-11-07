# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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

"""Util methods for fixtures."""

import json
import uuid

from elasticsearch import helpers
from elasticsearch_dsl import Q
from flask import current_app
from invenio_access.models import Role
from invenio_db import db
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_pidstore.models import PersistentIdentifier
from invenio_search import RecordsSearch
from invenio_search.proxies import current_search_client as es

from cap.modules.deposit.api import CAPDeposit
from cap.modules.deposit.errors import DepositDoesNotExist
from cap.modules.deposit.fetchers import cap_deposit_fetcher
from cap.modules.deposit.minters import cap_deposit_minter
from cap.modules.user.utils import get_existing_or_register_user


def construct_draft_obj(schema, data):
    """Contructs a draft object."""
    entry = {
        '$schema': 'https://{}/schemas/deposits/records/{}.json'.format(
            current_app.config.get('JSONSCHEMAS_HOST'),
            schema)
    }

    entry.update(data)

    return entry


def get_entry_uuid_by_unique_field(index, dict_unique_field_value):
    """Returns record by uuid."""
    rs = RecordsSearch(index=index)
    res = rs.query(Q('match',
                     **dict_unique_field_value)).execute().hits.hits

    if not res:
        raise DepositDoesNotExist
    else:
        return res[0]['_id']


def add_read_permission_for_egroup(deposit, egroup):
    """Adds read permission for egroup."""
    role = Role.query.filter_by(name=egroup).one()
    deposit._add_egroup_permissions(role,
                                    ['deposit-read'],
                                    db.session)
    deposit.commit()
    db.session.commit()


def add_drafts_from_file(file_path, schema,
                         egroup=None, usermail=None, limit=None):
    """Adds drafts from a specified file.

    Drafts with specified pid will be registered under those.
    For drafts without pid, new pids will be minted.
    """
    if usermail:
        user = get_existing_or_register_user(usermail)

    with open(file_path, 'r') as fp:
        entries = json.load(fp)

        for entry in entries[0:limit]:
            data = construct_draft_obj(schema, entry)
            pid = cap_deposit_fetcher(None, data)
            pid_value = pid.pid_value if pid else None

            try:
                PersistentIdentifier.get('depid', pid_value)

                print('Draft with id {} already exist!'.format(pid_value))

            except PIDDoesNotExistError:
                record_uuid = uuid.uuid4()
                pid = cap_deposit_minter(record_uuid, data)
                deposit = CAPDeposit.create(data, record_uuid, user)
                deposit.commit()

                if egroup:
                    add_read_permission_for_egroup(deposit, egroup)

                print('Draft {} added.'.format(pid.pid_value))

        db.session.commit()


def bulk_index_from_source(index_name, doc_type, source):
    """Indexes from source."""
    actions = [{
        "_index": index_name,
        "_type": doc_type,
        "_id": idx,
        "_source": obj
    } for idx, obj in enumerate(source)]

    helpers.bulk(es, actions)
