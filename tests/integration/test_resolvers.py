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

from pytest import mark


def test_resolve_schema_returns_schema_without_checking_permissions(
    client, users, create_schema, auth_headers_for_user):
    some_user = users['cms_user']
    create_schema('test-schema',
                  experiment='LHCb',
                  deposit_schema={
                      'type': 'object',
                      'properties': {
                          'attr': {
                              'type': 'string'
                          }
                      }
                  })

    resp = client.get('/schemas/deposits/records/test-schema-v1.0.0',
                      headers=auth_headers_for_user(some_user))

    assert resp.status_code == 200


def test_resolve_schema_when_superuser_returns_schema(
        client, create_schema, auth_headers_for_superuser):
    create_schema('test-schema',
                  deposit_schema={
                      'type': 'object',
                      'properties': {
                          'attr': {
                              'type': 'string'
                          }
                      }
                  })

    resp = client.get('/schemas/deposits/records/test-schema-v1.0.0',
                      headers=auth_headers_for_superuser)

    assert resp.status_code == 200


def test_resolve_schema_when_schema_name_with_slashes(
        client, create_schema, auth_headers_for_superuser):
    create_schema('definitions/test-schema',
                  deposit_schema={
                      'type': 'object',
                      'properties': {
                          'attr': {
                              'type': 'string'
                          }
                      }
                  })

    resp = client.get(
        '/schemas/deposits/records/definitions/test-schema-v1.0.0',
        headers=auth_headers_for_superuser)

    assert resp.status_code == 200

@mark.skip('JSON ref to be converetd to dict object.')
def test_resolve_schema_when_schema_and_refs_belong_to_experiment(
        client, users, create_schema, auth_headers_for_user):
    cms_user = users['cms_user']
    nested_schema = create_schema('nested-schema',
                                  version='0.0.0',
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
        'test-schema',
        version='1.0.1',
        experiment='CMS',
        deposit_schema={
            'type': 'object',
            'properties': {
                'nested': {
                    '$ref': 'https://analysispreservation.cern.ch/schemas/deposits/records/nested-schema-v0.0.0.json',
                }
            }
        })

    resp = client.get('/schemas/deposits/records/test-schema-v1.0.1',
                      headers=auth_headers_for_user(cms_user))

    assert resp.status_code == 200


@mark.skip('this will throw JsonRefError now, needs to be discussed in private'
           )
def test_resolve_schema_when_schema_in_refs_belongs_to_different_experiment_returns_403(
        client, users, create_schema, auth_headers_for_user):
    cms_user = users['cms_user']
    nested_schema = create_schema('nested-schema',
                                  experiment='LHCb',
                                  deposit_schema={
                                      'type': 'object',
                                      'properties': {
                                          'title': {
                                              'type': 'string'
                                          }
                                      }
                                  })

    create_schema(
        'test-schema',
        experiment='CMS',
        deposit_schema={
            'type': 'object',
            'properties': {
                'nested': {
                    '$ref': 'https://analysispreservation.cern.ch/schemas/deposits/records/nested-schema-v1.0.0.json',
                }
            }
        })

    resp = client.get('/schemas/deposits/records/test-schema-v1.0.0',
                      headers=auth_headers_for_user(cms_user))

    assert resp.status_code == 403


def test_resolve_schema_when_wrong_refs_returns_404(
        client, create_schema, auth_headers_for_superuser):
    create_schema(
        'test-schema',
        experiment='CMS',
        deposit_schema={
            'type': 'object',
            'properties': {
                'nested': {
                    '$ref': 'https://analysispreservation.cern.ch/schemas/deposits/records/wrong-schema-v1.0.0.json',  # noqa
                }
            }
        })

    resp = client.get('/schemas/deposits/records/test-schema-v1.0.0',
                      headers=auth_headers_for_superuser)

    assert resp.status_code == 404


def test_resolve_schema_returns_correct_jsonschema(client, create_schema,
                                                   auth_headers_for_superuser):
    schema = create_schema(
        'some-schema',
        deposit_schema={'title': 'i\'m a deposit schema'},
        record_schema={'title': 'i\'m a record schema'},
        deposit_options={'title': 'i\'m a deposits options schema'},
        record_options={'title': 'i\'m a record options schema'},
        use_deposit_as_record=False)

    resp = client.get('/schemas/deposits/records/some-schema-v1.0.0.json',
                      headers=auth_headers_for_superuser)

    assert resp.json == schema.deposit_schema

    resp = client.get('/schemas/records/some-schema-v1.0.0.json',
                      headers=auth_headers_for_superuser)

    assert resp.json == schema.record_schema

    resp = client.get(
        '/schemas/options/deposits/records/some-schema-v1.0.0.json',
        headers=auth_headers_for_superuser)

    assert resp.json == schema.deposit_options

    resp = client.get('/schemas/options/records/some-schema-v1.0.0.json',
                      headers=auth_headers_for_superuser)

    assert resp.json == schema.record_options
