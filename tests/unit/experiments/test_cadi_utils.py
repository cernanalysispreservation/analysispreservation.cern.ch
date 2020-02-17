# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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
"""Tests for CADI utils methods."""

from __future__ import absolute_import

import responses
from flask import current_app
from invenio_search import current_search
from mock import patch
from mock.mock import MagicMock
from pytest import mark, raises

from cap.modules.deposit.errors import DepositDoesNotExist
from cap.modules.experiments.errors import ExternalAPIException
from cap.modules.experiments.serializers import CADISchema
from cap.modules.experiments.utils.cadi import (get_all_from_cadi,
                                                get_deposit_by_cadi_id,
                                                get_from_cadi_by_id,
                                                synchronize_cadi_entries)
from conftest import _datastore, assign_egroup_to_experiment


@responses.activate
@patch('cap.modules.experiments.utils.cadi.get_sso_cookie_for_cadi')
def test_get_from_cadi_by_id(mock_get_sso_cookie_for_cadi, app):
    cookie = dict(cookies_are='example_cookie')
    cadi_id = 'ANA-00-000'
    cadi_resp = {
        'data': [{
            u'Conference': '',
            u'conferenceStatus': '',
            u'code': 'dANA-00-000',
            u'targetConference': None,
            u'approvalTalk': 'https://indico.cern.ch/event/event.pdf',
            u'updaterDate': '24/12/2014',
            u'PAS': 'http://cms.cern.ch:80/pas.pdf',
            u'id': 1,
            u'updaterName': 'Updater User',
            u'targetPubPeriod': None,
            u'targetDatePreApp': '19/12/2014',
            u'PAPERTAR': 'http://cms.cern.ch:80/paper.tgz',
            u'contact': 'Contact User',
            u'status': 'PUB',
            u'description': 'Description',
            u'URL': 'https://twiki.cern.ch/twikiurl',
            u'creatorName': 'Creator User',
            u'publicationStatus': 'Free',
            u'name': 'Name',
            u'PAPER': 'http://cms.cern.ch:80/paper.pdf'
        }]
    }

    mock_get_sso_cookie_for_cadi.return_value = cookie
    responses.add(responses.GET,
                  current_app.config['CADI_GET_RECORD_URL'].format(id=cadi_id),
                  json=cadi_resp,
                  status=200)

    output = get_from_cadi_by_id(cadi_id)

    # check that requst to glance is called with correct url and cookie
    assert responses.calls[
        0].request.url == 'https://icms.cern.ch/tools/api/cadiLine/{id}'.format(
            id=cadi_id)
    assert responses.calls[0].request._cookies == cookie

    # check the response
    assert output == cadi_resp['data'][0]


@responses.activate
@patch('cap.modules.experiments.utils.cadi.generate_krb_cookie',
       MagicMock(return_value=dict(cookies_are='example_cookie')))
def test_get_from_cadi_by_id_when_no_entry_with_given_cadi_id_returns_empty_dict(
        app):
    cadi_id = 'non-existing'
    # CADI API returns empty list, when no match with given id
    cadi_resp = dict(data=[])

    responses.add(
        responses.GET,
        current_app.config['CADI_GET_RECORD_URL'].format(id='NON-EXISTING'),
        json=cadi_resp,
        status=200)

    output = get_from_cadi_by_id(cadi_id)

    # check the response
    assert output == {}


@responses.activate
@patch('cap.modules.experiments.utils.cadi.get_sso_cookie_for_cadi',
       MagicMock(return_value=dict(cookies_are='example_cookie')))
def test_get_from_cadi_by_id_when_cadi_server_down_returns_503(app):
    cadi_id = 'ANA-00-000'

    responses.add(responses.GET,
                  current_app.config['CADI_GET_RECORD_URL'].format(id=cadi_id),
                  status=500)

    with raises(ExternalAPIException):
        get_from_cadi_by_id(cadi_id)


@responses.activate
@patch('cap.modules.experiments.utils.cadi.get_sso_cookie_for_cadi',
       MagicMock(side_effect=ExternalAPIException()))
def test_get_from_cadi_by_id_when_cadi_server_down_while_asking_for_auth_returns_503(
        app):
    cadi_id = 'ANA-00-000'

    with raises(ExternalAPIException):
        get_from_cadi_by_id(cadi_id)


@responses.activate
@patch('cap.modules.experiments.utils.cadi.get_sso_cookie_for_cadi')
def test_get_all_from_cadi(mock_get_sso_cookie_for_cadi, app):
    cookie = dict(cookies_are='example_cookie')
    cadi_resp = dict(data=[
        dict(code=u'dANA-00-001', status=u'Inactive'),
        dict(code=u'dANA-00-002', status=u'PUB'),
        dict(code=u'dANA-00-003', status=u'SUPERSEDED')
    ])

    mock_get_sso_cookie_for_cadi.return_value = cookie
    responses.add(responses.POST,
                  current_app.config['CADI_GET_ALL_URL'],
                  json=cadi_resp,
                  status=200)

    output = list(get_all_from_cadi())

    # check that request to glance is called with correct url and cookie
    assert responses.calls[
        0].request.url == 'https://icms.cern.ch/tools/api/viewCadiLines'
    assert responses.calls[0].request._cookies == cookie

    # check that inactive|supseded analysis are not returned
    assert dict(code='dANA-00-001', status='Inactive') not in output
    assert dict(code='dANA-00-003', status='SUPERSEDED') not in output

    # check that inactive|supseded analysis are not returned
    assert output == [dict(code='dANA-00-002', status='PUB')]


@responses.activate
@patch('cap.modules.experiments.utils.cadi.get_sso_cookie_for_cadi',
       MagicMock(return_value=dict(cookies_are='example_cookie')))
def test_get_all_from_cadi_when_cadi_server_down_returns_503(app):
    responses.add(responses.POST,
                  current_app.config['CADI_GET_ALL_URL'],
                  status=500)

    with raises(ExternalAPIException):
        get_all_from_cadi()


@responses.activate
@patch('cap.modules.experiments.utils.cadi.get_sso_cookie_for_cadi',
       MagicMock(side_effect=ExternalAPIException()))
def test_get_all_from_cadi_when_cadi_server_down_while_asking_for_auth_returns_503(
        app):
    with raises(ExternalAPIException):
        get_all_from_cadi()


def test_parse_cadi_entry():
    cadi_resp = {
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
        u'PAPER': 'http://cms.cern.ch:80/paper.pdf',
        u'description': 'Projections for 2HDM Higgs studies (H-&gt;ZZ and A-&gt;Zh) in 3000 fb-1',
        u'name': '2HDM Higgs studies (H-&gt;ZZ and A-&gt;Zh)'
    }

    serializer = CADISchema()
    parsed = serializer.dump(cadi_resp).data

    assert parsed == {
        'description': 'Projections for 2HDM Higgs studies (H->ZZ and A->Zh) in 3000 fb-1',
        'name': '2HDM Higgs studies (H->ZZ and A->Zh)',
        'contact': 'Contact User',
        'created': '14/12/2014',
        'twiki': 'https://twiki.cern.ch/twikiurl',
        'paper': 'http://cms.cern.ch:80/paper.pdf',
        'pas': 'http://cms.cern.ch:80/pas.pdf',
        'publication_status': 'Free',
        'status': 'PUB',
        'cadi_id': 'ANA-00-000'
    }


def test_parse_cadi_entry_when_entry_missing_some_fields():
    cadi_resp = {
        u'code': 'ANA-00-000',
        u'PAPER': 'http://cms.cern.ch:80/paper.pdf',
        u'description': 'Projections for 2HDM Higgs studies (H-&gt;ZZ and A-&gt;Zh) in 3000 fb-1',
        u'name': '2HDM Higgs studies (H-&gt;ZZ and A-&gt;Zh)'
    }

    serializer = CADISchema()
    parsed = serializer.dump(cadi_resp).data

    assert parsed == {
        'description': 'Projections for 2HDM Higgs studies (H->ZZ and A->Zh) in 3000 fb-1',
        'name': '2HDM Higgs studies (H->ZZ and A->Zh)',
        'contact': '',
        'created': '',
        'twiki': '',
        'paper': 'http://cms.cern.ch:80/paper.pdf',
        'pas': '',
        'publication_status': '',
        'status': '',
        'cadi_id': 'ANA-00-000'
    }


def test_get_deposit_by_cadi_id_returns_correct_deposit(
        app, es, create_deposit, superuser):
    cadi_id = 'ANA-00-001'
    deposit = create_deposit(superuser, 'cms-analysis', {
        '$ana_type': 'cms-analysis',
        'basic_info': {
            'cadi_id': cadi_id
        }
    })
    create_deposit(superuser, 'cms-analysis', {
        '$ana_type': 'cms-analysis',
        'basic_info': {
            'cadi_id': 'ANA-00-002'
        }
    })

    assert get_deposit_by_cadi_id(cadi_id) == deposit


@mark.skip(
    'it works in prod, just needs a specific mapping definition for tests,'
    'where cadi_id is mapped as a kewyword, not as text with dynamic map')
def test_get_deposit_by_cadi_id_when_no_match_raises_DepositDoesNotExist(
        app, es, create_deposit, superuser):
    create_deposit(superuser, 'cms-analysis', {
        '$ana_type': 'cms-analysis',
        'basic_info': {
            'cadi_id': 'ANA-00-001'
        }
    })

    with raises(DepositDoesNotExist):
        get_deposit_by_cadi_id('ANA-00-002')


# @TOFIX schemas module still uses mappings from files, that's why we use existing schemas
# this should be patched in schemas PR
@mark.skip('problem with app fixture that pushes app ctx. Needs to be fixed')
@patch('cap.modules.experiments.utils.cadi.get_all_from_cadi',
       MagicMock(return_value=[dict(code=u'dANA-00-001', status=u'Free')]))
def test_synchronize_cadi_entries_when_entry_doesnt_exist_creates_a_new_one(
        base_app, es, location, create_schema):
    create_schema('cms-analysis', experiment='CMS', version='0.0.1')
    group_with_r_access = assign_egroup_to_experiment('cms-members@cern.ch',
                                                      'CMS')
    group_with_rw_access = _datastore.find_or_create_role(
        'cms-cap-admin@cern.ch')

    # deposit with this cadi id doesn't exist
    with raises(DepositDoesNotExist):
        get_deposit_by_cadi_id('ANA-00-001')

    synchronize_cadi_entries()

    current_search.flush_and_refresh('deposits-records')

    # deposit with this cadi id created
    deposit = get_deposit_by_cadi_id('ANA-00-001')

    assert deposit['cadi_info'] == {
        'cadi_id': 'ANA-00-001',
        'contact': '',
        'created': '',
        'description': '',
        'name': '',
        'paper': '',
        'pas': '',
        'publication_status': '',
        'status': 'Free',
        'twiki': ''
    }  # sets cadi info correctly
    assert deposit['basic_info']['cadi_id'] == 'ANA-00-001'  # sets cadi id
    assert deposit['general_title'] == 'ANA-00-001'

    # members of experiment got read access and cms-cap-admin egroup write access
    assert deposit['_access']['deposit-read'] == {
        'users': [],
        'roles': [group_with_r_access.id, group_with_rw_access.id]
    }
    assert deposit['_access']['deposit-update'] == {
        'users': [],
        'roles': [group_with_rw_access.id]
    }
    assert deposit['_access']['deposit-admin'] == {'users': [], 'roles': []}

    # deposit doesnt have owner
    assert deposit['_deposit']['owners'] == []


# @TOFIX schemas module still uses mappings from files, that's why we use existing schemas
# this should be patched in schemas PR
@patch('cap.modules.experiments.utils.cadi.get_all_from_cadi',
       MagicMock(return_value=[dict(code=u'dANA-00-001', status=u'Free')]))
@patch('cap.modules.user.utils.does_egroup_exist_in_ldap',
       MagicMock(return_value=True))
def test_synchronize_cadi_entries_when_entry_exist_updates_cadi_info(
        appctx, db, es, superuser, create_deposit):
    create_deposit(
        superuser, 'cms-analysis', {
            'version': '0.0.1',
            '$ana_type': 'cms-analysis',
            'basic_info': {
                'cadi_id': 'ANA-00-001'
            }
        })

    # deposit with this cadi id already exists
    deposit = get_deposit_by_cadi_id('ANA-00-001')
    synchronize_cadi_entries()

    # deposit with this cadi id created
    updated_deposit = get_deposit_by_cadi_id('ANA-00-001')

    assert updated_deposit['cadi_info'] == {
        u'cadi_id': u'ANA-00-001',
        u'contact': u'',
        u'created': u'',
        u'description': u'',
        u'name': u'',
        u'paper': u'',
        u'pas': u'',
        u'publication_status': u'',
        u'status': u'Free',
        u'twiki': u''
    }  # sets cadi info correctly
    assert updated_deposit['_access'] == deposit[
        '_access']  # access didnt change
    assert updated_deposit['_deposit']['owners'] == deposit['_deposit'][
        'owners']  # deposit owner didn't change
