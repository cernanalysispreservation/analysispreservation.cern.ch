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
# PURPOSE.  See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this software; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307,
# USA

"""Test form for jsondeposit."""

from invenio.base.i18n import _

from invenio.modules.deposit.form import JsonForm, WebDepositForm

from invenio_jsonschemas.api import internal_schema_url

from speaklater import make_lazy_string


__all__ = ('CMSStatisticsQuestionnaire2', )


class CMSStatisticsQuestionnaire2(WebDepositForm):
    __metaclass__ = JsonForm

    """Deposition Form."""

    """ Form Configuration variables """
    _name = 'test'
    _title = _('CMS Statistics Questionnaire')
    _subtitle = "Access to all submitted data will be restricted to the "\
                "CMS collaboration only."
    _drafting = True   # enable and disable drafting
    _schema = make_lazy_string(lambda: internal_schema_url('forms', 'cms_questionnaire-v0.1.0.json'))
