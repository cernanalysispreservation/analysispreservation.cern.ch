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


import json
import re

from cap.modules.deposit.api import CAPDeposit
from cap.modules.deposit.errors import DepositDoesNotExist
from cap.modules.experiments.utils.cms import (CADI_FIELD_TO_CAP_MAP,
                                               construct_cadi_entry,
                                               get_entries_from_cadi_db)
from cap.modules.fixtures.utils import (add_read_permission_for_egroup,
                                        get_entry_uuid_by_unique_field)


def synchronize_cadi_entries(limit=None):
    """Add/update all CADI entries connecting with CADI database."""

    entries = get_entries_from_cadi_db()
    for entry in entries[0:limit]:
        # remove artefact from code names
        cadi_id = re.sub('^d', '', entry.get('code', None))

        try:  # update if already exists
            uuid = get_entry_uuid_by_unique_field('deposits-records-cms-analysis-v0.0.1',
                                                  {'basic_info__cadi_id': cadi_id})

            deposit = CAPDeposit.get_record(uuid)

            if 'cadi_info' not in deposit:
                deposit['cadi_info'] = {}
            for cadi_key, cap_key in CADI_FIELD_TO_CAP_MAP.items():
                deposit['cadi_info'][cap_key] = entry.get(cadi_key, '') or ''
            deposit.commit()

            print('Cadi entry {} updated.'.format(cadi_id))

        except DepositDoesNotExist:  # or create new cadi entry
            data = construct_cadi_entry(cadi_id, {
                'cadi_info': {v: entry.get(k, '') or ''
                              for k, v in CADI_FIELD_TO_CAP_MAP.items()}
            })

            deposit = CAPDeposit.create(data=data)
            add_read_permission_for_egroup(deposit, 'cms-members@cern.ch')

            print('Cadi entry {} added.'.format(cadi_id))
