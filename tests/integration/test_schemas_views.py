# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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

"""Unit tests for schemas views."""
import json

from cap.modules.schemas.models import Schema

########################
# api/jsonschemas/  [GET]
# api/jsonschemas/{id}/{version}  [GET]
########################


def test_get_schemas_when_user_not_logged_in_returns_401(app, users):
    with app.test_client() as client:
        resp = client.get('/jsonschemas/')

        assert resp.status_code == 401


def test_get_when_user_outside_of_experiment_returns_403(app, db, users, auth_headers_for_user):
    cms_user = users['cms_user']
    other_user = users['lhcb_user']
    schema = Schema(name='cms-schema',
                    version='1.2.3',
                    fullname='CMS Schema 1.2.3',
                    experiment='CMS',
                    deposit_schema={'title': 'deposit_schema'},
                    deposit_options={'title': 'deposit_options'},
                    record_schema={'title': 'record_schema'},
                    record_options={'title': 'record_options'},
                    record_mapping={'doc': {'properties': {
                        "title": {"type": "text"}}}},
                    deposit_mapping={'doc': {'properties': {
                        "keyword": {"type": "keyword"}}}},
                    is_indexed=True,
                    )

    db.session.add(schema)
    db.session.add(Schema(name='cms-schema', version='1.1.0'))
    db.session.add(Schema(name='lhcb-schema'))
    db.session.commit()

    with app.test_client() as client:
        resp = client.get(
            '/jsonschemas/cms-schema/1.2.3', headers=auth_headers_for_user(other_user))

        assert resp.status_code == 403


def test_get(app, db, users, auth_headers_for_user):
    cms_user = users['cms_user']
    schema = Schema(name='cms-schema',
                    version='1.2.3',
                    fullname='CMS Schema 1.2.3',
                    experiment='CMS',
                    deposit_schema={'title': 'deposit_schema'},
                    deposit_options={'title': 'deposit_options'},
                    record_schema={'title': 'record_schema'},
                    record_options={'title': 'record_options'},
                    record_mapping={'doc': {'properties': {
                        "title": {"type": "text"}}}},
                    deposit_mapping={'doc': {'properties': {
                        "keyword": {"type": "keyword"}}}},
                    is_indexed=True,
                    )

    db.session.add(schema)
    db.session.add(Schema(name='cms-schema', version='1.1.0'))
    db.session.add(Schema(name='lhcb-schema'))
    db.session.commit()

    with app.test_client() as client:
        resp = client.get(
            '/jsonschemas/', headers=auth_headers_for_user(cms_user))

        assert resp.status_code == 200
        assert resp.json == [{
            'name': 'cms-schema',
            'version': '1.2.3',
            'fullname': 'CMS Schema 1.2.3',
            'is_indexed': 'True',
            'use_deposit_as_record': 'False',
            'deposit_schema': {'title': 'deposit_schema'},
            'deposit_options': {'title': 'deposit_options'},
            'record_schema': {'title': 'record_schema'},
            'record_options': {'title': 'record_options'},
            'record_mapping': {'doc': {'properties': {
                "title": {"type": "text"}}}},
            'deposit_mapping': {'doc': {'properties': {
                "keyword": {"type": "keyword"}}}}
        }]

        resp = client.get('/jsonschemas/cms-schema/1.2.3',
                          headers=auth_headers_for_user(cms_user))

        assert resp.status_code == 200
        assert resp.json == {
            'name': 'cms-schema',
            'version': '1.2.3',
            'fullname': 'CMS Schema 1.2.3',
            'is_indexed': 'True',
            'use_deposit_as_record': 'False',
            'deposit_schema': {'title': 'deposit_schema'},
            'deposit_options': {'title': 'deposit_options'},
            'record_schema': {'title': 'record_schema'},
            'record_options': {'title': 'record_options'},
            'record_mapping': {'doc': {'properties': {
                "title": {"type": "text"}}}},
            'deposit_mapping': {'doc': {'properties': {
                "keyword": {"type": "keyword"}}}}
        }

        resp = client.get('/jsonschemas/cms-schema',
                          headers=auth_headers_for_user(cms_user))

        assert resp.status_code == 200
        assert resp.json == {
            'name': 'cms-schema',
            'version': '1.2.3',
            'fullname': 'CMS Schema 1.2.3',
            'is_indexed': 'True',
            'use_deposit_as_record': 'False',
            'deposit_schema': {'title': 'deposit_schema'},
            'deposit_options': {'title': 'deposit_options'},
            'record_schema': {'title': 'record_schema'},
            'record_options': {'title': 'record_options'},
            'record_mapping': {'doc': {'properties': {
                "title": {"type": "text"}}}},
            'deposit_mapping': {'doc': {'properties': {
                "keyword": {"type": "keyword"}}}}
        }


########################
# api/jsonschemas/  [POST]
########################

def test_post_schema_when_user_not_logged_in_returns_401(app, users, json_headers):
    with app.test_client() as client:
        resp = client.post('/jsonschemas/', headers=json_headers)

        assert resp.status_code == 401


def test_post(app, db, users, auth_headers_for_user, json_headers):
    owner = users['cms_user']
    schema = json.dumps(dict(name='cms-schema',
                             version='1.2.3',
                             fullname='CMS Schema 1.2.3',
                             deposit_schema={'title': 'deposit_schema'},
                             deposit_options={'title': 'deposit_options'},
                             record_schema={'title': 'record_schema'},
                             record_options={'title': 'record_options'},
                             record_mapping={'doc': {'properties': {
                                 "title": {"type": "text"}}}},
                             deposit_mapping={'doc': {'properties': {
                                 "keyword": {"type": "keyword"}}}},
                             is_indexed=True
                             ))

    with app.test_client() as client:
        resp = client.post('/jsonschemas/', data=schema,
                           headers=json_headers + auth_headers_for_user(owner))

        assert resp.status_code == 200
        assert resp.json == {
            'name': 'cms-schema',
            'version': '1.2.3',
            'fullname': 'CMS Schema 1.2.3',
            'is_indexed': 'True',
            'use_deposit_as_record': 'False',
            'deposit_schema': {'title': 'deposit_schema'},
            'deposit_options': {'title': 'deposit_options'},
            'record_schema': {'title': 'record_schema'},
            'record_options': {'title': 'record_options'},
            'record_mapping': {'doc': {'properties': {
                "title": {"type": "text"}}}},
            'deposit_mapping': {'doc': {'properties': {
                "keyword": {"type": "keyword"}}}}
        }


#####################################
# api/jsonschemas/{id}/{version}  [PUT]
#####################################

def test_put_schema_when_user_not_logged_in_returns_401(app, schema, users, json_headers):
    with app.test_client() as client:
        resp = client.put(
            '/jsonschemas/{}/{}'.format(schema.name, schema.version), headers=json_headers)

        assert resp.status_code == 401


def test_put(app, db, auth_headers_for_user, users, json_headers):
    owner = users['cms_user']
    schema = json.dumps(
        dict(name='cms-schema', version='1.2.3', fullname='Old fullname'))
    new_schema = dict(name='new-schema',
                      version='1.0.0',
                      fullname='New fullname',
                      deposit_schema={'title': 'deposit_schema'},
                      deposit_options={'title': 'deposit_options'},
                      record_schema={'title': 'record_schema'},
                      record_options={'title': 'record_options'},
                      record_mapping={'doc': {'properties': {
                          "title": {"type": "text"}}}},
                      deposit_mapping={'doc': {'properties': {
                          "keyword": {"type": "keyword"}}}},
                      is_indexed=True,
                      use_deposit_as_record=True
                      )

    with app.test_client() as client:
        resp = client.post('/jsonschemas/', data=schema,
                           headers=json_headers+auth_headers_for_user(owner))

        assert resp.status_code == 200

        resp = client.put('/jsonschemas/cms-schema/1.2.3', data=json.dumps(new_schema),
                          headers=json_headers + auth_headers_for_user(owner))

        assert resp.status_code == 200
        assert resp.json == {
            'name': 'cms-schema',
            'version': '1.2.3',
            'fullname': 'New fullname',
            'is_indexed': 'False',
            'use_deposit_as_record': 'True',
            'deposit_schema': {},
            'deposit_options': {'title': 'deposit_options'},
            'record_schema': {},
            'record_options': {'title': 'record_options'},
            'record_mapping': {'doc': {'properties': {
                "title": {"type": "text"}}}},
            'deposit_mapping': {'doc': {'properties': {
                "keyword": {"type": "keyword"}}}}
        }


def test_put_when_not_an_schema_owner_returns_403(app, db, auth_headers_for_user, users, json_headers):
    owner = users['cms_user']
    another_user = users['cms_user2']
    schema = json.dumps(dict(name='cms-schema', version='1.2.3'))

    with app.test_client() as client:
        resp = client.post('/jsonschemas/', data=schema,
                           headers=json_headers+auth_headers_for_user(owner))

        assert resp.status_code == 200

        resp = client.put('/jsonschemas/cms-schema/1.2.3', data=json.dumps({}),
                          headers=json_headers +
                          auth_headers_for_user(another_user))

        assert resp.status_code == 403


#####################################
# api/jsonschemas/{id}/{version}  [DELETE]
#####################################

def test_delete_schema_when_user_not_logged_in_returns_401(app, schema, users, json_headers):
    with app.test_client() as client:
        resp = client.delete(
            '/jsonschemas/{}/{}'.format(schema.name, schema.version), headers=json_headers)

        assert resp.status_code == 401


def test_delete_when_not_an_schema_owner_returns_403(app, db, auth_headers_for_user, users, json_headers):
    owner = users['cms_user']
    another_user = users['cms_user2']
    schema = json.dumps(dict(name='cms-schema', version='1.2.3'))

    with app.test_client() as client:
        resp = client.post('/jsonschemas/', data=schema,
                           headers=json_headers+auth_headers_for_user(owner))

        assert resp.status_code == 200

        resp = client.delete('/jsonschemas/cms-schema/1.2.3', data=json.dumps({}),
                             headers=json_headers +
                             auth_headers_for_user(another_user))

        assert resp.status_code == 403


def test_delete(app, db, auth_headers_for_user, users, json_headers):
    owner = users['cms_user']
    schema = json.dumps(dict(name='cms-schema', version='1.2.3'))

    with app.test_client() as client:
        resp = client.post('/jsonschemas/', data=schema,
                           headers=json_headers+auth_headers_for_user(owner))

        assert resp.status_code == 200

        resp = client.delete('/jsonschemas/cms-schema/1.2.3', data=json.dumps({}),
                             headers=json_headers +
                             auth_headers_for_user(owner))

        assert resp.status_code == 204

        resp = client.get('/jsonschemas/cms-schema/1.2.3', data=json.dumps({}),
                          headers=json_headers +
                          auth_headers_for_user(owner))

        assert resp.status_code == 404
