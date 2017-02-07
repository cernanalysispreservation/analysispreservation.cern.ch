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
# or submit itself to any jurisdiction.

"""Unit tests Cap Deposit indexing."""

from __future__ import absolute_import, print_function

from invenio_deposit.api import Deposit
from invenio_search import current_search


def test_create_deposit_index(db, es):
    """Test if deposit index is created."""
    deposit_index_name = 'deposits-records-lhcb-v1.0.0'

    Deposit.create({
        '_deposit': {
            'status': 'draft',
            'pid': {
                'type': 'recid',
                'value': '1'
            },
            'id': '0a7dac44ac234fd39d941fa14bae63c3'

        }
    })
    db.session.commit()
    current_search.flush_and_refresh(deposit_index_name)
    res = current_search.client.search(index=deposit_index_name)
    # Make sure the '_deposit' is added in the record
    assert '_deposit' in res['hits']['hits'][0]['_source']
