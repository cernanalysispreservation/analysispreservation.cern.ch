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

"""Serializers for Reana models."""

from __future__ import absolute_import, print_function
import json

from marshmallow import Schema, fields


class ReanaWorkflowSchema(Schema):
    """Schema for a single REANA workflow."""

    workflow_name = fields.Str(attribute='name_run', dump_only=True)
    workflow_id = fields.Str(dump_only=True)

    record_id = fields.Str(dump_only=True)
    status = fields.Str(dump_only=True)
    engine = fields.Str(dump_only=True)


class ReanaAllWorkflowsSchema(Schema):
    """Schema for the REANA workflows of a single record."""

    record_id = fields.Str(dump_only=True)
    current_workflows = fields.Method('get_current', dump_only=True)
    deleted_workflows = fields.Method('get_deleted', dump_only=True)

    def get_current(self, obj):
        """Returns the non-deleted workflows."""
        return [
            {'name': wf['name'], 'id': wf['id'], 'status': wf['status']}
            for wf in obj['workflows']
            if wf['status'] != 'deleted'
        ]

    def get_deleted(self, obj):
        """Returns the deleted workflows."""
        return [
            {'name': wf['name'], 'id': wf['id'], 'status': wf['status']}
            for wf in obj['workflows']
            if wf['status'] == 'deleted'
        ]


class ReanaWorkflowLogsSchema(Schema):
    """Schema for the REANA logs of a single workflow."""

    workflow_name = fields.Str(dump_only=True)
    workflow_id = fields.Str(dump_only=True)
    record_id = fields.Str(dump_only=True)
    logs = fields.Method('extract_logs', dump_only=True)

    def extract_logs(self, obj):
        """Extracts the logs to json form."""
        return json.loads(obj['logs'])
