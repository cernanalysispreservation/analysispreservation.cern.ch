# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2020 CERN.
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
import responses
from cap.modules.schemas.models import Schema


def test_add_fixtures_no_args(app, db, es, cli_runner):
    res = cli_runner('fixtures schemas')

    assert res.exit_code == 0
    assert 'cms-analysis has been added.' in res.output
    assert 'alice-analysis has been added.' in res.output


def test_add_fixtures_with_dir(app, db, es, cli_runner):
    res = cli_runner('fixtures schemas --dir cap/modules/fixtures/schemas')

    assert res.exit_code == 0
    assert 'cms-analysis has been added.' in res.output
    assert 'alice-analysis has been added.' in res.output


def test_add_fixtures_with_empty_dir(app, db, es, cli_runner):
    res = cli_runner('fixtures schemas --dir tests/integration/cli')

    assert res.exit_code == 0
    assert res.output == ''


@responses.activate
def test_add_schemas_with_url(app, db, es, cli_runner):
    responses.add(
        responses.GET,
        'http://schemas.org/my-schema.json',
        json={
            'version': '0.0.1',
            'name': 'my-schema',
            'use_deposit_as_record': True,
            'deposit_schema': {
                'properties': {
                    '_buckets': {},
                    '_deposit': {},
                    '_files': {},
                    '_experiment': {},
                    '_fetched_from': {},
                    '_user_edited': {},
                    '_access': {}
                }
            }
        },
        status=200,
    )
    res = cli_runner('fixtures schemas --url http://schemas.org/my-schema.json')

    assert res.exit_code == 0
    assert 'my-schema has been added.' in res.output


@responses.activate
def test_add_schemas_with_url_missing_required(app, db, es, cli_runner):
    responses.add(
        responses.GET,
        'http://schemas.org/my-schema.json',
        json={
            'version': '0.0.1',
            'name': 'my-schema',
            'use_deposit_as_record': True,
            'deposit_schema': {
                'properties': {
                    '_buckets': {},
                    '_deposit': {}
                }
            }
        },
        status=200,
    )
    res = cli_runner('fixtures schemas --url http://schemas.org/my-schema.json')

    assert res.exit_code == 0
    assert "Missing required fields. Make sure that all of:" in res.output


@responses.activate
def test_add_schemas_with_url_missing_required_force_add(app, db, es, cli_runner):
    responses.add(
        responses.GET,
        'http://schemas.org/my-schema.json',
        json={
            'version': '0.0.1',
            'name': 'my-schema',
            'use_deposit_as_record': True,
            'deposit_schema': {
                'properties': {
                    '_buckets': {},
                    '_deposit': {}
                }
            }
        },
        status=200,
    )
    res = cli_runner('fixtures schemas --url http://schemas.org/my-schema.json -f')

    assert res.exit_code == 0
    assert 'my-schema has been added.' in res.output


@responses.activate
def test_add_schemas_with_url_error(app, db, es, cli_runner):
    responses.add(
        responses.GET,
        'http://schemas.org/my-schema.json',
        status=500,
    )
    res = cli_runner('fixtures schemas --url http://schemas.org/my-schema.json')

    assert res.exit_code == 0
    assert 'Please provide a public url to a json file. Error 500.' in res.output


@responses.activate
def test_add_schemas_with_url_with_replace(app, db, cli_runner):
    schema = Schema(
        name='test',
        experiment='CMS',
        version='1.0.0',
        deposit_schema={
            'type': 'object',
            'properties': {
                'title': {'type': 'string'}
            }
        })
    db.session.add(schema)
    db.session.commit()

    responses.add(
        responses.GET,
        'http://schemas.org/my-schema.json',
        json={
            'version': '1.0.0',
            'name': 'test',
            'use_deposit_as_record': True,
            'deposit_schema': {
                'properties': {
                    '_buckets': {},
                    '_deposit': {},
                    '_files': {},
                    '_experiment': {},
                    '_fetched_from': {},
                    '_user_edited': {},
                    '_access': {},
                    'title': {'type': 'string'},
                    'abstract': {'type': 'string'}
                }
            }
        },
        status=200
    )

    res = cli_runner('fixtures schemas --url http://schemas.org/my-schema.json -r')
    assert res.exit_code == 0
    assert 'test has been added.' in res.output

    schema = Schema.get_latest('test')
    assert 'abstract' in schema.deposit_schema['properties'].keys()
