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
"""Integration tests for deposit creation."""

from __future__ import absolute_import, print_function

import json

from invenio_records.api import RecordMetadata

from cap.modules.deposit.api import CAPDeposit
from cap.modules.schemas.models import Schema
from invenio_jsonschemas.errors import JSONSchemaNotFound
from pytest import mark, raises


#######################
# api/deposits/  [POST]
#######################
def test_create_deposit_when_user_not_logged_in_returns_403(client, users):
    resp = client.post('/deposits/', data=json.dumps({}))

    assert resp.status_code == 401


def test_create_deposit_when_user_is_member_of_schema_experiment_can_create_deposit(
        client, users, location, json_headers, auth_headers_for_user,
        create_schema):
    user = users['cms_user']
    other_user = users['lhcb_user']
    schema = create_schema('cms', experiment='CMS')
    metadata = {
        '$schema': 'http://analysispreservation.cern.ch/schemas/deposits/records/cms-v1.0.0.json'
    }

    resp = client.post('/deposits/',
                       data=json.dumps(metadata),
                       headers=auth_headers_for_user(user) + json_headers)

    assert resp.status_code == 201

    resp = client.post('/deposits/',
                       data=json.dumps(metadata),
                       headers=auth_headers_for_user(other_user) +
                       json_headers)

    assert resp.status_code == 403


def test_create_deposit_when_user_is_member_of_egroup_that_has_read_access_to_schema_can_create_deposit(
        client, users, location, json_headers, auth_headers_for_user,
        create_schema):
    user = users['lhcb_user']
    schema = create_schema('cms', experiment='LHCb')
    metadata = {'$ana_type': 'cms'}

    resp = client.post('/deposits/',
                       data=json.dumps(metadata),
                       headers=auth_headers_for_user(user) + json_headers)

    assert resp.status_code == 201


def test_create_deposit_when_user_has_no_permission_to_schema_returns_403(
        client, users, json_headers, location, auth_headers_for_user,
        create_schema):
    user = users['cms_user']
    schema = create_schema('test', experiment='ALICE')
    metadata = {'$ana_type': 'test'}

    resp = client.post('/deposits/',
                       data=json.dumps(metadata),
                       headers=auth_headers_for_user(user) + json_headers)

    assert resp.status_code == 403


def test_create_deposit_when_superuser_can_create_deposit(
        client, location, create_schema, auth_headers_for_superuser,
        json_headers):
    schema = create_schema('test-analysis')
    metadata = {'$ana_type': 'test-analysis'}

    resp = client.post('/deposits/',
                       headers=auth_headers_for_superuser + json_headers,
                       data=json.dumps(metadata))

    assert resp.status_code == 201


def test_create_deposit_with_incremental_pid_with_ana_type(client, location,
        create_schema, auth_headers_for_superuser,json_headers):
    schema = create_schema('faser', experiment='FASER', config={'auto_increment': True})
    metadata = {'$ana_type': 'faser'}

    resp = client.post('/deposits/',
                       headers=auth_headers_for_superuser + json_headers,
                       data=json.dumps(metadata))
    assert resp.status_code == 201
    assert resp.json['id'] == 'FASER-1'


def test_create_deposit_with_incremental_pid_with_schema_url(
        client, users, location, json_headers, auth_headers_for_user,
        create_schema):
    user = users['superuser']
    schema = create_schema('cms', experiment='CMS', config={'auto_increment': True})
    metadata = {
        '$schema': 'http://analysispreservation.cern.ch/schemas/deposits/records/cms-v1.0.0.json'
    }

    resp = client.post('/deposits/',
                       data=json.dumps(metadata),
                       headers=auth_headers_for_user(user) + json_headers)

    assert resp.status_code == 201
    assert resp.json['id'] == 'CMS-1'


def test_create_deposit_when_passed_non_existing_schema_returns_404(
        client, location, auth_headers_for_superuser, json_headers):
    schema = 'https://analysispreservation.cern.ch/schemas/non-existing-schema-v1.0.0.json'
    metadata = {'$schema': schema}

    resp = client.post('/deposits/',
                       headers=auth_headers_for_superuser + json_headers,
                       data=json.dumps(metadata))

    assert resp.status_code == 400
    assert resp.json['message'] == 'Schema {} doesnt exist.'.format(schema)


def test_create_deposit_when_passed_non_existing_ana_type_returns_400(
        client, location, auth_headers_for_superuser, json_headers):
    ana_type = 'cms-analysis'
    metadata = {'$ana_type': 'cms-analysis'}

    resp = client.post('/deposits/',
                       headers=auth_headers_for_superuser + json_headers,
                       data=json.dumps(metadata))

    assert resp.status_code == 400
    assert resp.json['message'] == 'Schema with name {} doesnt exist.'.format(
        ana_type)


def test_create_deposit_when_passed_empty_data_returns_400(
        client, location, auth_headers_for_superuser, json_headers):
    resp = client.post('/deposits/',
                       headers=auth_headers_for_superuser + json_headers,
                       data=json.dumps({}))

    assert resp.status_code == 400
    assert resp.json[
        'message'] == "You have to specify either $schema or $ana_type"


def test_create_deposit_when_passed_ana_type_creates_deposit_with_latest_version_of_ana_type(
        client, location, create_schema, auth_headers_for_superuser,
        json_headers):
    create_schema('test-analysis')
    create_schema('test-analysis', version='1.0.0')
    create_schema('test-analysis', fullname='Test Schema', version='2.0.0')
    metadata = {'$ana_type': 'test-analysis'}

    resp = client.post('/deposits/',
                       headers=auth_headers_for_superuser + json_headers,
                       data=json.dumps(metadata))

    assert resp.status_code == 201
    assert resp.json['schema'] == {
        'fullname': 'Test Schema',
        'name': 'test-analysis',
        'version': '2.0.0'
    }


def test_create_deposit_set_fields_correctly(client, location, users,
                                             create_schema,
                                             auth_headers_for_user,
                                             json_headers):
    owner = users['cms_user']
    schema = create_schema('test-analysis', experiment='CMS', fullname='CMS Schema')
    metadata = {
        '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/test-analysis-v1.0.0.json',
        'basic_info': {
            'analysis_number': 'dream_team'
        }
    }

    resp = client.post('/deposits/',
                       headers=auth_headers_for_user(owner) + json_headers,
                       data=json.dumps(metadata))

    metadata = RecordMetadata.query.first()
    deposit = CAPDeposit.get_record(metadata.id)
    depid = deposit['_deposit']['id']

    assert resp.status_code == 201
    assert resp.json == {
        'id': depid,
        'type': 'deposit',
        'revision': 0,
        'schema': {
            'fullname': 'CMS Schema',
            'name': 'test-analysis',
            'version': '1.0.0'
        },
        'labels': [],
        'experiment': 'CMS',
        'status': 'draft',
        'created_by': {'email': owner.email, 'profile': {}},
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {
            'basic_info': {
                'analysis_number': 'dream_team'
            }
        },
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


def test_create_deposit_when_schema_with_refs_works_correctly(
        client, location, users, create_schema, auth_headers_for_user,
        json_headers):
    create_schema('nested-schema',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'properties': {
                          'title': {
                              'type': 'string'
                          }
                      }
                  })
    create_schema(
        'test-analysis',
        experiment='CMS',
        deposit_schema={
            'type': 'object',
            'properties': {
                'nested': {
                    '$ref': 'https://analysispreservation.cern.ch/schemas/deposits/records/nested-schema-v1.0.0.json'
                }
            }
        })

    resp = client.post(
        '/deposits/',
        headers=auth_headers_for_user(users['cms_user']) + json_headers,
        data=json.dumps({
            '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/test-analysis-v1.0.0.json',
            'nested': {
                'title': 'nested'
            }
        }))

    assert resp.status_code == 201


def test_create_deposit_with_required_fields_success(
        client, location, users, create_schema, auth_headers_for_user, json_headers):
    owner = users['cms_user']
    headers = auth_headers_for_user(users['cms_user']) + json_headers
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {'type': 'string'},
                          'abstract': {'type': 'string'}
                      }
                  })

    resp = client.post('/deposits/', headers=headers,
                       data=json.dumps(
                           {
                               '$ana_type': 'test-analysis',
                               'title': 'test'
                           }
                       ))

    metadata = RecordMetadata.query.first()
    deposit = CAPDeposit.get_record(metadata.id)
    depid = deposit['_deposit']['id']

    assert resp.status_code == 201
    assert resp.json == {
        'id': depid,
        'type': 'deposit',
        'revision': 0,
        'schema': {
            'fullname': '',
            'name': 'test-analysis',
            'version': '1.0.0'
        },
        'labels': [],
        'files': [],
        'experiment': 'CMS',
        'status': 'draft',
        'is_owner': True,
        'created_by': {'email': owner.email, 'profile': {}},
        'created': metadata.created.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'updated': metadata.updated.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00'),
        'metadata': {
            'title': 'test'
        },
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
        'links': {
            'bucket': f'http://analysispreservation.cern.ch/api/files/{deposit.files.bucket}',
            'clone': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/clone',
            'discard': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/discard',
            'disconnect_webhook': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/disconnect_webhook',
            'edit': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/edit',
            'files': f'http://analysispreservation.cern.ch/api/deposits/{depid}/files',
            'html': f'http://analysispreservation.cern.ch/drafts/{depid}',
            'permissions': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/permissions',
            'publish': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/publish',
            'self': f'http://analysispreservation.cern.ch/api/deposits/{depid}',
            'upload': f'http://analysispreservation.cern.ch/api/deposits/{depid}/actions/upload'
        }
    }


def test_create_deposit_with_required_fields_not_filled_validates_succesfully(
        client, location, users, create_schema, auth_headers_for_user, json_headers):
    headers = auth_headers_for_user(users['cms_user']) + json_headers
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'abstract': {
                              'type': 'string'
                          }
                      }
                  })

    resp = client.post('/deposits/', headers=headers,
                       data=json.dumps(
                           {
                               '$ana_type': 'test-analysis',
                               'abstract': 'test'
                           }
                       ))

    assert resp.status_code == 201
