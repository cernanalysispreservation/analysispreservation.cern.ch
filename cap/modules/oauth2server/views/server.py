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

"""CERN Analysis Preservation Framework OAuth 2.0 Provider."""

from __future__ import absolute_import, print_function

from functools import wraps

from flask import Blueprint, _request_ctx_stack, abort, \
    current_app, jsonify, redirect, render_template, request
from flask_babelex import lazy_gettext as _
from flask_login import login_required
from flask_principal import Identity, identity_changed
from oauthlib.oauth2.rfc6749.errors import InvalidClientError, OAuth2Error

from invenio_oauth2server.models import Client
from invenio_oauth2server.provider import oauth2
from invenio_oauth2server.proxies import current_oauth2server


blueprint = Blueprint(
    'invenio_oauth2server_server',
    __name__,
    url_prefix='/oauth',
)


@oauth2.after_request
def login_oauth2_user(valid, oauth):
    """Log in a user after having been verified."""
    if valid:
        _request_ctx_stack.top.user = oauth.user
        identity_changed.send(current_app._get_current_object(),
                              identity=Identity(oauth.user.id))

    return valid, oauth


def error_handler(f):
    """Handle uncaught OAuth errors."""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except OAuth2Error as e:
            # Only FatalClientError are handled by Flask-OAuthlib (as these
            # errors should not be redirect back to the client - see
            # http://tools.ietf.org/html/rfc6749#section-4.2.2.1)
            if hasattr(e, 'redirect_uri'):
                return redirect(e.in_uri(e.redirect_uri))
            else:
                return redirect(e.in_uri(oauth2.error_uri))
    return decorated


#
# Views
#
# # # TO FIX
#
# @blueprint.route('/authorize', methods=['GET', 'POST'])
# @login_required
# @error_handler
# @oauth2.authorize_handler
# def authorize(*args, **kwargs):
#     """View for rendering authorization request."""
#     if request.method == 'GET':
#         client = Client.query.filter_by(
#             client_id=kwargs.get('client_id')
#         ).first()

#         if not client:
#             abort(404)

#         scopes = current_oauth2server.scopes
#         ctx = dict(
#             client=client,
#             oauth_request=kwargs.get('request'),
#             scopes=[scopes[x] for x in kwargs.get('scopes', [])],
#         )
#         return render_template('invenio_oauth2server/authorize.html', **ctx)

#     confirm = request.form.get('confirm', 'no')
#     return confirm == 'yes'


@blueprint.route('/token', methods=['POST', ])
@oauth2.token_handler
def access_token():
    """Token view handles exchange/refresh access tokens."""
    client = Client.query.filter_by(
        client_id=request.form.get('client_id')
    ).first()

    if not client:
        abort(404)

    if not client.is_confidential and \
            'client_credentials' == request.form.get('grant_type'):
        error = InvalidClientError()
        response = jsonify(dict(error.twotuples))
        return jsonify(response), error.status_code

    # Return None or a dictionary. Dictionary will be merged with token
    # returned to the client requesting the access token.
    # Response is in application/json
    return None


@blueprint.route('/errors')
def errors():
    """Error view in case of invalid oauth requests."""
    from oauthlib.oauth2.rfc6749.errors import raise_from_error
    try:
        error = None
        raise_from_error(request.values.get('error'), params=dict())
    except OAuth2Error as raised:
        error = raised
    return jsonify({"error": error.error}), 400


@blueprint.route('/ping', methods=['GET', 'POST'])
@oauth2.require_oauth()
def ping():
    """Test to verify that you have been authenticated."""
    return jsonify(dict(ping="pong"))


@blueprint.route('/info')
@oauth2.require_oauth('test:scope')
def info():
    """Test to verify that you have been authenticated."""
    if current_app.testing or current_app.debug:
        return jsonify(dict(
            user=request.oauth.user.id,
            client=request.oauth.client.client_id,
            scopes=list(request.oauth.scopes)
        ))
    else:
        abort(404)


@blueprint.route('/invalid')
@oauth2.require_oauth('invalid_scope')
def invalid():
    """Test to verify that you have been authenticated."""
    if current_app.testing or current_app.debug:
        # Not reachable
        return jsonify(dict(ding="dong"))
    else:
        abort(404)
