# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the MIT License; see LICENSE file
# for more details.
"""Blueprint used for loading templates.

The sole purpose of this blueprint is to ensure that Invenio can find the
templates and static files located in the folders of the same names next to
this file.
"""

from __future__ import absolute_import, print_function

import json
from os.path import join

from elasticsearch import ConnectionError
from flask import Blueprint, jsonify
from invenio_files_rest.models import Location
from invenio_search import current_search
from sqlalchemy.exc import OperationalError

from cap.modules.access.utils import login_required
from cap.modules.deposit.fetchers import cap_deposit_fetcher
from cap.modules.deposit.search import CAPDepositSearch
from cap.modules.deposit.serializers import deposit_json_v1
from cap.modules.records.fetchers import cap_record_fetcher
from cap.modules.records.search import CAPRecordSearch
from cap.modules.records.serializers import record_json_v1
from cap.modules.workflows.utils import get_user_workflows

blueprint = Blueprint(
    'cap',
    __name__,
    template_folder='templates',
)


@blueprint.route('/ping', methods=['GET'])
@blueprint.route('/ping/<service>', methods=['GET'])
def ping(service=None):
    """Ping the services for status check."""
    try:
        if service is None:
            return 'Pong!', 200
        elif service == 'db':
            Location.get_default()
        elif service == 'search':
            current_search.cluster_version
        elif service == 'files':
            default_location = Location.get_default().uri
            test_file_path = join(default_location, 'test.txt')
            with open(test_file_path, 'r'):
                pass

        return 'OK!', 200
    except (OperationalError, IOError, ConnectionError):
        return 'ERROR', 500


@blueprint.route('/dashboard')
@login_required
def dashboard():
    """Dashboard view."""
    def _serialize_records(records):
        return json.loads(
            record_json_v1.serialize_search(
                cap_record_fetcher,
                records.to_dict()))['hits']['hits']    # noqa

    def _serialize_deposits(deposits):
        return json.loads(
            deposit_json_v1.serialize_search(
                cap_deposit_fetcher,
                deposits.to_dict()))['hits']['hits']    # noqa

    rs = CAPRecordSearch().extra(version=True).sort_by_latest()
    ds = CAPDepositSearch().extra(version=True).sort_by_latest()

    published = _serialize_records(rs[:5].execute())
    drafts = _serialize_deposits(ds[:5].execute())
    user_published = _serialize_records(rs.get_user_records()[:5].execute())
    user_published_count = rs.get_user_records().count()
    user_drafts = _serialize_deposits(ds.get_user_deposits()[:5].execute())
    user_drafts_count = ds.get_user_deposits().count()
    user_workflows = get_user_workflows()
    all_published_count = rs.count()
    all_drafts_count = ds.count()
    #
    #    user_workflows = [
    #        dict(name='demo-workflow#2',
    #             engine='serial',
    #             service='reana',
    #             status='running',
    #             record='Search for VH in the (l l, l nu, nu nu)'),
    #        dict(name='workflow#3',
    #             engine='yadage',
    #             service='reana',
    #             status='finished',
    #             record='Open Data validation Mu MuMonitor 2010'),
    #        dict(name='demo-workflow#1',
    #             engine='serial',
    #             service='reana',
    #             status='finished',
    #             record='Search for VH in the (l l, l nu, nu nu)'),
    #        dict(name='workflow#2',
    #             engine='yadage',
    #             service='reana',
    #             status='finished',
    #             record='Open Data validation Mu MuMonitor 2010')
    #    ]

    return jsonify({
        'published': {
            'data': published, 'more': '/search?q='
        },
        'drafts': {
            'data': drafts, 'more': '/drafts?q='
        },
        'user_published': {
            'data': user_published, 'more': '/search?q=&by_me=True'
        },
        'user_drafts': {
            'data': user_drafts, 'more': '/drafts?q=&by_me=True'
        },
        'user_workflows': {
            'data': user_workflows, 'more': '#'
        },
        'user_drafts_count': user_drafts_count,
        'user_published_count': user_published_count,
        'user_count': user_drafts_count + user_published_count,
        'all_drafts_count': all_drafts_count,
        'all_published_count': all_published_count,
    })
