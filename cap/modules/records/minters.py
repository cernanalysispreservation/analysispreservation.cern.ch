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

"""PID Minters."""

from __future__ import absolute_import, print_function

from .providers import RecordUUIDProvider
from .utils import generate_recid


def cap_record_minter(record_uuid, data):
    """Mint record identifiers."""
    assert 'control_number' not in data
    pid_value = generate_recid(data)
    provider = RecordUUIDProvider.create(
        pid_type='recid',
        pid_value=pid_value,
        object_type='rec',
        object_uuid=record_uuid)
    data['control_number'] = provider.pid.pid_value
    return provider.pid
