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

import itertools
import json
import os

import click
import requests
from flask import current_app
from flask_cli import with_appcontext
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound

from invenio_accounts.models import Role
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound
from invenio_search import current_search_client

from cap.cli import MutuallyExclusiveOption
from cap.modules.deposit.errors import DepositValidationError
from cap.modules.fixtures.cli import fixtures

from .models import Schema
from .resolvers import resolve_schema_by_url,\
    resolve_schema_by_name_and_version, schema_name_to_url
from .utils import is_later_version, process_action, actions_from_type

DEPOSIT_REQUIRED_FIELDS = [
    '_buckets',
    '_deposit',
    '_files',
    '_experiment',
    '_fetched_from',
    '_user_edited',
    '_access'
]


@fixtures.command()
@click.option('--permissions', '-p',
              required=True,
              help='Role permission actions. Accepts multiple options.')
@click.option('--roles', '-r',
              required=True,
              help='Role name(s) (mails) for use. Accepts multiple options.')
# deposit / record / schema
@click.option('--deposit', '_type',
              flag_value='deposit',
              default=True)
@click.option('--record', '_type',
              flag_value='record')
@click.option('--schema', '_type',
              flag_value='schema')
# allow / remove / deny
@click.option('--allow', 'schema_action',
              flag_value='allow',
              default=True)
@click.option('--deny', 'schema_action',
              flag_value='deny')
@click.option('--remove', 'schema_action',
              flag_value='remove')
@click.argument('schema-name')
@with_appcontext
def permissions(schema_name, permissions, roles, _type, schema_action):
    """
    Schema permission command group. Allows/Denies/Removes certain actions
    to roles, in order to have access to a deposit/record/schema.
    Examples:
        cap fixtures permissions
            -p read,admin -r test-users@cern.ch --allow --deposit SCHEMA_NAME
            -p read -r test-users@cern.ch --deny --deposit SCHEMA_NAME
            -p read -r test-users@cern.ch --allow --record SCHEMA_NAME
            -p read,admin -r test-users@cern.ch --allow --schema SCHEMA_NAME
    """
    perms = permissions.split(',')
    roles = roles.split(',')

    # create the correct action names, and
    # check if action is subscribed and can be used
    requested_actions = actions_from_type(_type, perms)
    allowed_actions = current_app.extensions['invenio-access'].actions

    for action in requested_actions:
        if action not in allowed_actions.keys():
            raise click.BadParameter(f'Action {action} is not registered.')

    # check if roles exist
    for role in roles:
        try:
            Role.query.filter_by(name=role).one()
        except NoResultFound:
            raise click.BadParameter(f'Role with name {role} not found.')

    # create all combinations of actions and roles
    actions_roles = list(itertools.product(requested_actions, roles))
    process_action(schema_action, schema_name, actions_roles)


@fixtures.command()
@click.option('--schema-url', '-u',
              cls=MutuallyExclusiveOption,
              mutually_exclusive=["ana_type", "ana_version"],
              help='The url of the schema used for validation.')
@click.option('--ana-type', '-a',
              cls=MutuallyExclusiveOption,
              mutually_exclusive=["schema_url"],
              help='The analysis type of the schema used for validation.')
@click.option('--ana-version', '-v',
              help='The analysis version of the records.')
@click.option('--compare-with', '-c',
              help='The schema version, that the '
                   'records should be compared to.')
@click.option('--status', '-s',
              default='draft',
              type=click.Choice(['draft', 'published']),
              help='The metadata type that will be used for validation.')
@click.option('--export', '-e',
              type=click.Path(),
              help='A file where, the validation errors can be saved.')
@click.option('--export-type', '-et',
              default=None,
              type=click.Choice(['md']),
              help='The export type that will be used for output.')
@with_appcontext
def validate(schema_url, ana_type, ana_version, compare_with,
             status, export, export_type):
    """
    Validate deposit or record metadata based on their schema. Provide the
    schema url OR ana-type and version, as well as the schema version that you
    want to compare the records you get, to. E.g.

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
                'You need to provide the ana-type or the schema-url.')
    except JSONSchemaNotFound:
        raise click.UsageError(
            'Schema not found.')
    except ValueError:
        raise click.UsageError(
            'Version has to be passed as string <major>.<minor>.<patch>.')

    # differentiate between drafts/published
    from cap.modules.deposit.api import CAPDeposit
    from cap.modules.records.api import CAPRecord

    if status == 'draft':
        search_path = 'deposits-records'
        cap_record_class = CAPDeposit
    else:
        search_path = 'records'
        cap_record_class = CAPRecord

    # get all the records for this specific schema/type combination
    records = current_search_client.search(
        search_path,
        q=f'_deposit.status: {status} AND '
          f'$schema: "{schema_name_to_url(schema.name, schema.version)}"',
        size=5000
    )['hits']['hits']
    pids = [rec['_id'] for rec in records]

    click.secho(
        f'{len(records)} record(s) of {schema.name} found.\n', fg='green')

    total_errors = []
    for pid in pids:
        cap_record = cap_record_class.get_record(pid)
        cap_record_pid = cap_record.get('_deposit', {}).get('id')
        cap_record_cadi_id = cap_record.get('basic_info', {}).get('cadi_id')
        cap_host = 'https://analysispreservation.cern.ch/drafts'
        # get the url of the schema version, used for validation
        if compare_with:
            cap_record['$schema'] = schema_name_to_url(
                schema.name, compare_with)
        try:
            cap_record.validate()
            click.secho(f'No errors found in record {pid}', fg='green')
        except DepositValidationError as exc:
            if export_type == 'md':
                msg = '- [ ] Errors in **CADI ID:** ' + \
                    f'{cap_record_cadi_id or "?"}' + \
                    f' - **[link]({cap_host}/{cap_record_pid})** :\n'
                msg += "\n| Field Path | Error | \n| ---------- | ----- | \n"
                for err in exc.errors:
                    _err = err.res
                    msg += f"| ```{_err.get('field')}``` |"
                    msg += f" {_err.get('message')}  | \n"
                msg += "----\n"
            else:
                error_list = '\n'.join(str(err.res) for err in exc.errors)
                msg = f'Errors in {pid} - CADI ' + \
                      f'id: {cap_record_cadi_id or "?"}' + \
                      f' - {cap_host}/{cap_record_pid} :\n{error_list}'

            click.secho(msg, fg='red')

            if export:
                total_errors.append(msg)

    # export the errors in a file
    if export:
        with open(export, 'w') as out:
            out.writelines('\n\n'.join(err for err in total_errors))
        click.secho(f'Errors saved at {export}.', fg='red')


@fixtures.command()
@click.option('--dir', '-d',
              type=click.Path(exists=True),
              help='The directory of the schemas to be added to the db.')
@click.option('--url', '-u',
              help='The url of the schema to be added to the db.')
@click.option('--force', '-f',
              is_flag=True,
              help='Force add the schema without validation.')
@click.option('--force-version', '-fv',
              is_flag=True,
              help='Force disable version checking.')
@click.option('--replace', '-r',
              is_flag=True,
              help='It this schema/version exists, update it.')
@with_appcontext
def schemas(dir, url, force, force_version, replace):
    """
    Add schemas to CAP, either by downloading them from a url, or by adding
    them from a path. if no args are provided, then the schemas from the
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
            click.secho(f'Please provide a public url to a json file. '
                        f'Error {resp.status_code}.', fg='red')
            return

        try:
            data = resp.json()
            if not has_all_required_fields(data) and not force:
                click.secho(f'Missing required fields. Make sure that all of: '
                            f'{DEPOSIT_REQUIRED_FIELDS} are in the json.', fg='red')  # noqa
                return
            add_schema_from_json(data,
                                 replace=replace,
                                 force_version=force_version)
        except (json.JSONDecodeError, ValueError):
            click.secho('Error in decoding the returned json.', fg='red')

    # by default, just add the fixtures from the default path
    if not dir and not url:
        add_fixtures_from_path(
            current_app.config.get('SCHEMAS_DEFAULT_PATH'),
            replace=replace,
            force_version=True)


def add_fixtures_from_path(dir, replace=None, force_version=None):
    """Add fixtures from a specified path to CAP."""
    for root, dirs, files in os.walk(dir):
        json_filepaths = [
            os.path.join(root, f) for f in files
            if f.endswith(".json")
        ]

        for filepath in json_filepaths:
            with open(filepath, 'r') as f:
                try:
                    json_content = json.load(f)
                    add_schema_from_json(json_content,
                                         replace=replace,
                                         force_version=force_version)
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
                    if is_later_version(_schema.version,
                                        version) and not force_version:
                        click.secho(
                            f'A later version ({_schema.version}) of '
                            f'{name} is already in the db. Error while '
                            f'adding {name}-{version}', fg='red')
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
    except IntegrityError:
        click.secho(f'An db error occurred while adding {name}.', fg='red')


def has_all_required_fields(data):
    """Check if there are any missing required fields in a json schema."""
    deposit_as_record = data.get('use_deposit_as_record')
    schemas_to_check = [data['deposit_schema']] \
        if deposit_as_record \
        else [data['deposit_schema'], data['record_schema']]

    for _schema in schemas_to_check:
        schema_fields = _schema.get('properties', {}).keys()

        # if there are no properties, we do not check
        if schema_fields:
            for req_field in DEPOSIT_REQUIRED_FIELDS:
                if req_field not in schema_fields:
                    return False
    return True
