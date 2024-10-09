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
"""Integration tests for record edit."""

from io import BytesIO


###########################################
# api/deposits/{pid}/actions/edit [POST]
###########################################
def test_edit_record_owner_can_edit(client, users, auth_headers_for_user,
                                    create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner, 'test', publish=True)['_deposit']['id']

    resp = client.post('/deposits/{}/actions/edit'.format(pid),
                       headers=auth_headers_for_user(owner))

    assert resp.status_code == 201


def test_edit_record_superuser_can_edit(client, users,
                                        auth_headers_for_superuser,
                                        create_deposit):
    owner = users['cms_user']
    pid = create_deposit(owner, 'test', publish=True)['_deposit']['id']

    resp = client.post('/deposits/{}/actions/edit'.format(pid),
                       headers=auth_headers_for_superuser)

    assert resp.status_code == 201


def test_edit_record_when_other_user_403(client, users, auth_headers_for_user,
                                         create_deposit):
    owner, other_user = users['cms_user'], users['cms_user2']
    pid = create_deposit(owner, 'test', publish=True)['_deposit']['id']

    resp = client.post('/deposits/{}/actions/edit'.format(pid),
                       headers=auth_headers_for_user(other_user))

    assert resp.status_code == 403


def test_edit_record(client, create_deposit, users, auth_headers_for_superuser):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test', experiment='CMS', publish=True)
    metadata = deposit.get_record_metadata()
    depid = deposit['_deposit']['id']

    resp = client.post('/deposits/{}/actions/edit'.format(depid),
                       headers=auth_headers_for_superuser)

    assert resp.status_code == 201
    assert resp.json == {
        'id': depid,
        'recid': deposit['control_number'],
        'type': 'deposit',
        'revision': 2,
        'schema': {
            'fullname': '',
            'name': 'test',
            'version': '1.0.0'
        },
        'experiment': 'CMS',
        'status': 'draft',
        'created_by': {'email': owner.email, 'profile': {}},
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {},
        'labels': [],
        'files': [],
        'access': {
            'deposit-admin': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            },
            'deposit-update': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            },
            'deposit-read': {
                'roles': [],
                'users': [{'email': owner.email, 'profile': {}}]
            }
        },
        'is_owner': False,
        'links': {
            'bucket': 'http://analysispreservation.cern.ch/api/files/{}'.
            format(deposit.files.bucket),
            'clone': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/clone'
            .format(depid),
            'discard': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/discard'
            .format(depid),
            'disconnect_webhook': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/disconnect_webhook'
            .format(depid),
            'edit': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/edit'
            .format(depid),
            'files': 'http://analysispreservation.cern.ch/api/deposits/{}/files'
            .format(depid),
            'html': 'http://analysispreservation.cern.ch/drafts/{}'.format(
                depid),
            'permissions': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/permissions'
            .format(depid),
            'publish': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/publish'
            .format(depid),
            'self': 'http://analysispreservation.cern.ch/api/deposits/{}'.
            format(depid),
            'upload': 'http://analysispreservation.cern.ch/api/deposits/{}/actions/upload'
            .format(depid)
        }
    }


def test_edit_record_with_uploading_new_files(client, users, auth_headers_for_user, create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1')
    deposit.files['file_1.txt'] = BytesIO(b'Hello world!')
    pid = deposit['_deposit']['id']

    client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=auth_headers_for_user(owner))

    client.post('/deposits/{}/actions/edit'.format(pid),
                       headers=auth_headers_for_user(owner))

    bucket = deposit.files.bucket
    client.put('/files/{}/file_2.txt'.format(bucket),
                      input_stream=BytesIO(b'Hello brave new world!'),
                      headers=auth_headers_for_user(owner))

    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=auth_headers_for_user(owner))

    assert len(resp.json['files']) == 2
