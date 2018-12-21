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


import json

from invenio_search import current_search
from pytest import mark, raises
from sqlalchemy.exc import IntegrityError

from cap.modules.schemas.errors import SchemaDoesNotExist
from cap.modules.schemas.models import Schema


def test_resolve_schema_when_schema_and_refs_belong_to_experiment(app,
                                                                  location,
                                                                  users,
                                                                  create_schema,
                                                                  jsonschemas_host,
                                                                  auth_headers_for_user,
                                                                  json_headers):
    owner = users['cms_user']
    nested_schema = create_schema('nested-schema-v0.0.0',
                                  experiment='CMS',
                                  json={
        'type': 'object',
        'properties': {
            'title': {
                'type': 'string'
            }
        }
    })

    schema = create_schema('deposits/records/test-analysis-v1.0.0',
                           experiment='CMS',
                           json={
                               'type': 'object',
                               'properties': {
                                   'nested': {
                                       '$ref': nested_schema.fullpath,
                                   }
                               }
                           })

    with app.test_client() as client:
        resp = client.get('/schemas/{}'.format(schema.fullpath),
                          headers=auth_headers_for_user(owner))

        assert resp.status_code == 200
