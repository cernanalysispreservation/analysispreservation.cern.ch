from six import BytesIO

from cap.modules.deposit.api import CAPDeposit

# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2007 CERN.
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
"""Files workflow tests."""


def test_files_workflow(client, users, auth_headers_for_user, create_deposit):
    owner = users['cms_user']
    member_of_collaboration = users['cms_user2']
    non_member_of_collaboration = users['lhcb_user2']
    deposit = create_deposit(owner, 'test-analysis-v0.0.1', experiment='CMS')
    pid = deposit['_deposit']['id']
    auth_headers = auth_headers_for_user(owner)

    deposit_bucket = deposit.files.bucket

    # deposit created, bucket is unlocked
    assert deposit_bucket.locked is False

    # user can add new files
    resp = client.put('/files/{}/file_1.txt'.format(deposit_bucket),
                      input_stream=BytesIO(b'Original Hello world!'),
                      headers=auth_headers)

    assert resp.status_code == 200

    # and access them
    resp = client.get('/files/{}/file_1.txt'.format(deposit_bucket),
                      headers=auth_headers)

    assert resp.status_code == 200
    assert resp.data == b'Original Hello world!'

    # member of collaboration cannot access file
    resp = client.get('/files/{}/file_1.txt'.format(deposit_bucket),
                      headers=auth_headers_for_user(member_of_collaboration))

    assert resp.status_code == 404  # TOFIX shouldnt be 403?

    # user can update and delete  a file
    resp = client.put('/files/{}/file_1.txt'.format(deposit_bucket),
                      input_stream=BytesIO(b'Updated Hello world!'),
                      headers=auth_headers)

    assert resp.status_code == 200

    resp = client.get('/files/{}/file_1.txt'.format(deposit_bucket),
                      headers=auth_headers)

    assert resp.status_code == 200
    assert resp.data == 'Updated Hello world!'

    resp = client.delete('/files/{}/file_1.txt'.format(deposit_bucket),
                         headers=auth_headers)

    assert resp.status_code == 204

    resp = client.put('/files/{}/file_1.txt'.format(deposit_bucket),
                      input_stream=BytesIO(b'Original Hello world!'),
                      headers=auth_headers)

    assert resp.status_code == 200

    # when user publishes a deposit, deposit_bucket is locked
    resp = client.post('/deposits/{}/actions/publish'.format(pid),
                       headers=auth_headers)

    assert resp.status_code == 202

    deposit = CAPDeposit.get_record(deposit.id)

    # deposit_bucket is locked after deposit was published
    assert deposit_bucket.locked is True

    # record  has a differrent bucket, that is also locked
    _, record = deposit.fetch_published()
    record_bucket = record.files.bucket
    assert record_bucket != deposit_bucket
    assert record_bucket.locked is True

    # user and member of collaboration can access file for the published record
    resp = client.get('/files/{}/file_1.txt'.format(record_bucket),
                      headers=auth_headers)

    assert resp.status_code == 200

    resp = client.get('/files/{}/file_1.txt'.format(record_bucket),
                      headers=auth_headers_for_user(member_of_collaboration))

    assert resp.status_code == 200

    # user outside of collaboration cant access file for the published record
    resp = client.get(
        '/files/{}/file_1.txt'.format(record_bucket),
        headers=auth_headers_for_user(non_member_of_collaboration))

    assert resp.status_code == 404

    resp = client.get('/files/{}/file_1.txt'.format(record_bucket),
                      headers=auth_headers_for_user(member_of_collaboration))

    assert resp.status_code == 200

    # user cannot add/update/delete a file for deposit
    resp = client.put('/files/{}/file_1.txt'.format(deposit_bucket),
                      input_stream=BytesIO(b'Try another Hello world!'),
                      headers=auth_headers)

    assert resp.status_code == 403

    resp = client.delete('/files/{}/file_1.txt'.format(deposit_bucket),
                         headers=auth_headers)

    assert resp.status_code == 403

    resp = client.put('/files/{}/file_2.txt'.format(deposit_bucket),
                      input_stream=BytesIO(b'Try another Hello world!'),
                      headers=auth_headers)

    assert resp.status_code == 403

    # unless he decides to edit deposit again
    resp = client.post('/deposits/{}/actions/edit'.format(pid),
                       headers=auth_headers)

    assert resp.status_code == 201
    assert deposit_bucket.locked is False

    # after edit, deposit deposit_bucket is unlocked again,
    # so he can add new files
    resp = client.put('/files/{}/file_2.txt'.format(deposit_bucket),
                      input_stream=BytesIO(b'Hello new world!'),
                      headers=auth_headers)

    assert resp.status_code == 200

    resp = client.get('/files/{}/file_2.txt'.format(deposit_bucket),
                      headers=auth_headers)

    assert resp.status_code == 200
    assert resp.data == 'Hello new world!'

    # user can upload a new version of file
    resp = client.put('/files/{}/file_1.txt'.format(deposit_bucket),
                      input_stream=BytesIO(b'After edit Hello world!'),
                      headers=auth_headers)

    assert resp.status_code == 200

    resp = client.get('/files/{}/file_1.txt'.format(deposit_bucket),
                      headers=auth_headers)
    assert resp.data == 'After edit Hello world!'

    # even delete it
    resp = client.delete('/files/{}/file_1.txt'.format(deposit_bucket),
                         headers=auth_headers)

    assert resp.status_code == 204

    # user can upload a new files
    resp = client.put('/files/{}/file_3.txt'.format(deposit_bucket),
                      input_stream=BytesIO(b'Hello world!'),
                      headers=auth_headers)

    assert resp.status_code == 200

    # original file with this name, referenced by bucket of published record,
    # remains unchanged
    resp = client.get('/files/{}/file_1.txt'.format(record_bucket),
                      headers=auth_headers)
    assert resp.data == 'Original Hello world!'

    # user cannot modify(add, update, delete) a record bucket
    resp = client.put('/files/{}/file_1.txt'.format(record_bucket),
                      input_stream=BytesIO(b'Updated Updated Hello world!'),
                      headers=auth_headers)

    assert resp.status_code == 403

    resp = client.delete('/files/{}/file_1.txt'.format(record_bucket),
                         headers=auth_headers)

    assert resp.status_code == 403

    resp = client.put('/files/{}/file_2.txt'.format(record_bucket),
                      input_stream=BytesIO(b'Hello new world!'),
                      headers=auth_headers)

    assert resp.status_code == 403
