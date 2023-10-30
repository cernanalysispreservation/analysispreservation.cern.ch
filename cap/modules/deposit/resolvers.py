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
"""Resolver for JSON Schemas."""

from __future__ import absolute_import, print_function

import jsonresolver
from invenio_pidstore.resolver import Resolver

# from cap.modules.deposit.api import CAPDeposit
# from cap.config import _PID


# @jsonresolver.route(f'/api/deposits/<{_PID}:pid_value>',
@jsonresolver.route(
    '/api/deposits/<pid_value>', host='analysispreservation.cern.ch'
)
def resolve_api(pid_value):
    """Resolve CAP JSON schemas."""
    return resolve_by_deposit_id(pid_value)


def resolve_by_deposit_id(depid):
    from cap.modules.deposit.api import CAPDeposit
    from cap.modules.records.serializers import record_metadata_json_v1

    resolver = Resolver(pid_type='depid', object_type='rec', getter=lambda x: x)

    dep, rec_uuid = resolver.resolve(depid)
    rec = CAPDeposit.get_record(rec_uuid)

    data = record_metadata_json_v1.transform_record(dep, rec)
    return data
