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
"""Integration tests for publishing deposits."""

import json

from invenio_access.models import ActionRoles, ActionUsers
from pytest import mark

from cap.modules.experiments.permissions import exp_need_factory
from conftest import _datastore, add_role_to_user


@mark.skip
def test_deposit_validation_when_schema_not_specified(client, users,
                                                      auth_headers_for_user,
                                                      json_headers,
                                                      create_schema,
                                                      create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'properties': {
                          'title': {
                              'type': 'string'
                          }
                      },
                      'additionalProperties': False
                  },
                  record_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          }
                      },
                      'additionalProperties': False
                  },
                  use_deposit_as_record=False)

    deposit = create_deposit(owner,
                             'test-analysis',
                             experiment='CMS',
                             metadata={"random_prop": "boom"})
    depid = deposit['_deposit']['id']
    resp = client.post(f'/deposits/{depid}/actions/publish', headers=headers)

    assert resp.status_code == 422
    assert resp.json[
        'message'] == 'Validation error. Try again with valid data'
    assert resp.json['errors'][0][
        'message'] == "'title' is a required property"


def test_deposit_validation_on_additional_properties(client, users,
                                                     auth_headers_for_user,
                                                     json_headers,
                                                     create_schema,
                                                     create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'obj': {
                              'type': 'object',
                              'properties': {
                                  'allowed_prop': {
                                      'type': 'string'
                                  }
                              },
                              'additionalProperties': False
                          }
                      },
                  })

    resp = client.post('/deposits',
                       headers=headers + json_headers,
                       data=json.dumps({"$ana_type": "test-analysis"}))

    assert resp.status_code == 201
    depid = resp.json['id']

    resp = client.put('/deposits/{}'.format(depid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": {
                          "random_prop": "boom"
                      }}))

    # resp = client.post(f'/deposits/{depid}/actions/publish', headers=headers)

    assert resp.status_code == 422
    assert resp.json[
        'message'] == 'Validation error. Try again with valid data'


def test_deposit_validation_on_validate_das_path(client, users,
                                                 auth_headers_for_user,
                                                 json_headers, create_schema,
                                                 create_deposit,
                                                 das_datasets_index):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis-with-das-validation',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'obj': {
                              'type': 'object',
                              'properties': {
                                  'allowed_prop': {
                                      'type': 'string',
                                      'x-validate-das-path': {}
                                  }
                              },
                              'additionalProperties': False
                          }
                      },
                  })

    resp = client.post('/deposits',
                       headers=headers + json_headers,
                       data=json.dumps({"$ana_type": "test-analysis-with-das-validation"}))

    assert resp.status_code == 201
    depid = resp.json['id']

    resp = client.put('/deposits/{}'.format(depid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": {
                          "allowed_prop": "boom"
                      }}))

    assert resp.status_code == 422
    assert resp.json[
        'message'] == 'Validation error. Try again with valid data'

    resp = client.put('/deposits/{}'.format(depid),
                      headers=headers + json_headers,
                      data=json.dumps(
                          {"obj": {
                              "allowed_prop": "/dataset1/run1/AOD"
                          }}))

    assert resp.status_code == 200


def test_deposit_validation_on_validate_das_path_and_triggers(
        client, users, auth_headers_for_user, json_headers, create_schema,
        create_deposit, das_datasets_index, cms_triggers_index):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema(
        'test-schema-with-das-and-trigger-validation',
        experiment='CMS',
        deposit_schema={
            'type': 'object',
            'required': ['title'],
            'properties': {
                'title': {
                    'type': 'string'
                },
                'obj': {
                    'type': 'object',
                    'properties': {
                        'allowed_prop': {
                            'type': 'string',
                            'x-validate-das-path': {}
                        },
                        "list": {
                            "items": {
                                "type": "object",
                                "x-validate-cms-trigger": {},
                                "properties": {
                                    "path": {
                                        "type": "string",
                                        "x-validate-das-path": {},
                                        "title": "Path"
                                    },
                                    "year": {
                                        "type": "number",
                                        "title": "Year"
                                    },
                                    "triggers": {
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "trigger": {
                                                    "type": "string",
                                                    "title": "Trigger"
                                                },
                                                "prescale": {
                                                    "type": "number",
                                                    "title": "Prescale"
                                                }
                                            }
                                        },
                                        "title": "Triggers",
                                        "type": "array",
                                        "description":
                                        "Add selection triggers here",
                                        "id": "triggers"
                                    }
                                },
                                "required": ["path"]
                            }
                        }
                    },
                    'additionalProperties': False
                }
            },
        })

    resp = client.post('/deposits',
                       headers=headers + json_headers,
                       data=json.dumps({"$ana_type": "test-schema-with-das-and-trigger-validation"}))

    assert resp.status_code == 201
    depid = resp.json['id']

    resp = client.put('/deposits/{}'.format(depid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": {
                          "allowed_prop": "boom"
                      }}))

    assert resp.status_code == 422
    assert resp.json[
        'message'] == 'Validation error. Try again with valid data'

    resp = client.put('/deposits/{}'.format(depid),
                      headers=headers + json_headers,
                      data=json.dumps(
                          {"obj": {
                              "allowed_prop": "/dataset1/run1/AOD"
                          }}))

    assert resp.status_code == 200

    resp = client.put('/deposits/{}'.format(depid),
                      headers=headers + json_headers,
                      data=json.dumps({
                          "obj": {
                              "allowed_prop":
                              "/dataset1/run1/AOD",
                              "list": [{
                                  "path": "boom"
                              }, {
                                  "path": "/dataset1/run1/AOD"
                              }, {
                                  "path": "bam"
                              }]
                          }
                      }))

    assert resp.status_code == 422
    error_field_path = resp.json.get('errors', [])[0].get('field')
    assert ['obj', 'list', 0, 'path'] == error_field_path

    resp = client.put('/deposits/{}'.format(depid),
                      headers=headers + json_headers,
                      data=json.dumps({
                          "obj": {
                              "allowed_prop":
                              "/dataset1/run1/AOD",
                              "list": [{
                                  "path": "/dataset2/run1/RECO"
                              }, {
                                  "path": "/dataset1/run1/AOD"
                              }]
                          }
                      }))

    assert resp.status_code == 200

    resp = client.put('/deposits/{}'.format(depid),
                      headers=headers + json_headers,
                      data=json.dumps({
                          "obj": {
                              "allowed_prop":
                              "/dataset1/run1/AOD",
                              "list": [{
                                  "path": "/dataset2/run1/RECO",
                                  "year": 2012,
                                  "triggers": [
                                      {"trigger": "wrong_trigger"},
                                      {"trigger": "Trigger_2"},
                                      {"trigger": "wrong_trigger2"}
                                  ]
                              }, {
                                  "path": "/dataset1/run1/AOD"
                              }]
                          }
                      }))

    assert resp.status_code == 422
    errors = resp.json.get('errors', [])
    assert errors[0].get('field') == ['obj', 'list', 0,
                                      "triggers", 0, "trigger"]
    assert errors[1].get('field') == ['obj', 'list', 0,
                                      "triggers", 2, "trigger"]
    assert len(errors) == 2


def test_deposit_validation_on_schema_field_user_can_edit(client, users,
                                                          auth_headers_for_user,
                                                          json_headers, create_schema,
                                                          create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'obj': {
                              'type': 'string',
                              'x-cap-permission': {
                                  'users': ['cms_user@cern.ch']
                              },
                          }
                      },
                  })
    deposit = create_deposit(owner, 'test-analysis')
    pid = deposit['_deposit']['id']

    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": "test"}))
    assert resp.status_code == 200


def test_deposit_validation_on_schema_with_x_cap_permission(client, users,
                                                            auth_headers_for_user,
                                                            json_headers, create_schema,
                                                            create_deposit):
    owner = users['superuser']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'obj': {
                              'type': 'string',
                              'x-cap-permission': {
                                  'users': ['superuser@cern.ch']
                              },
                          }
                      },
                  })
    deposit = create_deposit(owner, 'test-analysis')
    pid = deposit['_deposit']['id']

    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": "test"}))
    assert resp.status_code == 200

    user = users['cms_user']
    headers = auth_headers_for_user(owner)
    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"title": "test"}))
    assert resp.status_code == 200


def test_deposit_validation_on_schema_field_user_cannot_edit(client, users,
                                                             auth_headers_for_user,
                                                             json_headers, create_schema,
                                                             create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'obj': {
                              'type': 'string',
                              'x-cap-permission': {
                                  'users': ['cms_user_non_existing@cern.ch']
                              },
                          }
                      },
                  })
    deposit = create_deposit(owner, 'test-analysis')
    pid = deposit['_deposit']['id']

    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": "test"}))

    assert resp.status_code == 422
    assert resp.json['errors'][0]['message'] == 'You cannot edit this field.'


def test_deposit_validation_on_schema_field_user_role(client, users,
                                                      auth_headers_for_user,
                                                      json_headers, create_schema,
                                                      create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'obj': {
                              'type': 'string',
                              'x-cap-permission': {
                                  'roles': ['some-egroup@cern.ch', 'some-another-egroup@cern.ch']
                              },
                          }
                      },
                  })
    deposit = create_deposit(owner, 'test-analysis')
    pid = deposit['_deposit']['id']

    # User not present in the specified egroups
    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": "test"}))

    assert resp.status_code == 422
    assert resp.json['errors'][0]['message'] == 'You cannot edit this field.'

    # Add the user to the egroup
    add_role_to_user(owner, 'some-egroup@cern.ch')
    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": "test"}))

    assert resp.status_code == 200


def test_deposit_validation_on_schema_field_user_cannot_edit_both_present(client, users,
                                                                          auth_headers_for_user,
                                                                          json_headers, create_schema,
                                                                          create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'obj': {
                              'type': 'string',
                              'x-cap-permission': {
                                  'users': ['cmsd_user@cern.ch'],
                                  'roles': ['some-egroup@cern.ch']
                              },
                          }
                      },
                  })
    deposit = create_deposit(owner, 'test-analysis')
    pid = deposit['_deposit']['id']

    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": "test"}))

    assert resp.status_code == 422
    assert resp.json['errors'][0]['message'] == 'You cannot edit this field.'


def test_deposit_validation_on_schema_field_user_can_edit_both_present(client, users,
                                                                       auth_headers_for_user,
                                                                       json_headers, create_schema,
                                                                       create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'obj': {
                              'type': 'string',
                              'x-cap-permission': {
                                  'users': ['cms_user@cern.ch'],
                                  'roles': ['some-egroup@cern.ch']
                              },
                          }
                      },
                  })
    deposit = create_deposit(owner, 'test-analysis')
    pid = deposit['_deposit']['id']

    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": "test"}))

    assert resp.status_code == 200


def test_deposit_validation_on_schema_field_user_cannot_edit_with_custom_message(client, users,
                                                                                auth_headers_for_user,
                                                                                json_headers, create_schema,
                                                                                create_deposit):
    owner = users['cms_user']
    headers = auth_headers_for_user(owner)
    create_schema('test-analysis',
                  experiment='CMS',
                  deposit_schema={
                      'type': 'object',
                      'required': ['title'],
                      'properties': {
                          'title': {
                              'type': 'string'
                          },
                          'obj': {
                              'type': 'string',
                              'x-cap-permission': {
                                  'users': ['cmsd_user@cern.ch'],
                                  'roles': ['some-egroup@cern.ch'],
                                  'error_message': 'Test error message from schema.'
                              },
                          }
                      },
                  })
    deposit = create_deposit(owner, 'test-analysis')
    pid = deposit['_deposit']['id']

    resp = client.put('/deposits/{}'.format(pid),
                      headers=headers + json_headers,
                      data=json.dumps({"obj": "test"}))

    assert resp.status_code == 422
    assert resp.json['errors'][0]['message'] == 'Test error message from schema.'
