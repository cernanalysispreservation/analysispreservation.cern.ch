# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2022 CERN.
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

"""CAP sorter factory for REST API."""


def analysis_stage_sort(field_name, sub_field_name):
    sort_params = {
        'Analysis - Planned': 10,
        'Analysis - In Progress': 11,
        'Preliminary results - Under review': 20,
        'Preliminary results - Approved': 21,
        'Preliminary results - Conference note under review': 22,
        'Preliminary results - Preliminary Conf note approved': 23,
        'Final results - Under review': 30,
        'Final results - Approved': 31,
        'Final results - Public plots / tables approved [optional]': 32,
        'Final results - Paper under review': 33,
        'Final results - Paper approved': 34,
        'Final results - Paper submitted': 35,
        'Final results - Paper published': 36,
    }

    def inner(asc):
        return {
            "_script": {
                "type": "number",
                "script": {
                    "lang": "painless",
                    "source": f"params.get(doc['{field_name}'].value + ' - ' + doc['{sub_field_name}'].value)",  # noqa
                    "params": sort_params,
                },
                "order": "asc" if asc else "desc",
            }
        }

    return inner
