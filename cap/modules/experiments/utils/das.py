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

"""Cern Analysis Preservation methods for DAS database connection."""

from .common import recreate_es_index_from_source

DAS_DATASETS_INDEX = {
    'alias': 'das-datasets',
    "mappings": {
        "doc": {
            "properties": {
                "name": {
                    "type": "completion",
                    "analyzer": "standard"
                }
            }
        }
    }
}


def cache_das_datasets_in_es_from_file(source):
    """Cache datasets names from DAS in ES."""
    recreate_es_index_from_source(
        alias=DAS_DATASETS_INDEX['alias'],
        mapping=DAS_DATASETS_INDEX['mappings'],
        source=source
    )
