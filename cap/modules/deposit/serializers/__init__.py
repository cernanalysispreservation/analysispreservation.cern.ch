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
"""Record serialization."""

from __future__ import absolute_import, print_function

from invenio_records_rest.serializers.response import (
    record_responsify,
    search_responsify,
)

from cap.modules.deposit.serializers.json import DepositSerializer
from cap.modules.deposit.serializers.schemas.json import (
    DepositFormSchema,
    DepositSchema,
    DepositSearchSchema,
)

# Serializers
# ===========
# CAP JSON serializer version 1.0.0
deposit_json_v1 = DepositSerializer(DepositSchema)
deposit_form_json_v1 = DepositSerializer(DepositFormSchema)
deposit_search_json_v1 = DepositSerializer(DepositSearchSchema)

# Records-REST serializers
# ========================
# JSON record serializer for individual records.
deposit_json_v1_response = record_responsify(
    deposit_json_v1, 'application/json'
)
deposit_form_json_v1_response = record_responsify(
    deposit_form_json_v1, 'application/json'
)
deposit_json_v1_search = search_responsify(
    deposit_search_json_v1, 'application/json'
)
