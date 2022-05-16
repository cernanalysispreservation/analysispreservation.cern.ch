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

from flask import url_for
from marshmallow import Schema, fields

from cap.modules.records.utils import url_to_api_url


class ReanaWorkflowSchema(Schema):
    """Schema for a single REANA workflow."""

    name = fields.Str(dump_only=True)
    run = fields.Str(attribute='name_run', dump_only=True)
    workflow_name = fields.Str(attribute='name_run', dump_only=True)
    workflow_id = fields.Str(dump_only=True)

    rec_uuid = fields.Str(dump_only=True)
    status = fields.Str(dump_only=True)
    service = fields.Str(dump_only=True)
    workflow_json = fields.Dict(dump_only=True)

    created = fields.DateTime(dump_only=True)
    updated = fields.DateTime(dump_only=True)

    links = fields.Method('build_links', dump_only=True)

    def build_links(self, obj):
        """Construct workflow links."""
        def url_with_wf(path):
            return url_to_api_url(
                url_for(path, workflow_id=obj.workflow_id))

        links = {
            'ui': url_for('cap_workflows.get_all_workflows_by_cap_user'),
            'create':
                url_to_api_url(url_for('cap_workflows.workflow_create')),
            'run': url_to_api_url(url_for('cap_workflows.run_workflow')),
            'clone': url_with_wf('cap_workflows.workflow_clone'),
            'start': url_with_wf('cap_workflows.workflow_start'),
            'stop': url_with_wf('cap_workflows.workflow_stop'),
            'delete': url_with_wf('cap_workflows.workflow_delete'),
            'files': url_with_wf('cap_workflows.list_workflow_files'),
            'status': url_with_wf('cap_workflows.workflow_status'),
            'logs': url_with_wf('cap_workflows.workflow_logs'),
            'self': url_with_wf('cap_workflows.get_serialized_workflow'),
        }
        return links


class ReanaWorkflowLogsSchema(Schema):
    """Schema for the REANA logs of a single workflow."""

    workflow_name = fields.Str(dump_only=True)
    workflow_id = fields.Str(dump_only=True)
    rec_uuid = fields.Str(dump_only=True)
    logs = fields.Method('extract_logs', dump_only=True)

    def extract_logs(self, obj):
        """Extracts the logs to json form."""
        return json.loads(obj['logs'])


reana_workflow_serializer = ReanaWorkflowSchema()
