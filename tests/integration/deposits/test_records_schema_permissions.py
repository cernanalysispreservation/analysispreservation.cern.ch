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

from six import PY3
from pytest import mark
from conftest import add_role_to_user, get_default_mapping, _datastore

from cap.modules.schemas.models import Schema

from time import sleep
from mock import patch
from mock.mock import MagicMock
########################
# api/jsonschemas/{schema_id}/permissions  [GET]
# api/jsonschemas/{schema_id}/{version}/permissions  [GET]
########################

@patch('cap.modules.user.utils.does_user_exist_in_ldap',
       MagicMock(return_value=False))
def test_schema_permission(
    client,
    es,
    db,
    users,
    location,
    create_schema,
    auth_headers_for_user,
    json_headers,
    auth_headers_for_superuser,clean_schema_acceess_cache

):
    schema_name = "example-schema"
    deposit_mapping = get_default_mapping(schema_name, "1.0.0")
    create_schema(
        schema_name,
        # experiment="CMS",
        
        deposit_schema={
            "type": "object",
            "properties": {"title": {"type": "string"}},
        },
        deposit_mapping=deposit_mapping,
    )
    other_user = users["lhcb_user"]
    random_user = users["random"]
    test_role = "test-egroup@cern.ch"
    add_role_to_user(random_user, test_role)
    metadata = {"$ana_type": schema_name}

    # 'other_user' HAS NO permission to create
    resp = client.post(
        "/deposits/",
        data=json.dumps(metadata),
        headers=auth_headers_for_user(other_user) + json_headers,
    )
    # TODO: update POST /deposits to return JSON response on wrong schema
    assert resp.status_code == 403

    # 'other_user' HAS NO permission to update schema permissions
    permission_metadata = {"deposit": {
        "create": { "users": [other_user.email], "roles": [test_role]}
    }}
    resp = client.post(
        f"/jsonschemas/{schema_name}/permissions",
        data=json.dumps(permission_metadata),
        headers=auth_headers_for_user(other_user) + json_headers,
    )
    assert resp.status_code == 403

    # 'superuser' HAS permission to update schema permissions
    resp = client.post(
        f"/jsonschemas/{schema_name}/permissions",
        data=json.dumps(permission_metadata),
        headers=auth_headers_for_superuser+ json_headers,
    )
    assert resp.status_code == 201

    # 'other_user' can now create
    metadata = {"$ana_type": schema_name}
    resp = client.post(
        "/deposits/",
        data=json.dumps(metadata),
        headers=auth_headers_for_user(other_user) + json_headers,
    )
    assert resp.status_code == 201
    dep_id = resp.json.get("id")

    # 'other_user' can GET created deposit
    resp = client.get(
        f"/deposits/{dep_id}",
        headers=auth_headers_for_user(other_user) + json_headers,
    )
    assert resp.status_code == 200

    # 'random_user' can NOT GET created deposit
    resp = client.get(
        f"/deposits/{dep_id}",
        headers=auth_headers_for_user(random_user) + json_headers,
    )
    assert resp.status_code == 403
    # 'random_user' can read other users deposit of this schema
    resp = client.get(
        f"/deposits",
        headers=auth_headers_for_user(random_user) + json_headers,
    )
    assert resp.status_code == 200
    assert resp.json.get("hits", {}).get("total") == 0
    
    # 'superuser' gives 'read' permissions to 'random_user' role
    metadata = {"deposit": {
        "read": {  "roles": [test_role]}
    }}
    resp = client.post(
        f"/jsonschemas/{schema_name}/permissions",
        data=json.dumps(metadata),
        headers=auth_headers_for_superuser+ json_headers,
    )
    assert resp.status_code == 201

    # 'random_user' can read other users deposit of this schema
    resp = client.get(
        f"/deposits/{dep_id}",
        headers=auth_headers_for_user(random_user) + json_headers,
    )
    assert resp.status_code == 200
    
    sleep(2)
        # 'random_user' can read other users deposit of this schema
    resp = client.get(
        f"/deposits",
        headers=auth_headers_for_user(random_user),
    )
    assert resp.status_code == 200
    assert resp.json.get("hits", {}).get("total") == 1

    # 'random_user' can now GET created deposit
    metadata = {"$ana_type": schema_name}
    resp = client.post(
        "/deposits/",
        data=json.dumps(metadata),
        headers=auth_headers_for_user(random_user) + json_headers,
    )

    assert resp.status_code == 201

    # 'superuser' HAS permission to update schema permissions
    permission_metadata = {"deposit": {
        "create": { "users": ["wrong.user@mmail.com"], "roles": [test_role]}
    }}
    resp = client.post(
        f"/jsonschemas/{schema_name}/permissions",
        data=json.dumps(permission_metadata),
        headers=auth_headers_for_superuser+ json_headers,
    )
    assert resp.status_code == 201
    assert resp.json[0]["status"] == "error"
    assert resp.json[1]["status"] == "error"

    sleep(1)
    # 'random_user' can read other users deposit of this schema
    resp = client.get(
        f"/deposits",
        headers=auth_headers_for_user(other_user) + json_headers,
    )
    assert resp.status_code == 200
    assert resp.json.get("hits", {}).get("total") == 1

    # 'random_user' can read other users deposit of this schema
    resp = client.get(
        f"/deposits",
        headers=auth_headers_for_user(random_user) + json_headers,
    )
    assert resp.status_code == 200
    assert resp.json.get("hits", {}).get("total") == 2
    
    # 'superuser' HAS permission to update schema permissions
    permission_metadata = {"deposit": {
        "read": { "roles": [test_role]},
        "create": { "roles": [test_role]}
    }}
    resp = client.delete(
        f"/jsonschemas/{schema_name}/permissions",
        data=json.dumps(permission_metadata),
        headers=auth_headers_for_superuser+ json_headers,
    )
    assert resp.status_code == 202
    resp = client.get(
        f"/jsonschemas/{schema_name}/permissions",
        headers=auth_headers_for_superuser+ json_headers,
    )

    sleep(2)

    # 'random_user' can read other users deposit of this schema
    resp = client.get(
        f"/deposits",
        headers=auth_headers_for_user(random_user),
    )
    assert resp.status_code == 200
    assert resp.json.get("hits", {}).get("total") == 1
