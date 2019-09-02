# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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


"""CAP CERN services status checks."""

from __future__ import absolute_import, print_function

from invenio_db import db
from celery import shared_task
from flask import current_app, jsonify

from . import blueprint
from .orcid import _get_orcid
from .zenodo import _get_zenodo_record
from .cern import _ldap
from .indico import _indico
from ..models import StatusCheck
from ..test_responses.responses import orcid_id, orcid_name, zenodo, \
    ldap_egroup, ldap_mail, cms_cadi, atlas_glance, github, gitlab, indico

from cap.views import ping
from cap.modules.experiments.views.atlas import _get_glance_by_id
from cap.modules.experiments.views.cms import _get_cadi
from cap.modules.repoimporter.git_importer import _test_connection


status_checks = [
    # EXTERNAL SERVICES
    {
        'func': _get_orcid,
        'args': {'arg': 'Ilias Koutsakis'},
        'should_return': orcid_name,
        'service': 'orcid_name',
        'log': 'Checking ORCID GET by name...'
    }, {
        'func': _get_orcid,
        'args': {'arg': '0000-0003-0710-0576', 'by': 'orcid'},
        'should_return': orcid_id,
        'service': 'orcid_id',
        'log': 'Checking ORCID GET by id...'
    }, {
        'func': _get_zenodo_record,
        'args': {'zenodo_id': '3243963'},
        'should_return': zenodo,
        'service': 'zenodo',
        'log': 'Checking ZENODO GET by record id...'
    }, {
        'func': _ldap,
        'args': {'query': 'ilias.koutsakis@cern.ch', 'sf': None, 'by': 'mail'},
        'should_return': ldap_mail,
        'service': 'ldap_mail',
        'log': 'Checking CERN LDAP by mail...'
    }, {
        'func': _ldap,
        'args': {'query': 'sis-group-documentation',
                 'sf': 'cn', 'by': 'egroup'},
        'should_return': ldap_egroup,
        'service': 'ldap_egroup',
        'log': 'Checking CERN LDAP by egroup...'
    }, {
        'func': _indico,
        'args': {'event_id': '845049'},
        'should_return': indico,
        'service': 'indico',
        'log': 'Checking Indico GET by event id...'
    },

    # INTERNAL SERVICES
    {
        'func': ping,
        'args': {'service': 'db'},
        'should_return': {'message': 'OK'},
        'service': 'cap_db',
        'log': 'Checking Postgres API...'
    }, {
        'func': ping,
        'args': {'service': 'search'},
        'should_return': {'message': 'OK'},
        'service': 'cap_es',
        'log': 'Checking ElasticSearch API...'
    }, {
        'func': ping,
        'args': {'service': 'files'},
        'should_return': {'message': 'OK'},
        'service': 'cap_files',
        'log': 'Checking Files API...'
    },

    # EXPERIMENTS
    {
        'func': _get_glance_by_id,
        'args': {'glance_id': '225'},
        'should_return': atlas_glance,
        'service': 'atlas_glance',
        'log': 'Checking ATLAS Glance API...'
    }, {
        'func': _get_cadi,
        'args': {'cadi_id': 'EXO-17-023'},
        'should_return': cms_cadi,
        'service': 'cms_cadi',
        'log': 'Checking CMS CADI API...'
    },

    # GITHUB / GITLAB
    {
        'func': _test_connection,
        'args': {'client': 'github'},
        'should_return': github,
        'service': 'github',
        'log': 'Checking GitHub API...'
    }, {
        'func': _test_connection,
        'args': {'client': 'gitlab'},
        'should_return': gitlab,
        'service': 'gitlab',
        'log': 'Checking GitLab API...'
    },
]


def _status_check():
    """Checks external APIs and save the results on DB."""
    logs = []

    for service in status_checks:
        log, name = service['log'], service['service']
        resp, status = service['func'](**service['args'])

        # deep equality comparison of dict responses
        # if cmp(data, service['should_return']) == 0:
        if status == 200:
            msg = None
            current_app.logger.info('{}\nStatus: {}'
                                    .format(log, status))
        else:
            msg = resp
            current_app.logger.info('{}\nStatus: {}\nReason:\n{}'
                                    .format(log, status, msg))

        logs.append({
            'service': name,
            'status': status,
            'message': msg,
        })
        service_status = StatusCheck(service=name, status=status, message=msg)
        db.session.add(service_status)

    db.session.commit()
    return logs


@blueprint.route('/status')
def status_check():
    """Checks the external APIs for functionality (route)."""
    logs = _status_check()
    return jsonify(logs)


@shared_task()
def clear_status_table(days=0):
    """Truncates the status_checks table."""
    current_app.logger.info('Truncating status_check table.')
    StatusCheck.truncate_table_older_than(days)
