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


def publish_and_expunge(db, deposit):
    """Publish the deposit and expunge the session.
    Use this if you want to be safe that session is synced with the DB after
    the deposit publishing.
    """
    deposit.publish()
    dep_uuid = deposit.id
    db.session.commit()
    db.session.expunge_all()
    deposit = Deposit.get_record(dep_uuid)
    return deposit


def test_deposit_status_when_publishing(app, db, deposit):
    """Test simple deposit publishing."""
    deposit = publish_and_expunge(db, deposit)
    pid, record = deposit.fetch_published()
    assert record['_deposit']['status'] == 'published'
