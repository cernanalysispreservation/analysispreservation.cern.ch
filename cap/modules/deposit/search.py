# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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

"""Configuration for deposit search."""

import pytz
import copy

from elasticsearch_dsl import Q, TermsFacet
from flask import g, current_app
from flask_login import current_user
from flask_principal import RoleNeed

from invenio_access.models import Role
from invenio_search import RecordsSearch
from invenio_search.api import DefaultFilter
from invenio_indexer.api import RecordIndexer
from invenio_indexer.signals import before_record_index

from cap.modules.access.permissions import admin_permission_factory
from cap.modules.access.utils import login_required
from cap.modules.records.api import CAPRecord


@login_required
def deposits_filter():
    """Filter list of deposits.

    Permit to the user to see all if:

    * The user is an admin (see
    func:`invenio_deposit.permissions:admin_permission_factory`).

    * It's called outside of a request.

    Otherwise, it filters out any deposit where user is not the owner.
    """
    if admin_permission_factory(None).can():
        return Q('term', **{'_deposit.status': 'draft'})

    roles = [role.id for role in Role.query.all()
             if RoleNeed(role) in g.identity.provides]

    q = (Q('multi_match', query=g.identity.id,
           fields=[
               '_access.deposit-read.users',
               '_access.deposit-admin.users'
           ]) |
         Q('terms', **{'_access.deposit-read.roles': roles}) |
         Q('terms', **{'_access.deposit-admin.roles': roles})
         ) & Q('term', **{'_deposit.status': 'draft'})

    return q


class CAPDepositSearch(RecordsSearch):
    """Default search class."""

    class Meta:
        """Configuration for deposit search."""

        index = 'deposits'
        doc_types = None
        fields = ('*',)
        facets = {
            'status': TermsFacet(field='_deposit.status'),
        }
        default_filter = DefaultFilter(deposits_filter)

    def get_user_deposits(self):
        """Get draft deposits that current user owns."""
        return self.filter(
            Q('match', **{'_deposit.status': 'draft'}) &
            Q('multi_match', query=current_user.id, fields=['_deposit.owners'])
        )

    def get_shared_with_user(self):
        """Get draft deposits shared with current user ."""
        return self.filter(
            Q('match', **{'_deposit.status': 'draft'}) & ~
            Q('multi_match', query=current_user.id,
              fields=['_deposit.owners'])
        )

    def sort_by_latest(self):
        """Sort by latest (updated)."""
        return self.sort(
            {'_updated': {'unmapped_type': 'date', 'order': 'desc'}}
        )


class CAPIndexer(RecordIndexer):
    """CAP Indexer."""

    def index_by_id(self, record_uuid):
        """Index a record by record identifier."""
        return self.index(CAPRecord.get_record(record_uuid))

    @staticmethod
    def _prepare_record(record, index, doc_type):
        """
        Prepare record data for indexing.

        :param record: The record to prepare.
        :param index: The Elasticsearch index.
        :param doc_type: The Elasticsearch document type.
        :returns: The record metadata.
        """
        data = copy.deepcopy(record.replace_refs()) \
            if current_app.config['INDEXER_REPLACE_REFS'] else record.dumps()
        data['_created'] = pytz.utc.localize(record.created).isoformat() \
            if record.created else None
        data['_updated'] = pytz.utc.localize(record.updated).isoformat() \
            if record.updated else None

        collection, version = doc_type.rsplit('-v')
        data['collection'] = dict(name=collection, version=version)

        # Allow modification of data prior to sending to Elasticsearch.
        before_record_index.send(
            current_app._get_current_object(),
            json=data,
            record=record,
            index=index,
            doc_type=doc_type,
        )

        return data
