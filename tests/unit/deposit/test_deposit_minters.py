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
# or submit itself to any jurisdiction.
"""Tests for PID minters for drafts."""


import uuid

from invenio_pidstore.models import PIDStatus

from cap.modules.deposit.minters import cap_deposit_minter


def test_deposit_minter_when_no_pid_in_data_mints_one(app, db):
    with app.app_context():
        test_data = {}
        record_uuid = uuid.uuid4()

        pid = cap_deposit_minter(record_uuid, test_data)

        assert pid
        assert test_data['_deposit']['id'] == pid.pid_value
        assert pid.object_type == 'rec'
        assert pid.object_uuid == record_uuid
        assert pid.status == PIDStatus.REGISTERED


def test_deposit_minter_when_pid_specified_registers_deposit_with_it(app, db):
    with app.app_context():
        pid_value = '1234123412341234'
        test_data = {
            '_deposit': {
                'id': pid_value
            }
        }
        record_uuid = uuid.uuid4()

        pid = cap_deposit_minter(record_uuid, test_data)

        assert pid
        assert pid.pid_value == pid_value
        assert pid.object_type == 'rec'
        assert pid.object_uuid == record_uuid
        assert pid.status == PIDStatus.REGISTERED
