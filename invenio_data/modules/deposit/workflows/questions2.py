# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2015 CERN.
#
# CERN Analysis Preservation Framework is free software; you can
# redistribute it and/or modify it under the terms of the GNU General
# Public License as published by the Free Software Foundation; either
# version 2 of the License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that
# it will be useful, but WITHOUT ANY WARRANTY; without even the
# implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
# PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this software; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307,
# USA.

"""Simple test workflow for JSON-schema based deposits."""

from flask import current_app

from invenio.modules.deposit.types import JsonRecordDeposition

from .. import forms

from invenio.modules.deposit.json_utils import json2blob

__all__ = ['questions2']


class questions2(JsonRecordDeposition):

    """Submit CMS Statistics Questionnaire."""

    name = "CMS Statistics Questionnaire"
    name_plural = "CMS Statistics Questionnaire"
    group = "CMS Statistics Questionnaire"
    enabled = True
    draft_definitions = {
        'default': forms.CMSStatisticsQuestionnaire2,
    }

    @classmethod
    def process_sip_metadata(cls, deposition, metadata):
        """Implement this method in your subclass to process metadata prior to MARC generation."""
        super(questions2, cls).process_sip_metadata(deposition, metadata)
        metadata['980'] = 'CMSQuestionnaire'
