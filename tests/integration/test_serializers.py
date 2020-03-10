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
'''Integration tests for records serializers.'''

import json

from invenio_files_rest.models import ObjectVersion
from six import BytesIO

from conftest import _datastore
from invenio_search import current_search
from pytest import mark


def test_get_deposit_with_default_serializer(client, users,
                                             auth_headers_for_user,
                                             create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(
        owner,
        'cms-analysis', {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v1.0.0.json',
            'basic_info': {
                'analysis_number': 'dream_team',
            }
        },
        files={'file_1.txt': BytesIO(b'Hello world!')},
        experiment='CMS')

    depid = deposit['_deposit']['id']
    metadata = deposit.get_record_metadata()
    file = deposit.files['file_1.txt']
    role = _datastore.find_or_create_role('some-egroup@cern.ch')
    deposit.edit_permissions([{
        'email': role.name,
        'type': 'egroup',
        'op': 'add',
        'action': 'deposit-read'
    }])

    resp = client.get('/deposits/{}'.format(depid),
                      headers=[('Accept', 'application/json')] +
                      auth_headers_for_user(owner))

    assert resp.status_code == 200

    assert resp.json == {
        'id': depid,
        'type': 'deposit',
        'revision': 3,
        'schema': {
            'name': 'cms-analysis',
            'version': '1.0.0'
        },
        'experiment': 'CMS',
        'status': 'draft',
        'created_by': owner.email,
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {
            'basic_info': {
                'analysis_number': 'dream_team'
            }
        },
        'labels': [],
        'files': [{
            'bucket': str(file.bucket),
            'checksum': file.file.checksum,
            'key': file.key,
            'size': file.file.size,
            'version_id': str(file.version_id)
        }],
        'access': {
            'deposit-admin': {
                'roles': [],
                'users': [owner.email]
            },
            'deposit-update': {
                'roles': [],
                'users': [owner.email]
            },
            'deposit-read': {
                'roles': ['some-egroup@cern.ch'],
                'users': [owner.email]
            }
        },
        'is_owner': True,
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


def test_default_record_serializer(client, users, auth_headers_for_user,
                                   json_headers, create_deposit):
    owner = users['cms_user']
    deposit = create_deposit(
        owner,
        'cms-analysis',
        {
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/cms-analysis-v1.0.0.json',
            'basic_info': {
                'analysis_number': 'dream_team',
            }
        },
        experiment='CMS',
        files={'file_1.txt': BytesIO(b'Hello world!')},
        publish=True,
    )

    recid = deposit['control_number']
    _, record = deposit.fetch_published()
    file = record.files['file_1.txt']
    metadata = record.get_record_metadata()
    resp = client.get('/records/{}'.format(recid),
                      headers=[('Accept', 'application/json')] +
                      auth_headers_for_user(owner))

    assert resp.json == {
        'id': recid,
        'type': 'record',
        'revision': 0,
        'experiment': 'CMS',
        'status': 'published',
        'schema': {
            'name': 'cms-analysis',
            'version': '1.0.0'
        },
        'labels': [],
        'created_by': owner.email,
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'access': {
            'record-admin': {
                'roles': [],
                'users': [owner.email]
            },
            'record-update': {
                'roles': [],
                'users': [owner.email]
            },
            'record-read': {
                'roles': [],
                'users': [owner.email, users['cms_user2'].email]
            }
        },
        'metadata': {
            'basic_info': {
                'analysis_number': 'dream_team'
            }
        },
        'files': [{
            'bucket': str(record.files.bucket),
            'checksum': file.file.checksum,
            'key': file.key,
            'size': file.file.size,
            'version_id': str(file.version_id)
        }],
        'is_owner': True,
        'links': {
            'bucket': 'http://analysispreservation.cern.ch/api/files/{}'.
            format(record.files.bucket),
            'html': 'http://analysispreservation.cern.ch/published/{}'.format(
                recid),
            'self': 'http://analysispreservation.cern.ch/api/records/{}'.
            format(recid),
        },
        'draft_id': deposit.pid.pid_value
    }


def test_webhook_serializer_on_deposits(client, example_user,
                                        auth_headers_for_example_user, deposit,
                                        github_push_webhook_sub):
    headers = [('Accept', 'application/repositories+json')
               ] + auth_headers_for_example_user
    pid = deposit['_deposit']['id']
    resp = client.get(f'/deposits/{pid}', headers=headers)

    assert resp.status_code == 200
    assert resp.json == {
        'webhooks': [{
            'id': github_push_webhook_sub.id,
            'branch': 'mybranch',
            'event_type': 'push',
            'host': 'github.com',
            'name': 'repository',
            'owner': 'owner',
            'snapshots': []
        }]
    }
