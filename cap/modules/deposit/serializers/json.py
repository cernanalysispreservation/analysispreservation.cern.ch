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
"""CAP Basic Serializers."""

from flask import current_app

from invenio_pidstore.models import PersistentIdentifier
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_records_rest.serializers.json import JSONSerializer

from cap.modules.deposit.api import CAPDeposit
from cap.modules.deposit.links import links_factory as deposit_links_factory
from cap.modules.records.utils import url_to_api_url


class DepositSerializer(JSONSerializer):
    """Serializer for records v1 in JSON."""
    def preprocess_record(self, pid, record, links_factory=None, **kwargs):
        """Preprocess record serializing for record retrievals from the db.

        Call base serializer with deposit_links_factory explicitly.
        (bug in invenio doesn't pass correct one on deposit actions
        (e.g. /actions/publish)
        """
        result = super().preprocess_record(
            pid, record, links_factory=deposit_links_factory)

        result['deposit'] = CAPDeposit.get_record(pid.object_uuid)
        return result

    def preprocess_search_hit(self, pid, record_hit, links_factory=None):
        """Fetch PID object for records retrievals from ES."""
        try:
            pid = PersistentIdentifier.get(pid_type=pid.pid_type,
                                           pid_value=pid.pid_value)

            result = super().preprocess_search_hit(
                pid, record_hit, links_factory=links_factory)
            return result
        except PIDDoesNotExistError:
            current_app.logger.info(
                f'PIDDoesNotExistError on search. Record:.')

    def serialize_search(self, pid_fetcher, search_result, links=None,
                         item_links_factory=None, **kwargs):
        """Serialize a search result.

        :param pid_fetcher: Persistent identifier fetcher.
        :param search_result: Elasticsearch search result.
        :param links: Dictionary of links to add to response.
        """
        links = {
            k: url_to_api_url(v)
            for k, v in links.items()
        } if links else {}

        return super().serialize_search(pid_fetcher,
                                        search_result,
                                        links=links,
                                        item_links_factory=item_links_factory)
