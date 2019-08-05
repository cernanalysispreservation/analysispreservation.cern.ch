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
import logging

from invenio_db import db
from celery import shared_task
from flask import current_app

from . import blueprint
from .orcid import get_orcid_no_route, get_record_by_orcid_no_route
from .zenodo import get_zenodo_record_no_route
from .cern import ldap_user_by_mail_no_route, ldap_egroup_mail_no_route
from ..models import StatusCheck

from cap.modules.experiments.views.atlas import get_glance_by_id_no_route
from cap.modules.experiments.views.cms import get_analysis_from_cadi_no_route


status_checks = [
    {
        'func': get_orcid_no_route,
        'args': ('Ilias', 'Koutsakis'),
        'should_return': u'0000-0003-0710-0576',
        'type': 'orcid'
    }, {
        'func': get_record_by_orcid_no_route,
        'args': '0000-0003-0710-0576',
        'should_return': u'0000-0003-0710-0576',
        'type': 'orcid'
    }, {
        'func': get_zenodo_record_no_route,
        'args': '3243963',
        'should_return': u'10.5281/zenodo.3243963',
        'type': 'zenodo'
    }, {
        'func': ldap_user_by_mail_no_route,
        'args': 'ilias.koutsakis@cern.ch',
        'should_return': 'ilias.koutsakis@cern.ch',
        'type': 'ldap'
    }, {
        'func': ldap_egroup_mail_no_route,
        'args': 'sis-group-documentation',
        'should_return': 'sis-group-documentation@cern.ch',
        'type': 'ldap'
    }, {
        'func': get_glance_by_id_no_route,
        'args': '225',
        'should_return': 225,
        'type': 'lhcb'
    }, {
        'func': get_analysis_from_cadi_no_route,
        'args': 'EXO-17-023',
        'should_return': u'https://twiki.cern.ch/twiki/bin/view/CMS/EXO17023',
        'type': 'cadi'
    }
]


@blueprint.route('/status')
@shared_task()
def status_check():
    """Check the external APIs for functionality."""
    current_app.logger.info('Checking APIs...')

    logs = []
    for item in status_checks:
        func, args = item['func'], item['args']
        name = func.__name__

        url, status, data = func(args)

        if data == item['should_return']:
            logs.append({
                'url': url,
                'status': 'Success',
                'data_returned': ''})
            current_app.logger.info('{} was successful.'.format(name))
            status_to_save = StatusCheck(url=url, status='Success', message=data)
        else:
            logs.append({
                'url': url,
                'status': status,
                'data_returned': data})
            current_app.logger.error('{} failed.'.format(name))
            status_to_save = StatusCheck(url=url, status=status, message=data)

        db.session.add(status_to_save)
    db.session.commit()
    return logs


@shared_task()
def clear_status_table(days=0):
    """Truncates the status_checks table."""
    current_app.logger.info('Truncating status_check table.')
    StatusCheck.truncate_table_older_than(days)
