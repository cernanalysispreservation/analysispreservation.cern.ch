# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2021 CERN.
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

from flask import current_app, request
from flask_login import current_user

from invenio_accounts.models import User


def draft_url(record, **kwargs):
    """Get the draft html url of the analysis."""
    return f'{request.host_url}drafts/{record["_deposit"]["id"]}'


def published_url(record, **kwargs):
    """Get the published html url of the analysis."""
    if record.get("control_number"):
        return f'{request.host_url}published/{record["control_number"]}'
    return None


def working_url(record, **kwargs):
    """Get the working html url of the analysis."""
    status = record.get("_deposit", {}).get("status")

    if status == "draft":
        return draft_url(record)
    elif status == "published":
        return published_url(record)
    else:
        return None


def submitter_email(record, **kwargs):
    """Returns the submitter of the analysis, aka the current user."""
    return current_user.email


# error in cms-questionnaire config, reviewer should come from WG
def reviewer_email(record, **kwargs):
    """Returns the owner of the analysis."""
    owner_list = record.get("_deposit", {}).get("owners")
    if owner_list:
        return User.query.filter_by(id=owner_list[0]).one().email
    return None


def cms_stats_committee_by_pag(record, **kwargs):
    """Retrieve reviewer parameters according to the working group."""
    committee_pags = current_app.config.get("CMS_STATS_COMMITEE_AND_PAGS")
    working_group = record.get("analysis_context", {}).get("wg")

    if working_group and committee_pags:
        return committee_pags.get(working_group, {}).get("params", {})
    return {}
