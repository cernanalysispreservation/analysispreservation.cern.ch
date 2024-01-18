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

from cap.modules.records.serializers.author_xml import AuthorXMLSerializer
from cap.modules.records.serializers.csv import CSVSerializer
from cap.modules.records.serializers.json import (
    CAPJSONSerializer,
    RecordSerializer,
)
from cap.modules.records.serializers.schemas.common import (
    CommonRecordMetadataSchema,
)
from cap.modules.records.serializers.schemas.json import (
    BasicDepositSchema,
    PermissionsDepositSchema,
    RecordFormSchema,
    RecordSchema,
    RepositoriesDepositSchema,
)

# Serializers
# ===========
# CAP JSON serializer version 1.0.0
record_metadata_json_v1 = RecordSerializer(CommonRecordMetadataSchema)
record_json_v1 = RecordSerializer(RecordSchema)
record_csv_v1 = CSVSerializer(
    RecordSchema,
    csv_included_fields=[
        "metadata_name",
        "metadata_surname",
        "metadata_institution",
    ],
)
record_xml_v1 = AuthorXMLSerializer(
    RecordSchema,
    csv_included_fields=[
        "metadata_name",
        "metadata_surname",
        "metadata_institution",
    ],
)

record_form_json_v1 = RecordSerializer(RecordFormSchema)

basic_json_v1 = CAPJSONSerializer(BasicDepositSchema)
permissions_json_v1 = CAPJSONSerializer(PermissionsDepositSchema)
repositories_json_v1 = CAPJSONSerializer(RepositoriesDepositSchema)

# Records-REST serializers
# ========================
# JSON record serializer for individual records.
record_json_v1_response = record_responsify(record_json_v1, 'application/json')
record_form_json_v1_response = record_responsify(
    record_form_json_v1, 'application/json'
)
record_json_v1_search = search_responsify(record_json_v1, 'application/json')
basic_json_v1_response = record_responsify(
    basic_json_v1, 'application/basic+json'
)
permissions_json_v1_response = record_responsify(
    permissions_json_v1, 'application/permissions+json'
)

# JSON record serializer for search results.
basic_json_v1_search = search_responsify(
    basic_json_v1, 'application/basic+json'
)

# JSON record serializer for search results.
record_xml_v1_search = search_responsify(
    record_xml_v1, 'application/marcxml+xml'
)
record_csv_v1_search = search_responsify(record_csv_v1, 'application/csv')
repositories_json_v1_response = record_responsify(
    repositories_json_v1, 'application/repositories+json'
)
