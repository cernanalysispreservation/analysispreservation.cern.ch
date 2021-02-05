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
import re
import json
from tempfile import NamedTemporaryFile

from conftest import _datastore


def test_not_valid_json_fails(app, cli_runner):
    with NamedTemporaryFile('r') as tmp:
        res = cli_runner(f'fixtures create-deposit --file {tmp.name}')

    assert res.exit_code == 2
    assert 'Not a valid JSON file.' in res.output


def test_no_ana_or_schema_given_fails(app, cli_runner):
    with NamedTemporaryFile('w+t') as tmp:
        tmp.write('{"basic_info": {"analysis_title": "test"}}')
        tmp.seek(0)
        res = cli_runner(f'fixtures create-deposit --file {tmp.name}')

    assert res.exit_code == 0
    assert 'You need to provide the --ana/-a parameter ' \
           'OR add the $schema field in your JSON' in res.output


def test_wrong_ana_fails(app, create_schema, cli_runner):
    with NamedTemporaryFile('w+t') as tmp:
        tmp.write('{"basic_info": {"analysis_title": "test"}}')
        tmp.seek(0)
        res = cli_runner(f'fixtures create-deposit --file {tmp.name} --ana test')

    assert res.exit_code == 0
    assert 'Provided schema is not a valid option.' in res.output


def test_wrong_schema_fails(app, create_schema, cli_runner):
    data = [{
        "$schema": "https://analysispreservation.cern.ch/schemas/deposits/records/test-v0.0.1.json",
        "basic_info": {"analysis_title": "test"}
    }]

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write(json.dumps(data))
        tmp.seek(0)
        res = cli_runner(f'fixtures create-deposit --file {tmp.name}')

    assert res.exit_code == 0
    assert 'Provided schema is not a valid option.' in res.output


def test_schema_validation_fails(app, create_schema, cli_runner):
    create_schema(
        'test', experiment='CMS',
        deposit_schema={
            'type': 'object',
            'properties': {
                'title': {'type': 'integer'}
            }
        }
    )
    data = [{"title": "test"}]

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write(json.dumps(data))
        tmp.seek(0)
        res = cli_runner(f'fixtures create-deposit --file {tmp.name} --ana test')

    assert res.exit_code == 0
    assert "'test' is not of type 'integer'" in res.output


def test_create_record_success(app, db, location, cli_runner, create_schema, auth_headers_for_superuser):
    create_schema('test', experiment='CMS')

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write('{"basic_info": {"analysis_title": "test"}}')
        tmp.seek(0)
        res = cli_runner(f'fixtures create-deposit --file {tmp.name} --ana test')

    assert res.exit_code == 0

    with app.test_client() as client:
        depid = re.search(r'id: (.*?)\n', res.output).group(1)
        resp = client.get(f'/deposits/{depid}', headers=auth_headers_for_superuser)

    assert resp.status_code == 200


def test_create_record_success_with_multiple_records(
        app, db, location, cli_runner, create_schema, auth_headers_for_superuser):
    create_schema('test', experiment='CMS')

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write('[{"basic_info": {"analysis_title": "test"}}, {"basic_info": {"analysis_title": "test"}}]')
        tmp.seek(0)
        res = cli_runner(f'fixtures create-deposit --file {tmp.name} --ana test')

    assert res.exit_code == 0
    assert res.output.count('Created deposit') == 2


def test_create_with_multiple_records_both_fails_and_succeeds(app, db, location, cli_runner, create_schema):
    create_schema(
        'test', experiment='CMS',
        deposit_schema={
            'type': 'object',
            'properties': {
                'title': {'type': 'integer'}
            },
        }
    )
    data = [{"title": "test1"}, {"title": 10}]

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write(json.dumps(data))
        tmp.seek(0)
        res = cli_runner(f'fixtures create-deposit --file {tmp.name} --ana test')

    assert res.exit_code == 0
    assert "'test1' is not of type 'integer'" in res.output
    assert res.output.count('Created deposit') == 1


def test_create_record_success_with_multiple_records_schema_and_ana(
        app, db, location, cli_runner, create_schema):
    create_schema('test', experiment='CMS')
    create_schema('test2', experiment='CMS', version='0.0.1')

    data = [{
        "$schema": "https://analysispreservation.cern.ch/schemas/deposits/records/test2-v0.0.1.json",
        "basic_info": {"analysis_title": "test"}
    }, {
        "basic_info": {"analysis_title": "test"}
    }]

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write(json.dumps(data))
        tmp.seek(0)
        res = cli_runner(f'fixtures create-deposit --file {tmp.name} --ana test')

    assert res.exit_code == 0
    assert res.output.count('Created deposit') == 2
    assert "Your data already provide a $schema, --ana will not be used." in res.output


def test_create_record_success_with_role_and_user(
        app, db, location, users, cli_runner, create_schema, auth_headers_for_superuser):
    user_mail = users['cms_user'].email
    create_schema('test', experiment='CMS')
    _datastore.find_or_create_role('test@cern.ch')

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write('{}')
        tmp.seek(0)
        res = cli_runner(
            f'fixtures create-deposit --file {tmp.name} --ana test -r test@cern.ch -u {user_mail}')

    assert res.exit_code == 0

    with app.test_client() as client:
        depid = re.search(r'id: (.*?)\n', res.output).group(1)
        resp = client.get(f'/deposits/{depid}', headers=auth_headers_for_superuser)

    assert resp.status_code == 200
    assert resp.json['access']['deposit-read']['roles'] == ['test@cern.ch']
    assert resp.json['access']['deposit-read']['users'] == [user_mail]


def test_create_record_success_with_role_and_owner(
        app, db, location, users, cli_runner, create_schema, auth_headers_for_superuser):
    user_mail = users['cms_user'].email
    create_schema('test', experiment='CMS')
    _datastore.find_or_create_role('test@cern.ch')

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write('{}')
        tmp.seek(0)
        res = cli_runner(
            f'fixtures create-deposit --file {tmp.name} --ana test -r test@cern.ch -o {user_mail}')

    assert res.exit_code == 0

    with app.test_client() as client:
        depid = re.search(r'id: (.*?)\n', res.output).group(1)
        resp = client.get(f'/deposits/{depid}', headers=auth_headers_for_superuser)

    assert resp.status_code == 200
    assert resp.json['access']['deposit-read']['roles'] == ['test@cern.ch']
    assert resp.json['created_by'] == user_mail


def test_create_record_success_with_user_and_owner(
        app, db, location, users, cli_runner, create_schema, auth_headers_for_superuser):
    user_mail = users['cms_user'].email
    user_mail2 = users['cms_user2'].email
    create_schema('test', experiment='CMS')
    _datastore.find_or_create_role('test@cern.ch')

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write('{}')
        tmp.seek(0)
        res = cli_runner(
            f'fixtures create-deposit --file {tmp.name} --ana test -u {user_mail} -o {user_mail2}')

    assert res.exit_code == 0

    with app.test_client() as client:
        depid = re.search(r'id: (.*?)\n', res.output).group(1)
        resp = client.get(f'/deposits/{depid}', headers=auth_headers_for_superuser)

    assert resp.status_code == 200
    assert resp.json['access']['deposit-read']['users'] == [user_mail2, user_mail]
    assert resp.json['created_by'] == user_mail2


def test_create_record_success_with_multiple_roles(
        app, db, location, users, cli_runner, create_schema, auth_headers_for_superuser):
    create_schema('test', experiment='CMS')
    _datastore.find_or_create_role('test@cern.ch')
    _datastore.find_or_create_role('test2@cern.ch')

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write('{}')
        tmp.seek(0)
        res = cli_runner(
            f'fixtures create-deposit --file {tmp.name} --ana test -r test@cern.ch -r test2@cern.ch')

    assert res.exit_code == 0

    with app.test_client() as client:
        depid = re.search(r'id: (.*?)\n', res.output).group(1)
        resp = client.get(f'/deposits/{depid}', headers=auth_headers_for_superuser)

    assert resp.status_code == 200
    assert resp.json['access']['deposit-read']['roles'] == ['test@cern.ch', 'test2@cern.ch']


def test_create_record_success_with_multiple_users(
        app, db, location, users, cli_runner, create_schema, auth_headers_for_superuser):
    user_mail = users['cms_user'].email
    user_mail2 = users['cms_user2'].email
    create_schema('test', experiment='CMS')

    with NamedTemporaryFile('w+t') as tmp:
        tmp.write('{}')
        tmp.seek(0)
        res = cli_runner(
            f'fixtures create-deposit --file {tmp.name} --ana test -u {user_mail} -u {user_mail2}')

    assert res.exit_code == 0

    with app.test_client() as client:
        depid = re.search(r'id: (.*?)\n', res.output).group(1)
        resp = client.get(f'/deposits/{depid}', headers=auth_headers_for_superuser)

    assert resp.status_code == 200
    assert resp.json['access']['deposit-read']['users'] == [user_mail, user_mail2]
