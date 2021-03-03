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
import json
import re
import pandas as pd
from flask import current_app

from ..search.cms_triggers import CMS_TRIGGERS_ES_CONFIG
from .common import recreate_es_index_from_source


NEW_COLUMN_NAMES = {
    'CADI line (e.g. HIG-12-028 for a paper, CMS-HIG-12-028 for a PAS). '
    'Add only one per entry.': 'cadi_id',
    'Collision system (will be ORed inside this category)': 'collision_system',
    'Accelerator Parameters (will be ORed inside this category)':
        'accelerator_parameters',
    'Physics Theme': 'physics_theme',
    'SM: Analysis Characteristics (will be ORed inside this category)':
        'sm_analysis_characteristics',
    'Interpretation (will be ORed inside this category)': 'interpretation',
    'Final states (will be ORed inside this category)': 'final_states',
    'Further search categorisation (will be ORed inside this category)':
        'further_search_categorisation',
    'Further categorisation Heavy Ion results '
    '(will be ORed inside this category)': 'further_categorisation_heavy_ion'
}


def cache_cms_triggers_in_es_from_file(source):
    """Cache triggers names in ES, so can be used for autocompletion.

    :param source: list of dict with dataset, year and trigger
    """
    recreate_es_index_from_source(alias=CMS_TRIGGERS_ES_CONFIG['alias'],
                                  mapping=CMS_TRIGGERS_ES_CONFIG['mappings'],
                                  settings=CMS_TRIGGERS_ES_CONFIG['settings'],
                                  source=source)


def extract_keywords_from_excel(file):
    df = pd.read_excel(file, engine='openpyxl')
    df.drop(['Timestamp', 'Email Address'], axis=1, inplace=True)
    df.rename(columns=NEW_COLUMN_NAMES, inplace=True)

    df_data = json.loads(df.T.to_json())

    keys = [str(i) for i in range(len(df_data.keys()))]
    data = [df_data[key] for key in keys]
    data = [
        {key: item[key] for key in item.keys() if item[key]}
        for item in data
    ]

    cadi_regex = current_app.config.get('CADI_REGEX')

    for item in data:
        if not re.match(cadi_regex, item['cadi_id']):
            item['cadi_id'] = item['cadi_id']\
                .replace('CMS-', '', 1)\
                .replace('PAS-', '', 1)\
                .replace('--', '-')\
                .replace('/', '')

        for key in item.keys():
            if item[key] and key != 'cadi_id':
                item[key] = item[key].split(', ')

    return data
