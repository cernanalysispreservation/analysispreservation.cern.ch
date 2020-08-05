# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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
"""Deposit links factory."""

from __future__ import absolute_import, print_function

from cachetools import LRUCache, cached
from cachetools.keys import hashkey
from flask import current_app, request
from invenio_records_files.links import default_bucket_link_factory

from cap.modules.records.utils import api_url_for, url_to_api_url

from .api import CAPDeposit
from .utils import extract_actions_from_class


@cached(LRUCache(maxsize=1024), key=lambda pid, **kwargs: hashkey(str(pid)))
def links_factory(pid, record=None, record_hit=None, **kwargs):
    """Deposit links factory."""
    links = {
        'self': api_url_for('depid_item', pid),
        'files': api_url_for('depid_files', pid),
        'html': current_app.config['DEPOSIT_UI_ENDPOINT'].format(
            host=request.host,
            scheme=request.scheme,
            pid_value=pid.pid_value,
        )
    }

    try:
        bucket_link = default_bucket_link_factory(pid)
        if bucket_link:
            links['bucket'] = url_to_api_url(bucket_link)
    except Exception:
        current_app.logger.info(
            f'Bucket link generation error for deposit: {pid.pid_value}')

    for action in extract_actions_from_class(CAPDeposit):
        links[action] = api_url_for('depid_actions', pid, action=action)

    return links
