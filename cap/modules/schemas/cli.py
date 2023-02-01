# * coding: utf8 *
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016 CERN.
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
# MA 021111307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
"""CAP Schema cli."""

import json
import os

import click
import requests
from flask import current_app
from flask.cli import with_appcontext
from invenio_db import db
from invenio_accounts.models import User
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound
from invenio_oauth2server.models import Token
from invenio_search import current_search_client
from sqlalchemy.exc import IntegrityError

from cap.cli import MutuallyExclusiveOption
from cap.modules.deposit.errors import DepositValidationError
from cap.modules.fixtures.cli import fixtures
from cap.modules.records.api import CAPRecord
from cap.modules.schemas.helpers import ValidationError
from cap.modules.schemas.models import Schema
from cap.modules.schemas.resolvers import (
    resolve_schema_by_name_and_version,
    resolve_schema_by_url,
    schema_name_to_url,
)
from cap.modules.schemas.utils import is_later_version

DEPOSIT_REQUIRED_FIELDS = [
    '_buckets',
    '_deposit',
    '_files',
    '_experiment',
    '_fetched_from',
    '_user_edited',
    '_access',
]


@fixtures.command()
@with_appcontext
def generate_tokens():
    token_file_path = current_app.config.get('TESTS_E2E_TOKEN_FILE')
    user_list = [
        "info@inveniosoftware.org",
        "cms@inveniosoftware.org",
        "atlas@inveniosoftware.org",
        "alice@inveniosoftware.org",
        "lhcb@inveniosoftware.org",
        "random@inveniosoftware.org",
    ]
    for user_email in user_list:
        token = _get_or_create_token("testtoken", user_email)
        with open(token_file_path, 'a') as f:
            f.write(f"{user_email}:{token}\n")
            click.secho(f'User: {user_email} - Token: {token}', fg='green')
    click.secho('Tokens saved at {}'.format(token_file_path), fg='green')
    return


def _get_or_create_token(token_name, user_email):
    """Return method to fetch or create a user write token."""
    user = User.query.filter_by(email=user_email).first()

    if user:
        token_ = Token.query.filter_by(user_id=user.id).first()
        if not token_:
            token_ = Token.create_personal(
                token_name, user.id, scopes=['deposit:write']
            )
            db.session.add(token_)
        db.session.commit()
        return token_.access_token
    else:
        return None


@fixtures.command()
@click.option(
    '--schema-url',
    '-u',
    cls=MutuallyExclusiveOption,
    mutually_exclusive=["ana_type", "ana_version"],
    help='The url of the schema used for validation.',
)
@click.option(
    '--ana-type',
    '-a',
    cls=MutuallyExclusiveOption,
    mutually_exclusive=["schema_url"],
    help='The analysis type of the schema used for validation.',
)
@click.option(
    '--ana-version', '-v', help='The analysis version of the records.'
)
@click.option(
    '--compare-with',
    '-c',
    help='The schema version, that the ' 'records should be compared to.',
)
@click.option(
    '--status',
    '-s',
    default='draft',
    type=click.Choice(['draft', 'published']),
    help='The metadata type that will be used for validation.',
)
@click.option(
    '--export',
    '-e',
    type=click.Path(),
    help='A file where, the validation errors can be saved.',
)
@click.option(
    '--export-type',
    '-et',
    default=None,
    type=click.Choice(['md']),
    help='The export type that will be used for output.',
)
@with_appcontext
def validate(
    schema_url, ana_type, ana_version, compare_with, status, export, export_type
):
    """Validate deposit or record metadata based on their schema.

    Provide the schema url OR ana-type and version, as well as the schema version
    that you want to compare the records you get, to. E.g.

    If you do not provide an ana-version, it will get the latest. If you do
    not provide a -c parameter, the records will compare the data to their
    own schema.

    cap fixtures validate -u https://analysispreservation.cern.ch/schemas/deposits/records/test-v2.0.0.json -c 1.0.0  # noqa
    cap fixtures validate -a test -c 1.0.0
    """
    try:
        if schema_url:
            schema = resolve_schema_by_url(schema_url)
        elif ana_type:
            schema = resolve_schema_by_name_and_version(ana_type, ana_version)
        else:
            raise click.UsageError(
                'You need to provide the ana-type or the schema-url.'
            )
    except JSONSchemaNotFound:
        raise click.UsageError('Schema not found.')
    except ValueError:
        raise click.UsageError(
            'Version has to be passed as string <major>.<minor>.<patch>.'
        )

    # differentiate between drafts/published
    from cap.modules.deposit.api import CAPDeposit

    if status == 'draft':
        search_path = 'deposits-records'
        cap_record_class = CAPDeposit
    else:
        search_path = 'records'
        cap_record_class = CAPRecord

    # get all the records for this specific schema/type combination
    records = current_search_client.search(
        index=f"{search_path}-{schema.name}-v{schema.version}",
        body={
            "query": {
                "bool": {
                    "must": [
                        {"match": {"_deposit.status": status}},
                        {
                            "match": {
                                "$schema": schema_name_to_url(
                                    schema.name, schema.version
                                )
                            }
                        },
                    ]
                }
            }
        },
        size=5000,
    )['hits']['hits']
    pids = [rec['_id'] for rec in records]

    click.secho(
        f'{len(records)} record(s) of {schema.name} found.\n', fg='green'
    )

    total_errors = []
    for pid in pids:
        cap_record = cap_record_class.get_record(pid)
        cap_record_pid = cap_record.get('_deposit', {}).get('id')
        cap_record_cadi_id = cap_record.get('basic_info', {}).get('cadi_id')
        cap_host = 'https://analysispreservation.cern.ch/drafts'
        # get the url of the schema version, used for validation
        if compare_with:
            cap_record['$schema'] = schema_name_to_url(
                schema.name, compare_with
            )
        try:
            cap_record.validate()
            click.secho(f'No errors found in record {pid}', fg='green')
        except DepositValidationError as exc:
            if export_type == 'md':
                msg = (
                    '- [ ] Errors in **CADI ID:** '
                    + f'{cap_record_cadi_id or "?"}'
                    + f' - **[link]({cap_host}/{cap_record_pid})** :\n'
                )
                msg += "\n| Field Path | Error | \n| ---------- | ----- | \n"
                for err in exc.errors:
                    _err = err.res
                    msg += f"| ```{_err.get('field')}``` |"
                    msg += f" {_err.get('message')}  | \n"
                msg += "----\n"
            else:
                error_list = '\n'.join(str(err.res) for err in exc.errors)
                msg = (
                    f'Errors in {pid} - CADI '
                    + f'id: {cap_record_cadi_id or "?"}'
                    + f' - {cap_host}/{cap_record_pid} :\n{error_list}'
                )

            click.secho(msg, fg='red')

            if export:
                total_errors.append(msg)

    # export the errors in a file
    if export:
        with open(export, 'w') as out:
            out.writelines('\n\n'.join(err for err in total_errors))
        click.secho(f'Errors saved at {export}.', fg='red')


@fixtures.command()
@click.option(
    '--dir',
    '-d',
    type=click.Path(exists=True),
    help='The directory of the schemas to be added to the db.',
)
@click.option(
    '--url', '-u', help='The url of the schema to be added to the db.'
)
@click.option(
    '--force',
    '-f',
    is_flag=True,
    help='Force add the schema without validation.',
)
@click.option(
    '--force-version',
    '-fv',
    is_flag=True,
    help='Force disable version checking.',
)
@click.option(
    '--replace',
    '-r',
    is_flag=True,
    help='It this schema/version exists, update it.',
)
@with_appcontext
def schemas(dir, url, force, force_version, replace):
    """Add schemas to CAP.

    Add schemas either by downloading them from a url, or by adding
    them from a path. If no args are provided, then the schemas from the
    default path will be added to CAP.

    examples:
        cap fixtures schemas
        cap fixtures schemas --dir cap/folder/schemas
        cap fixtures schemas --url https://schemas.org/my-schema.json
    """
    if dir:
        add_fixtures_from_path(dir, force_version=force_version)
    if url:
        resp = requests.get(url)
        if not resp.ok:
            click.secho(
                f'Please provide a public url to a json file. '
                f'Error {resp.status_code}.',
                fg='red',
            )
            return

        try:
            data = resp.json()
            if not has_all_required_fields(data) and not force:
                click.secho(
                    f'Missing required fields. Make sure that all of: '
                    f'{DEPOSIT_REQUIRED_FIELDS} are in the json.',
                    fg='red',
                )  # noqa
                return
            add_schema_from_json(
                data, replace=replace, force_version=force_version
            )
        except (json.JSONDecodeError, ValueError):
            click.secho('Error in decoding the returned json.', fg='red')

    # by default, just add the fixtures from the default path
    if not dir and not url:
        add_fixtures_from_path(
            current_app.config.get('SCHEMAS_DEFAULT_PATH'),
            replace=replace,
            force_version=True,
        )


def add_fixtures_from_path(dir, replace=None, force_version=None):
    """Add fixtures from a specified path to CAP."""
    for root, dirs, files in os.walk(dir):
        json_filepaths = [
            os.path.join(root, f) for f in files if f.endswith(".json")
        ]

        for filepath in json_filepaths:
            with open(filepath, 'r') as f:
                try:
                    json_content = json.load(f)
                    add_schema_from_json(
                        json_content,
                        replace=replace,
                        force_version=force_version,
                    )
                except ValueError:
                    click.secho(f'Not valid json in {filepath} file', fg='red')


def add_schema_from_json(data, replace=None, force_version=None):
    """Add or update schema, using a json file."""
    allow_all = data.pop("allow_all", False)
    version = data['version']
    name = data['name']

    try:
        with db.session.begin_nested():
            try:
                _schema = Schema.get(name=name, version=version)
                if replace:
                    _schema.update(**data)
                    db.session.add(_schema)
                else:
                    click.secho(f'{name}-{version} already exists in the db.')
                    return
            except JSONSchemaNotFound:
                try:
                    _schema = Schema.get_latest(name=name)
                    if (
                        is_later_version(_schema.version, version)
                        and not force_version
                    ):
                        click.secho(
                            f'A later version ({_schema.version}) of '
                            f'{name} is already in the db. Error while '
                            f'adding {name}-{version}',
                            fg='red',
                        )
                        return
                    else:
                        _schema = Schema(**data)
                        db.session.add(_schema)
                except JSONSchemaNotFound:
                    _schema = Schema(**data)
                    db.session.add(_schema)

        # throws error if you try to re-insert the same action roles
        if allow_all and not replace:
            _schema.add_read_access_for_all_users()

        db.session.commit()
        click.secho(f'{name} has been added.', fg='green')
    except ValidationError as err:
        click.secho(err, fg='red')
        click.secho(
            f'Configuration is invalid. ' f'Aborting update for schema {name}.',
            fg='red',
        )
        return
    except IntegrityError:
        click.secho(f'An db error occurred while adding {name}.', fg='red')


def has_all_required_fields(data):
    """Check if there are any missing required fields in a json schema."""
    deposit_as_record = data.get('use_deposit_as_record')
    schemas_to_check = (
        [data['deposit_schema']]
        if deposit_as_record
        else [data['deposit_schema'], data['record_schema']]
    )

    for _schema in schemas_to_check:
        schema_fields = _schema.get('properties', {}).keys()

        # if there are no properties, we do not check
        if schema_fields:
            for req_field in DEPOSIT_REQUIRED_FIELDS:
                if req_field not in schema_fields:
                    return False
    return True
