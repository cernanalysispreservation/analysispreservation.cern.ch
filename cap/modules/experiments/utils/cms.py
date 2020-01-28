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
"""Cern Analysis Preservation CMS utils."""

from ..search.cms_triggers import CMS_TRIGGERS_ES_CONFIG
from .common import recreate_es_index_from_source


def cache_cms_triggers_in_es_from_file(source):
    """Cache triggers names in ES, so can be used for autocompletion.

    :param source: list of dict with dataset, year and trigger
    """
    recreate_es_index_from_source(alias=CMS_TRIGGERS_ES_CONFIG['alias'],
                                  mapping=CMS_TRIGGERS_ES_CONFIG['mappings'],
                                  settings=CMS_TRIGGERS_ES_CONFIG['settings'],
                                  source=source)
