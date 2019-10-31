# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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

"""Workflows utils."""
from flask import current_app

from invenio_db import db

from .errors import ExperimentIsNotValid
from .models import ReanaWorkflow
from cap.modules.records.api import CAPRecord

from invenio_pidstore.resolver import Resolver


def update_workflow(workflow, column, data):
    """Update a Reana column."""
    db.session.query(ReanaWorkflow) \
        .filter(ReanaWorkflow.workflow_id == workflow) \
        .update({column: data})
    db.session.commit()


def clone_workflow(workflow_id):
    """Clone the attributes of a Reana workflow."""
    wf = ReanaWorkflow.query.filter_by(workflow_id=workflow_id).one()
    return {
        'name': wf.name,
        'workflow_json': wf.workflow_json
    }


def resolve_uuid(workflow_id):
    """Resolve the workflow id into a UUID."""
    workflow = ReanaWorkflow.query.filter_by(workflow_id=workflow_id).one()
    return workflow.rec_uuid


def resolve_depid(depid):
    """Resolve the workflow id into a UUID."""
    resolver = Resolver(pid_type='depid',
                        object_type='rec',
                        getter=lambda x: x)

    # deposit, rec_uuid = resolver.resolve(depid)
    # workflow = ReanaWorkflow.query.filter_by(workflow_id=workflow_id).first()
    return resolver.resolve(depid)


def get_reana_token(uuid, record=None):
    """Retrieve token based on experiment, by UUID."""
    if not record:
        record = CAPRecord.get_record(uuid)

    experiment = record.get('_experiment')

    if not experiment:
        raise ExperimentIsNotValid('Experiment is not valid.')

    # assign the token to the correct experiment
    token = current_app.config['REANA_ACCESS_TOKEN'].get(experiment)
    if not token:
        raise ExperimentIsNotValid(
            'Access token for {} is not available'.format(experiment))

    return token
