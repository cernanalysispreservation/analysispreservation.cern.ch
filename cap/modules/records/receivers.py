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
"""Registered signal handlers for deposit module."""
from invenio_jsonschemas.proxies import current_jsonschemas

from cap.modules.schemas.signals import record_mapping_updated

from .utils import reindex_by_schema_url


@record_mapping_updated.connect
def handle_record_mapping_updated(schema):
    """Reindex all the record when mapping in ES got updated."""
    schema_url = current_jsonschemas.path_to_url(schema.record_path)

    reindex_by_schema_url(schema_url, 'recid')
