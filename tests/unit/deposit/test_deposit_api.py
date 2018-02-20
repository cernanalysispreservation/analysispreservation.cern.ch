# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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

"""Unit tests Cap Deposit api."""

from __future__ import absolute_import, print_function

from cap.modules.deposit.api import CAPDeposit as Deposit

#def test_deposit_publish_changes_status_of_deposit_to_published(app, db, users, create_deposit, auth_headers_for_user):
#    with app.test_client() as client:
#        deposit = create_deposit(users['cms_user'], 'cms-analysis-v0.0.1')              headers = auth_headers_for_user(users['cms_user'])
#
#        # before publishing status of deposit is draft
#        assert deposit['_deposit']['status'] == 'draft'
#
#        client.post('/deposits/{}/actions/publish'.format(deposit['_deposit']['id']), headers=[('Content-Type', 'application/json')] + headers
#
#        # after publishing status of deposit is draft
#        assert deposit['_deposit']['status'] == 'published'
