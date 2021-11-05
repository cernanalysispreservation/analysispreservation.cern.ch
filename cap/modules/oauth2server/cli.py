# * coding: utf8 *
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2021 CERN.
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
"""Oauth2server Cli."""


import sys
import json

import click
from flask import current_app
from flask_cli import with_appcontext
from invenio_db import db
from invenio_accounts.models import User
from invenio_oauth2server.models import Token


@click.group()
def oauth2server():
    """oauth2server commands."""
    pass


@oauth2server.command('token-generator')
@click.option('--token-name', '-n',
              'token_names',
              required=True,
              multiple=True,
              help='name of the token')
@click.option('--user', '-u',
              'user_emails',
              required=True,
              multiple=True,
              help='email of the registered user')
@with_appcontext
def token_generator(token_names, user_emails):
    """
    Return method to generate write token for users and save in a file.
    Usage:
        cap oauth2server token-generator -u <user_email> -n <token_name>
    """
    token_file_path = current_app.config.get('TESTS_E2E_TOKEN_FILE')
    if not len(token_names) == len(user_emails):
        click.secho('Provide the same number of arguments.', fg='red')
        sys.exit(1)
    user_info = zip(token_names, user_emails)

    def _save_token(tokens):
        """Return method to save generated tokens in a file."""
        try:
            with open(token_file_path, 'w', encoding='utf-8') as f:
                f.write(json.dumps(tokens))
            click.secho(
                'Token/s saved succesfully in {}'.format(token_file_path),
                fg='green')
            return
        except Exception as e:
            click.secho('{}'.format(e), fg='red')
            sys.exit(1)

    tokens = {}
    for user in user_info:
        token_name, user_email = user
        tokens[user_email] = _get_or_create_token(token_name, user_email)
    return _save_token(tokens)


def _get_or_create_token(token_name, user_email):
        """Return method to fetch or create a user write token."""
        try:
            user = User.query.filter_by(email=user_email).one()
        except Exception as e:
            print("Error: {}".format(e))

        token_ = Token.query.filter_by(user_id=user.id).first()
        if not token_:
            token_ = Token.create_personal(
                token_name,
                user.id,
                scopes=['deposit:write']
            )
            db.session.add(token_)
        db.session.commit()
        return token_.access_token
