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

from elasticsearch_dsl import Q, TermsFacet
from flask import abort  # has_request_context
from flask import session

from cap.modules.access.permissions import admin_permission_factory
from flask_login import current_user
from invenio_search import RecordsSearch
from invenio_search.api import DefaultFilter


def deposits_filter():
    """Filter list of deposits.

    Permit to the user to see all if:

    * The user is an admin (see
        func:`invenio_deposit.permissions:admin_permission_factory`).

    * It's called outside of a request.

    Otherwise, it filters out any deposit where user is not the owner.
    """
    # @TOFIX check request_context
    # if not has_request_context() or admin_permission_factory(None).can():
    #     return Q()

    if admin_permission_factory(None).can():
        return Q()

    if current_user.is_authenticated:
        q1 = Q('match',
               **{'_deposit.owners': getattr(current_user, 'id', 0)})
        q2 = Q('match',
            **{'_access.deposit-read.user': getattr(current_user, 'id', 0)})
        q3 =  Q('terms',
            **{'_access.deposit-read.roles': session.get('roles', [])})

        q = q1 | q2 | q3

        return q

    else:
        abort(403)


class DepositSearch(RecordsSearch):
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
