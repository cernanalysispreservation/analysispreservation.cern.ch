# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2014, 2015 CERN.
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

"""Questions workflow for JSON-schema based deposits."""

from invenio_deposit.types import SimpleRecordDeposition

from ..forms.lhcb import LHCbDataAnalysisForm

__all__ = ['lhcb']


class lhcb(SimpleRecordDeposition):

    """Submit LHCb Statistics Questionnaire."""

    name = "LHCb Data Analysis"
    name_plural = "LHCb Data Analysis"
    group = "LHCb Data Analysis"
    enabled = True
    draft_definitions = {
        'default': LHCbDataAnalysisForm,
    }
