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
import re
import gspread
from gspread.exceptions import NoValidUrlKeyFound, SpreadsheetNotFound, \
    WorksheetNotFound, APIError
from flask import current_app
from invenio_db import db

from cap.modules.deposit.errors import DepositDoesNotExist,\
    DepositValidationError

from ..utils.cadi import get_deposit_by_cadi_id
from ..search.cms_triggers import CMS_TRIGGERS_ES_CONFIG
from .common import recreate_es_index_from_source
from .questionnaire import remove_none_keys


NEW_COLUMN_NAMES = {
    'CADI line (e.g. HIG-12-028 for a paper, CMS-HIG-12-028 for a PAS). Add only one per entry.':  # noqa
        'cadi_id',
    'Collision system (will be ORed inside this category)':
        'collision_system',
    'Accelerator Parameters (will be ORed inside this category)':
        'accelerator_parameters',
    'Physics Theme':
        'physics_theme',
    'SM: Analysis Characteristics (will be ORed inside this category)':
        'sm_analysis_characteristics',
    'Interpretation (will be ORed inside this category)':
        'interpretation',
    'Final states (will be ORed inside this category)':
        'final_states',
    'Further search categorisation (will be ORed inside this category)':
        'further_search_categorisation',
    'Further categorisation Heavy Ion results (will be ORed inside this category)':  # noqa
        'further_categorisation_heavy_ion'
}


def cache_cms_triggers_in_es_from_file(source):
    """Cache triggers names in ES, so can be used for autocompletion.

    :param source: list of dict with dataset, year and trigger
    """
    recreate_es_index_from_source(alias=CMS_TRIGGERS_ES_CONFIG['alias'],
                                  mapping=CMS_TRIGGERS_ES_CONFIG['mappings'],
                                  settings=CMS_TRIGGERS_ES_CONFIG['settings'],
                                  source=source)


def get_cms_spreadsheet():
    cadi_regex = current_app.config.get('CADI_REGEX')
    url = current_app.config.get('CMS_KEYWORDS_SPREADSHEET')
    if not url:
        return

    # google sheets API to get the spreadsheet
    try:
        downloader = gspread.service_account()
        workbook = downloader.open_by_url(url)
        data = workbook.sheet1.get_all_records()

    except NoValidUrlKeyFound:
        current_app.logger.error(f"{url} is not a valid url of Google Sheets.")
        return
    except (SpreadsheetNotFound, WorksheetNotFound):
        current_app.logger.error(
            f"Something went wrong while accessing the workbook. "
            f"Workbook/spreadsheet error.")
        return
    except APIError:
        current_app.logger.error(
            f"Accessing the Google Sheets API failed. "
            f"Make sure you have the correct credentials, and try again.")
        return

    # process keywords
    for i, record in enumerate(data):
        try:
            # delete unused fields
            del record['Timestamp']
            del record['Email Address']

            # replace titles with new ones
            old_keys = list(record.keys())[:]

            for old_key in old_keys:
                new_key = NEW_COLUMN_NAMES[old_key]
                record[new_key] = record.pop(old_key)

                # split values in lists but NOT CADI ID
                if new_key != 'cadi_id':
                    record[new_key] = record[new_key].split(', ') \
                        if record[new_key] else None

            # fix cadi id if possible
            if not re.match(cadi_regex, record['cadi_id']):
                record['cadi_id'] = record['cadi_id']\
                    .replace('CMS-', '', 1)\
                    .replace('PAS-', '', 1)\
                    .replace('--', '-')\
                    .replace('/', '')
        except (KeyError, ValueError):
            current_app.logger.error(f"Accessing record number {i} failed.")

    # return the list, remove all the None values
    return [remove_none_keys(record) for record in data]


def cms_keywords_from_spreadsheet():
    """Add keywords in their respective records, filtered by CADI ID."""
    records = get_cms_spreadsheet()
    if not records:
        return

    for record in records:
        # keep the cadi id but remove it from the data
        cadi_id = record['cadi_id']
        del record['cadi_id']

        try:
            deposit = get_deposit_by_cadi_id(cadi_id)
            deposit['basic_info']['analysis_keywords'] = record

            deposit.commit()
            db.session.commit()
            current_app.logger.info(f"{cadi_id} was successfully updated.")

        except DepositDoesNotExist:
            current_app.logger.error(f"Not Found Error: {cadi_id} not found.")

        except DepositValidationError as e:
            errors = [err.res for err in e.errors]
            current_app.logger.error(
                f"Validation Error in {cadi_id}: {errors}")

        except Exception:
            current_app.logger.error(
                f"Error in {cadi_id}: Something went wrong while updating.")

    current_app.logger.info("Finishing... Keywords extracted and saved.")
