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


"""CERN Analysis Preservation Framework OAuth 2.0 Settings Blueprint."""

from __future__ import absolute_import

from functools import wraps

from flask import Blueprint, abort, jsonify, request
# from flask_babelex import lazy_gettext as _
from flask_login import current_user, login_required
from invenio_db import db

from invenio_oauth2server.models import Client, Token
from invenio_oauth2server.proxies import current_oauth2server

from marshmallow import Schema, ValidationError, fields, validate

blueprint = Blueprint(
    'cap_oauth2server_settings',
    __name__,
    url_prefix='/applications',
)


#
# Decorator
#
def client_getter():
    """Decorator to retrieve Client object and check user permission."""
    def wrapper(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if 'client_id' not in kwargs:
                abort(500)

            client = Client.query.filter_by(
                client_id=kwargs.pop('client_id'),
                user_id=current_user.get_id(),
            ).first()

            if client is None:
                abort(404)

            return f(client, *args, **kwargs)
        return decorated
    return wrapper


def token_getter(is_personal=True, is_internal=False):
    """Decorator to retrieve Token object and check user permission.

    :param is_personal: Search for a personal token. (Default: ``True``)
    :param is_internal: Search for a internal token. (Default: ``False``)
    """
    def wrapper(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if 'token_id' not in kwargs:
                abort(500)

            token = Token.query.filter_by(
                id=kwargs.pop('token_id'),
                user_id=current_user.get_id(),
                is_personal=is_personal,
                is_internal=is_internal,
            ).first()

            if token is None:
                abort(404)

            return f(token, *args, **kwargs)
        return decorated
    return wrapper


#
# Marshmallow Schemas
#
#

def validate_scope(scope):
    """Scope validation."""
    scopes_choices = current_oauth2server.scope_choices()
    sc = [s[0] for s in scopes_choices]
    if scope not in sc:
        raise ValidationError('Scope is not supported.')


class TokenSchema(Schema):
    """Schema class for Token."""

    name = fields.Str(required=True, validate=[validate.Length(min=1,)])
    scopes = fields.List(fields.Str(validate=validate_scope))


class ClientSchema(Schema):
    """Schema class for Client."""

    name = fields.Str(required=True, validate=[validate.Length(min=1,)])
    description = fields.Str(default='')
    website = fields.Url(required=True)
    redirect_uris = fields.List(fields.Url())
    is_confidential = fields.Str(required=True, default="True")

#
# Views
#


@blueprint.route("/", methods=['GET', 'POST'])
@login_required
def index():
    """List user tokens."""
    clients = Client.query.filter_by(
        user_id=current_user.get_id(),
        is_internal=False,
    ).all()

    tokens = Token.query.options(db.joinedload('client')).filter(
        Token.user_id == current_user.get_id(),
        Token.is_personal == True,  # noqa
        Token.is_internal == False,
        Client.is_internal == True,
    ).all()

    authorized_apps = Token.query.options(db.joinedload('client')).filter(
        Token.user_id == current_user.get_id(),
        Token.is_personal == False,  # noqa
        Token.is_internal == False,
        Client.is_internal == False,
    ).all()

    # scope_choices = [
    #     {
    #         "id": scope[1].id,
    #         "help_text": scope[1].help_text,
    #     } for scope in current_oauth2server.scope_choices()
    # ]

    _tokens = [
        {
            "name": t.client.name,
            "t_id": t.id,
            "scopes": t.scopes,
            "access_token": t.access_token
        } for t in tokens
    ]

    _clients = [
        {
            'client_id': c.client_id,
            'client_secret': c.client_secret,
            'client_type': c.client_type,
            'default_redirect_uri': c.default_redirect_uri,
            'default_scopes': c.default_scopes,
            'description': c.description,
            'is_confidential': c.is_confidential,
            'is_internal': c.is_internal,
            'name': c.name,
            'oauth2tokens': c.oauth2tokens,
            'redirect_uris': c.redirect_uris,
            'user_id': c.user_id,
            'website': c.website,
        }
        for c in clients
    ]

    response = {
        "clients": _clients,
        "tokens": _tokens,
        # "authorized_apps": authorized_apps,
        # "scope_choices": scope_choices,
    }

    return jsonify(response), 200


@blueprint.route("/clients/new/", methods=['POST', ])
@login_required
def client_new():
    """Create new client."""
    data, errors = ClientSchema().load(request.get_json())

    if errors:
        return jsonify({"errors": errors}), 400

    c = Client(user_id=current_user.get_id())
    c.gen_salt()
    c.name = data.get("name")
    c.description = data.get("description")
    c.website = data.get("website")
    c._redirect_uris = '\n'.join(data.get("redirect_uris"))
    c.is_confidential = data.get("is_confidential")
    db.session.add(c)
    db.session.commit()

    return jsonify(
        {
            'client_id': c.client_id,
            'client_secret': c.client_secret,
            'client_type': c.client_type,
            'default_redirect_uri': c.default_redirect_uri,
            'default_scopes': c.default_scopes,
            'description': c.description,
            'is_confidential': c.is_confidential,
            'is_internal': c.is_internal,
            'name': c.name,
            'oauth2tokens': c.oauth2tokens,
            'redirect_uris': c.redirect_uris,
            'user_id': c.user_id,
            'website': c.website,
        }), 200


@blueprint.route(
    "/clients/<string:client_id>/",
    methods=['GET', 'POST', 'DELETE']
)
@login_required
@client_getter()
def client_view(client):
    """Show client's detail."""
    if request.method == "DELETE":
        db.session.delete(client)
        db.session.commit()
        return jsonify({}), 200

    if request.method == "POST":
        data, errors = ClientSchema().load(request.get_json())

        if errors:
            return jsonify({"errors": errors}), 400

        client.name = data.get("name")
        client.description = data.get("description")
        client.website = data.get("website")
        client._redirect_uris = '\n'.join(data.get("redirect_uris"))
        client.is_confidential = data.get("is_confidential")
        # token.client.name = data.get("name")
        # token.scopes = data.get("scopes")
        db.session.commit()
        return jsonify({}), 200

    return jsonify(
        {
            'client_id': client.client_id,
            'client_secret': client.client_secret,
            'client_type': client.client_type,
            'default_redirect_uri': client.default_redirect_uri,
            'default_scopes': client.default_scopes,
            'description': client.description,
            'is_confidential': client.is_confidential,
            'is_internal': client.is_internal,
            'name': client.name,
            'oauth2tokens': client.oauth2tokens,
            'redirect_uris': client.redirect_uris,
            'user_id': client.user_id,
            'website': client.website,
        }), 200


@blueprint.route('/clients/<string:client_id>/reset/', methods=['POST'])
@login_required
@client_getter()
def client_reset(client):
    """Reset client's secret."""
    client.reset_client_secret()
    db.session.commit()

    return jsonify(
        {
            'client_id': client.client_id,
            'client_secret': client.client_secret,
            'client_type': client.client_type,
            'default_redirect_uri': client.default_redirect_uri,
            'default_scopes': client.default_scopes,
            'description': client.description,
            'is_confidential': client.is_confidential,
            'is_internal': client.is_internal,
            'name': client.name,
            'oauth2tokens': client.oauth2tokens,
            'redirect_uris': client.redirect_uris,
            'user_id': client.user_id,
            'website': client.website,
        }), 200


#
# Token views
#
@blueprint.route("/tokens/new/", methods=['POST', ])
@login_required
def token_new():
    """Create new token."""
    data, errors = TokenSchema().load(request.get_json())

    if errors:
        return jsonify({"errors": errors}), 400

    t = Token.create_personal(
        data.get("name"),
        current_user.get_id(),
        scopes=data.get("scopes")
    )
    db.session.commit()
    return jsonify(
        {
            "t_id": t.id,
            "name": t.client.name,
            "scopes": t.scopes,
            "access_token": t.access_token
        }), 200


@blueprint.route(
    "/tokens/<string:token_id>/",
    methods=['GET', 'POST', 'DELETE'])
@login_required
@token_getter()
def token_view(token):
    """Show token details."""
    if request.method == "DELETE":
        db.session.delete(token)
        db.session.commit()
        return jsonify({}), 200

    if request.method == "POST":
        data, errors = TokenSchema().load(request.get_json())

        if errors:
            return jsonify({"errors": errors}), 400

        token.client.name = data.get("name")
        token.scopes = data.get("scopes")
        db.session.commit()
        return jsonify({}), 200

    return jsonify(
        {
            "t_id": token.id,
            "name": token.client.name,
            "scopes": token.scopes
        }), 200


@blueprint.route("/tokens/<string:token_id>/revoke/", methods=['GET', ])
@login_required
@token_getter(is_personal=True, is_internal=False)
def token_revoke(token):
    """Revoke Authorized Application token."""
    db.session.delete(token)
    db.session.commit()

    return jsonify({}), 200
