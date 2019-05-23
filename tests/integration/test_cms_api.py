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
# or submit itself to any jurisdiction.

"""Integration tests for CAP api."""

from __future__ import absolute_import, print_function

import json

from flask import current_app

from cap.modules.experiments.errors import ExternalAPIException
from mock import patch
from pytest import mark


################
# api/cms/cadi
################
def test_get_cms_cadi_when_user_from_outside_cms_returns_403(app, users,
                                                             auth_headers_for_user):
    with app.test_client() as client:
        user_headers = auth_headers_for_user(users['lhcb_user'])
        resp = client.get('/cms/cadi/EXO-17-023',
                          headers=user_headers)

        assert resp.status_code == 403


@patch('cap.modules.experiments.views.cms.get_from_cadi_by_id', return_value={})
def test_get_cms_cadi_when_cms_user_returns_200(mock_get_from_cadi_by_id, app, users, auth_headers_for_user):
    with app.test_client() as client:
        resp = client.get('/cms/cadi/ANA-00-001',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.status_code == 200


@patch('cap.modules.experiments.views.cms.get_from_cadi_by_id', return_value={})
def test_get_cms_cadi_when_non_existing_cadi_number_returns_empty_object(mock_get_from_cadi_by_id, app, auth_headers_for_superuser):
    with app.test_client() as client:
        resp = client.get('/cms/cadi/non-existing',
                          headers=auth_headers_for_superuser)

        assert resp.json == {}


@patch('cap.modules.experiments.views.cms.get_from_cadi_by_id')
def test_get_cms_cadi_when_existing_cadi_number_returns_object_with_parsed_data(mock_get_from_cadi_by_id, app,
                                                                             auth_headers_for_superuser):
    cadi_response = {
        u'Conference': '',
        u'conferenceStatus': '',
        u'code': 'dANA-00-000',
        u'targetConference': None,
        u'approvalTalk': 'https://indico.cern.ch/event/event.pdf',
        u'updaterDate': '24/12/2014',
        u'creatorDate': '14/12/2014',
        u'PAS': 'http://cms.cern.ch:80/pas.pdf',
        u'id': 1,
        u'updaterName': 'Updater User',
        u'targetPubPeriod': None,
        u'targetDatePreApp': '19/12/2014',
        u'PAPERTAR': 'http://cms.cern.ch:80/paper.tgz',
        u'contact': 'Contact User',
        u'status': 'PUB',
        u'URL': 'https://twiki.cern.ch/twikiurl',
        u'creatorName': 'Creator User',
        u'publicationStatus': 'Free',
        u'name': 'Name',
        u'PAPER': 'http://cms.cern.ch:80/paper.pdf',
        u'description': 'Projections for 2HDM Higgs studies (H-&gt;ZZ and A-&gt;Zh) in 3000 fb-1',
        u'name': '2HDM Higgs studies (H-&gt;ZZ and A-&gt;Zh)'
    }
    mock_get_from_cadi_by_id.return_value = cadi_response

    with app.test_client() as client:
        resp = client.get('/cms/cadi/ANA-00-000',
                          headers=auth_headers_for_superuser)

        mock_get_from_cadi_by_id.assert_called_with('ANA-00-000')

        assert resp.json == {
            'description': 'Projections for 2HDM Higgs studies (H->ZZ and A->Zh) in 3000 fb-1',
            'name': '2HDM Higgs studies (H->ZZ and A->Zh)',
            'contact': 'Contact User',
            'created': '14/12/2014',
            'twiki': 'https://twiki.cern.ch/twikiurl',
            'paper': 'http://cms.cern.ch:80/paper.pdf',
            'pas': 'http://cms.cern.ch:80/pas.pdf',
            'publication_status': 'Free',
            'status': 'PUB',
        }


@patch('cap.modules.experiments.views.cms.get_from_cadi_by_id', side_effect=ExternalAPIException())
def test_get_cms_cadi_when_cadi_server_replied_with_an_error_returns_503(mock_get_from_cadi_by_id, app, auth_headers_for_superuser):
    with app.test_client() as client:
        resp = client.get('/cms/cadi/non-existing',
                          headers=auth_headers_for_superuser)

        assert resp.status_code == 503


##################
# api/cms/datasets
##################
def test_get_datasets_suggestions_when_user_from_outside_cms_returns_403(app, users,
                                                                         auth_headers_for_user):
    with app.test_client() as client:
        resp = client.get('/cms/datasets?query=q',
                          headers=auth_headers_for_user(users['lhcb_user']))

        assert resp.status_code == 403


def test_get_datasets_suggestions_when_cms_user_returns_200(app, users,auth_headers_for_user, das_datasets_index):
    with app.test_client() as client:
        resp = client.get('/cms/datasets?query=q',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.status_code == 200


def test_get_datasets_suggestions_when_no_query_passed_returns_empty_list(app, users,auth_headers_for_user, das_datasets_index):
    with app.test_client() as client:
        resp = client.get('/cms/datasets?query=',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.json == []

def test_get_datasets_suggestions_returns_correct_suggestions(app, users,auth_headers_for_user, das_datasets_index):
    with app.test_client() as client:
        resp = client.get('/cms/datasets?query=datas',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.json == ['dataset1', 'dataset2']

        resp = client.get('/cms/datasets?query=another_',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.json == ['another_dataset']


##################
# api/cms/triggers
##################
def test_get_triggers_suggestions_when_user_from_outside_cms_returns_403(app, users,
                                                                         auth_headers_for_user):
    with app.test_client() as client:
        resp = client.get('/cms/triggers?query=q&dataset=D',
                          headers=auth_headers_for_user(users['lhcb_user']))

        assert resp.status_code == 403


def test_get_triggers_suggestions_when_cms_user_returns_200(app, users,auth_headers_for_user, cms_triggers_index):
    with app.test_client() as client:
        resp = client.get('/cms/triggers?query=q&dataset=D',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.status_code == 200


def test_get_triggers_suggestions_when_no_query_passed_returns_empty_list(app, users,auth_headers_for_user, cms_triggers_index):
    with app.test_client() as client:
        resp = client.get('/cms/triggers?query=&dataset=D',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.json == []
        

def test_get_triggers_suggestions_when_no_query_or_dataset_passed_returns_empty_list(app, users,auth_headers_for_user, cms_triggers_index):
    with app.test_client() as client:
        resp = client.get('/cms/triggers?query=&dataset=',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.json == []


@mark.skip
def test_get_triggers_suggestions_returns_correct_suggestions(app, users,auth_headers_for_user, cms_triggers_index):
    with app.test_client() as client:
        resp = client.get('/cms/triggers?query=Sss&dataset=/Dataset1/sth/sth/sth',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.json == []

        resp = client.get('/cms/triggers?query=T&dataset=/Dataset1/sth/sth/sth',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.json == ['Trigger1', 'Trigger_2']

        resp = client.get('/cms/triggers?query=Another&dataset=Dataset1/sth/sth/sth',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.json == ['Another_Trigger']

        resp = client.get('/cms/triggers?query=Trigger1&dataset=/Dataset2/sth/sth/sth',
                          headers=auth_headers_for_user(users['cms_user']))

        assert resp.json == ['Trigger1']
