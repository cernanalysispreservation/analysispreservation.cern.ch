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
from flask import current_app, abort
from flask_login import current_user
from invenio_db import db
from invenio_pidstore.resolver import Resolver
from invenio_pidstore.errors import PIDDoesNotExistError

from cap.modules.deposit.permissions import UpdateDepositPermission
from cap.modules.records.api import CAPRecord

from .errors import ExperimentIsNotValid
from .models import ReanaWorkflow
from .serializers import ReanaWorkflowSchema


def update_workflow(workflow, column, data):
    """Update a Reana column."""
    try:
        db.session.query(ReanaWorkflow) \
            .filter(ReanaWorkflow.workflow_id == workflow) \
            .update({column: data})
        db.session.commit()
    except Exception as e:
        abort(500, '{} has occured while '
              'updating the workflow.'.format(e))


def clone_workflow(workflow_id):
    """Clone the attributes of a Reana workflow."""
    try:
        wf = ReanaWorkflow.query.filter_by(workflow_id=workflow_id).one()
        return {'name': wf.name, 'workflow_json': wf.workflow_json}
    except Exception as e:
        abort(500, '{} has occured while '
              'cloning the workflow.'.format(e))


def get_user_workflows():
    """."""
    try:
        workflows = ReanaWorkflow.get_user_workflows(current_user.id)
        return [workflow.serialize() for workflow in workflows]
    except Exception as e:
        abort(500, e)


def resolve_uuid(workflow_id):
    """Resolve the workflow id into a UUID."""
    try:
        workflow = ReanaWorkflow.query.filter_by(workflow_id=workflow_id).one()
        return workflow.rec_uuid
    except Exception:
        abort(500, 'You tried to find a non-existing workflow.')


def resolve_depid(pid):
    """Resolve the workflow id into a UUID."""
    try:
        resolver = Resolver(pid_type='depid',
                            object_type='rec',
                            getter=lambda x: x)
        return resolver.resolve(pid)
    except PIDDoesNotExistError:
        abort(
            404, 'You tried to create a workflow and connect'
            ' it with a non-existing record')


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
        abort(500, 'Access token for {} is not available'.format(experiment))

    return token


def get_reana_user_token():
    """Retrieve token based on current user config."""
    token = current_app.config['REANA_USER_ACCESS_TOKEN']
    if not token:
        abort(500, 'Access token for current user is not available')
    return token


def update_deposit_workflow(deposit, user, name, workflow_name, resp,
                            rec_uuid, workflow_json):
    """Return the deposit with linking the created workflow on REANA."""
    try:
        # if record exist check if the user has 'deposit-update' rights
        with UpdateDepositPermission(deposit).require(403):
            # create a workflow dict, which can be used to populate
            # the db, but also used in the serializer
            _workflow = {
                'service': 'reana',
                'user_id': user.id,
                'name': name,
                'workflow_name': workflow_name,
                'workflow_name_run': resp['workflow_name'],
                'workflow_id': resp['workflow_id'],
                'rec_uuid': str(rec_uuid),
                'status': 'created',
                'workflow_json': workflow_json,
            }
            workflow = ReanaWorkflow(**_workflow)
            db.session.add(workflow)
            db.session.commit()
    except Exception as e:
        abort(
            500, 'An error occured while updating the record {}'.format(e))

    workflow_serialized = ReanaWorkflowSchema().dump(_workflow).data
    return workflow_serialized
