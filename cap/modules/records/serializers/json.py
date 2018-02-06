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


from __future__ import absolute_import, print_function

from invenio_accounts.models import User
from invenio_records_rest.serializers.json import JSONSerializer
from invenio_records_files.api import Record


class CAPSchemaSerializer(JSONSerializer):
    """Serializer for records v1 in JSON."""

    def preprocess_record(self, pid, record, links_factory=None, **kwargs):
        """Include files for single record retrievals."""
        result = super(CAPSchemaSerializer, self).preprocess_record(
            pid, record, links_factory=links_factory
        )

        # Add/remove files depending on access right.
        if isinstance(record, Record) and record.files:
            #     if not has_request_context() or has_read_files_permission(
            #             current_user, record):
            result['files'] = record['_files']

        return result


class BasicJSONSerializer(JSONSerializer):
    """Serializer for deposit client in JSON."""

    def preprocess_record(self, pid, record, links_factory=None, **kwargs):
        """Remove unnecessary values for client"""
        result = super(BasicJSONSerializer, self).preprocess_record(
            pid, record, links_factory=links_factory
        )

        result['metadata'] = {k: v for k, v in result.get(
            'metadata', {}).items() if not k.startswith('_')}

        return result


class PermissionsJSONSerializer(JSONSerializer):
    """Serializer for returning deposit
        permissions in JSON"""

    def preprocess_record(self, pid, record, links_factory=None, **kwargs):
        """Remove unnecessary values for client"""
        result = super(PermissionsJSONSerializer, self).preprocess_record(
            pid, record, links_factory=links_factory
        )

        result['metadata'] = result.get('metadata', {}).get('_access', {})

        for k, v in result['metadata'].items():
            if v['user']:
                for index, user_id in enumerate(v['user']):
                    user = User.query.filter_by(id=user_id).one()
                    v['user'][index] = user.email

        return result
