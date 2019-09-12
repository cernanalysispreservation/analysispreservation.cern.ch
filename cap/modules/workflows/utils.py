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


def bool2num(x):
    """Boolean to number."""
    return 1 if x else 0


def update_workflow(workflow, column, data):
    """Update a Reana column."""
    db.session.query(ReanaWorkflow) \
        .filter(ReanaWorkflow.workflow_id == workflow) \
        .update({column: data})
    db.session.commit()


def get_request_attributes(req):
    """Retrieve the required arguments from the REANA request."""
    args = req.get_json()
    record_id = args.get('record_id')
    token = get_reana_token(record_id)
    return args, record_id, token


def get_reana_token(uuid):
    """Retrieve token based on experiment."""
    experiment = CAPRecord.get_record(uuid).get('_experiment', None)
    if not experiment:
        raise ExperimentIsNotValid('Experiment is not valid.')

    token = current_app.config['REANA_ACCESS_TOKEN'].get(experiment, None)
    if not token:
        raise ExperimentIsNotValid('Access token for {} is not available'
                                   .format(experiment))
    return token
