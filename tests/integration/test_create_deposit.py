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

from invenio_jsonschemas.errors import JSONSchemaNotFound
from pytest import mark, raises

from cap.modules.schemas.models import Schema


#######################
# api/deposits/  [POST]
#######################
def test_create_deposit_when_user_not_logged_in_returns_403(app, users):
    with app.test_client() as client:
        resp = client.post('/deposits/', data=json.dumps({}))

        assert resp.status_code == 401


def test_create_deposit_when_user_is_member_of_schema_experiment_can_create_deposit(
        app, users, location, json_headers, jsonschemas_host,
        auth_headers_for_user, create_schema):
    user = users['cms_user']
    other_user = users['lhcb_user']
    schema = create_schema('cms', experiment='CMS')
    metadata = {
        '$schema': 'http://analysispreservation.cern.ch/schemas/deposits/records/cms-v1.0.0.json'
    }

    with app.test_client() as client:
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
        app, users, location, json_headers, jsonschemas_host,
        auth_headers_for_user, create_schema):
    user = users['lhcb_user']
    schema = create_schema('cms', experiment='LHCb')
    metadata = {'$ana_type': 'cms'}

    with app.test_client() as client:
        resp = client.post('/deposits/',
                           data=json.dumps(metadata),
                           headers=auth_headers_for_user(user) + json_headers)

        assert resp.status_code == 201


def test_create_deposit_when_user_has_no_permission_to_schema_returns_403(
        app, users, json_headers, location, jsonschemas_host,
        auth_headers_for_user, create_schema):
    user = users['cms_user']
    schema = create_schema('test', experiment='ALICE')
    metadata = {'$ana_type': 'test'}

    with app.test_client() as client:
        resp = client.post('/deposits/',
                           data=json.dumps(metadata),
                           headers=auth_headers_for_user(user) + json_headers)

        assert resp.status_code == 403


def test_create_deposit_when_superuser_can_create_deposit(
        app, location, create_schema, jsonschemas_host,
        auth_headers_for_superuser, json_headers):
    schema = create_schema('deposits/records/test-analysis-v1.0.0')
    metadata = {
        '$schema':
            'https://{}/schemas/deposits/records/test-analysis-v1.0.0.json'.
            format(jsonschemas_host),
    }

    with app.test_client() as client:
        resp = client.post('/deposits/',
                           headers=auth_headers_for_superuser + json_headers,
                           data=json.dumps(metadata))

        assert resp.status_code == 201


def test_create_deposit_when_passed_non_existing_schema_returns_404(
        app, location, create_schema, jsonschemas_host,
        auth_headers_for_superuser, json_headers):
    schema = 'https://{}/schemas/non-existing-schema-v1.0.0.json'.format(
        jsonschemas_host)
    metadata = {'$schema': schema}

    with app.test_client() as client:
        resp = client.post('/deposits/',
                           headers=auth_headers_for_superuser + json_headers,
                           data=json.dumps(metadata))

        assert resp.status_code == 400
        assert resp.json['message'] == 'Schema {} doesnt exist.'.format(schema)


def test_create_deposit_when_passed_non_existing_ana_type_returns_400(
        app, location, create_schema, jsonschemas_host,
        auth_headers_for_superuser, json_headers):
    ana_type = 'cms-analysis'

    metadata = {'$ana_type': ana_type}

    with app.test_client() as client:
        resp = client.post('/deposits/',
                           headers=auth_headers_for_superuser + json_headers,
                           data=json.dumps(metadata))

        assert resp.status_code == 400
        assert resp.json[
            'message'] == 'Schema with name {} doesnt exist.'.format(ana_type)


def test_create_deposit_when_passed_empty_data_returns_400(
        app, location, create_schema, jsonschemas_host,
        auth_headers_for_superuser, json_headers):
    with app.test_client() as client:
        resp = client.post('/deposits/',
                           headers=auth_headers_for_superuser + json_headers,
                           data=json.dumps({}))

        assert resp.status_code == 400
        assert resp.json[
            'message'] == "You have to specify either $schema or $ana_type"


def test_create_deposit_when_passed_ana_type_creates_deposit_with_latest_version_of_ana_type(
        app, location, create_schema, jsonschemas_host,
        auth_headers_for_superuser, json_headers):
    create_schema('deposits/records/test-analysis-v1.0.0')
    latest = create_schema('deposits/records/test-analysis-v2.0.0')
    metadata = {'$ana_type': 'test-analysis'}

    with app.test_client() as client:
        resp = client.post('/deposits/',
                           headers=auth_headers_for_superuser + json_headers,
                           data=json.dumps(metadata))

        assert resp.status_code == 201
        assert resp.json['metadata'][
            '$schema'] == 'https://analysispreservation.cern.ch/schemas/deposits/records/test-analysis-v2.0.0.json'


def test_create_deposit_clears_fields_prefixed_with_underscores(
        app, location, users, create_schema, jsonschemas_host,
        auth_headers_for_user, json_headers):
    owner = users['cms_user']
    schema = create_schema('deposits/records/test-analysis-v1.0.0',
                           experiment='CMS')
    metadata = {
        '$schema':
            'https://{}/schemas/deposits/records/test-analysis-v1.0.0.json'.
            format(jsonschemas_host),
        '_deposit': 'some-invalid-data',
        '_experiment': 'some-invalid-data'
    }

    with app.test_client() as client:
        resp = client.post('/deposits/',
                           headers=auth_headers_for_user(owner) + json_headers,
                           data=json.dumps(metadata))

        assert resp.status_code == 201

        created = resp.json['metadata']

        assert created['_deposit']['created_by'] == owner.id
        assert created['_deposit']['status'] == 'draft'
        assert created['$schema'] == schema.fullpath
        assert created['_experiment'] == 'CMS'


def test_create_deposit_set_fields_correctly(app, location, users,
                                             create_schema, jsonschemas_host,
                                             auth_headers_for_user,
                                             json_headers):
    owner = users['cms_user']
    schema = create_schema('test-analysis', experiment='CMS')
    metadata = {
        '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/test-analysis-v1.0.0.json'
    }

    with app.test_client() as client:
        resp = client.post('/deposits/',
                           headers=auth_headers_for_user(owner) + json_headers,
                           data=json.dumps(metadata))

        assert resp.status_code == 201

        created = resp.json['metadata']

        assert created['_deposit']['created_by'] == owner.id
        assert created[
            '$schema'] == 'https://analysispreservation.cern.ch/schemas/deposits/records/test-analysis-v1.0.0.json'
        assert created['_experiment'] == 'CMS'
        assert created['_deposit']['status'] == 'draft'


def test_create_deposit_when_schema_with_refs_works_correctly(
        app, location, users, create_schema, jsonschemas_host,
        auth_headers_for_user, json_headers):
    owner = users['cms_user']
    nested_schema = create_schema('nested-schema-v0.0.0',
                                  json={
                                      'type': 'object',
                                      'properties': {
                                          'title': {
                                              'type': 'string'
                                          }
                                      }
                                  })
    nested_schema.add_read_access_to_all()
    schema = create_schema(
        'deposits/records/test-analysis-v1.0.0',
        experiment='CMS',
        deposit_schema={
            'type': 'object',
            'properties': {
                'nested': {
                    '$ref': 'https://analysispreservation.cern.ch/schemas/deposits/records/nested-schema-v1.0.0.json'
                }
            }
        })

    with app.test_client() as client:
        resp = client.post(
            '/deposits/',
            headers=auth_headers_for_user(owner) + json_headers,
            data=json.dumps({
                '$schema': 'https://analysispreservation.cern.ch/schemas/deposits/records/nested-schema-v1.0.0.json',
                'nested': {
                    'title': 'nested'
                }
            }))

        assert resp.status_code == 201
