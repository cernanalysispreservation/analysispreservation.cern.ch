# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2022 CERN.
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

"""CAP ADL ingestion service tests."""

import requests
from io import BytesIO


def test_ingest_adl_with_wrong_record(app, auth_headers_for_superuser):
    mock_record_id = '678bc00beb0c413397aa23854f197195'

    with app.test_client() as client:
        resp = client.get('services/adl/{}/test.adl'.format(mock_record_id), headers=auth_headers_for_superuser)

        assert resp.status_code == 404
        assert resp.json['message'] == 'You tried to provide a adl file with a non-existing record'


def test_ingest_adl_with_non_existing_file(app, users, auth_headers_for_superuser, create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']
    deposit.files['adl_parse.adl'] = BytesIO(b'define bestMu = daughters(HMuTaus[0], goodMuons[-1])')
    wrong_file_name = 'adl.adl'

    with app.test_client() as client:
        resp = client.get('services/adl/{}/{}'.format(pid, wrong_file_name), headers=auth_headers_for_superuser)

        assert resp.status_code == 400
        assert resp.json['message'] == 'You tried to provide a non-existing/wrong adl file.'


def test_ingest_adl_with_wrong_file_format(app, users, auth_headers_for_superuser, create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    pid = deposit['_deposit']['id']
    deposit.files['adl.txt'] = BytesIO(b'hello world!')
    wrong_file = 'adl.txt'

    with app.test_client() as client:
        resp = client.get('services/adl/{}/{}'.format(pid, wrong_file), headers=auth_headers_for_superuser)

        assert resp.status_code == 400
        assert resp.json['message'] == 'You tried to provide a non-existing/wrong adl file.'


def test_parse_adl_from_file_with_multiple_files(app, auth_headers_for_superuser):
    data = {}
    data['file1'] = (BytesIO(b"abcdef"), 'test1.txt')
    data['file2'] = (BytesIO(b"hello"), 'test.adl')
    with app.test_client() as client:
        resp = client.post('services/adl/upload', data=data, headers=auth_headers_for_superuser,
                           content_type='multipart/form-data')

        assert resp.status_code == 400
        assert resp.json['message'] == 'Invalid arguments. Please try again.'


def test_parse_adl_from_file_with_empty_input(app, auth_headers_for_superuser):
    with app.test_client() as client:
        resp = client.post('services/adl/upload', data={}, headers=auth_headers_for_superuser)

        assert resp.status_code == 400


def test_parse_adl_file(app, auth_headers_for_superuser):
    data = {}
    test_adl_file_uri = 'https://raw.githubusercontent.com/ADL4HEP/ADLLHCanalyses/master/CMS-OD-12350-Htautau/CMS-OD-12350-Htautau_CutLang.adl'
    test_adl_file = requests.get(test_adl_file_uri).text.encode()
    data['test'] = (BytesIO(test_adl_file), 'test.adl')
    with app.test_client() as client:
        resp = client.post('services/adl/upload', data=data, headers=auth_headers_for_superuser,
                           content_type='multipart/form-data')

        assert resp.status_code == 200
        assert len(resp.json['define']) == 11
        assert len(resp.json['objects']) == 4
        assert len(resp.json['regions']) == 2
