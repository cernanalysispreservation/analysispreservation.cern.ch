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

"""Handlers for customizing oauthclient endpoints."""

from __future__ import absolute_import, print_function

from functools import partial, wraps

import six
from flask import current_app, redirect, render_template, request, \
    session, url_for
from flask_login import current_user
from invenio_db import db
from werkzeug.utils import import_string

from invenio_oauthclient.errors import AlreadyLinkedError, OAuthClientError, \
    OAuthError, OAuthRejectedRequestError, OAuthResponseError
from invenio_oauthclient.models import RemoteAccount, RemoteToken
from invenio_oauthclient.proxies import current_oauthclient
from invenio_oauthclient.signals import account_info_received, \
    account_setup_committed, account_setup_received
from invenio_oauthclient.utils import create_csrf_disabled_registrationform, \
    create_registrationform, fill_form, oauth_authenticate, oauth_get_user, \
    oauth_register
from invenio_oauthclient.views.client import blueprint as bp


#
# Token handling
#
def get_session_next_url(remote_app):
    """Return redirect url stored in session.

    :param remote_app: The remote application.
    :returns: The redirect URL.
    """
    return session.get(
        '%s_%s' % (token_session_key(remote_app), 'next_url')
    )


def set_session_next_url(remote_app, url):
    """Store redirect url in session for security reasons.

    :param remote_app: The remote application.
    :param url: the redirect URL.
    """
    session['%s_%s' % (token_session_key(remote_app), 'next_url')] = \
        url


def token_session_key(remote_app):
    """Generate a session key used to store the token for a remote app.

    :param remote_app: The remote application.
    :returns: The session key.
    """
    return '%s_%s' % (current_app.config['OAUTHCLIENT_SESSION_KEY_PREFIX'],
                      remote_app)


def response_token_setter(remote, resp):
    """Extract token from response and set it for the user.

    :param remote: The remote application.
    :param resp: The response.
    :raises invenio_oauthclient.errors.OAuthClientError: If authorization with
        remote service failed.
    :raises invenio_oauthclient.errors.OAuthResponseError: In case of bad
        authorized request.
    :returns: The token.
    """
    if resp is None:
        raise OAuthRejectedRequestError('User rejected request.', remote, resp)
    else:
        if 'access_token' in resp:
            return oauth2_token_setter(remote, resp)
        elif 'oauth_token' in resp and 'oauth_token_secret' in resp:
            return oauth1_token_setter(remote, resp)
        elif 'error' in resp:
            # Only OAuth2 specifies how to send error messages
            raise OAuthClientError(
                'Authorization with remote service failed.', remote, resp,
            )
    raise OAuthResponseError('Bad OAuth authorized request', remote, resp)


def oauth1_token_setter(remote, resp, token_type='', extra_data=None):
    """Set an OAuth1 token.

    :param remote: The remote application.
    :param resp: The response.
    :param token_type: The token type. (Default: ``''``)
    :param extra_data: Extra information. (Default: ``None``)
    :returns: A :class:`invenio_oauthclient.models.RemoteToken` instance.
    """
    return token_setter(
        remote,
        resp['oauth_token'],
        secret=resp['oauth_token_secret'],
        extra_data=extra_data,
        token_type=token_type,
    )


def oauth2_token_setter(remote, resp, token_type='', extra_data=None):
    """Set an OAuth2 token.

    The refresh_token can be used to obtain a new access_token after
    the old one is expired. It is saved in the database for long term use.
    A refresh_token will be present only if `access_type=offline` is included
    in the authorization code request.

    :param remote: The remote application.
    :param resp: The response.
    :param token_type: The token type. (Default: ``''``)
    :param extra_data: Extra information. (Default: ``None``)
    :returns: A :class:`invenio_oauthclient.models.RemoteToken` instance.
    """
    return token_setter(
        remote,
        resp['access_token'],
        secret='',
        token_type=token_type,
        extra_data=extra_data,
    )


def token_setter(remote, token, secret='', token_type='', extra_data=None,
                 user=None):
    """Set token for user.

    :param remote: The remote application.
    :param token: The token to set.
    :param token_type: The token type. (Default: ``''``)
    :param extra_data: Extra information. (Default: ``None``)
    :param user: The user owner of the remote token. If it's not defined,
        the current user is used automatically. (Default: ``None``)
    :returns: A :class:`invenio_oauthclient.models.RemoteToken` instance or
        ``None``.
    """
    session[token_session_key(remote.name)] = (token, secret)
    user = user or current_user

    # Save token if user is not anonymous (user exists but can be not active at
    # this moment)
    if not user.is_anonymous:
        uid = user.id
        cid = remote.consumer_key

        # Check for already existing token
        t = RemoteToken.get(uid, cid, token_type=token_type)

        if t:
            t.update_token(token, secret)
        else:
            t = RemoteToken.create(
                uid, cid, token, secret,
                token_type=token_type, extra_data=extra_data
            )
        return t
    return None


def token_getter(remote, token=''):
    """Retrieve OAuth access token.

    Used by flask-oauthlib to get the access token when making requests.

    :param remote: The remote application.
    :param token: Type of token to get. Data passed from ``oauth.request()`` to
        identify which token to retrieve. (Default: ``''``)
    :returns: The token.
    """
    session_key = token_session_key(remote.name)

    if session_key not in session and current_user.is_authenticated:
        # Fetch key from token store if user is authenticated, and the key
        # isn't already cached in the session.
        remote_token = RemoteToken.get(
            current_user.get_id(),
            remote.consumer_key,
            token_type=token,
        )

        if remote_token is None:
            return None

        # Store token and secret in session
        session[session_key] = remote_token.token()

    return session.get(session_key, None)


def token_delete(remote, token=''):
    """Remove OAuth access tokens from session.

    :param remote: The remote application.
    :param token: Type of token to get. Data passed from ``oauth.request()`` to
        identify which token to retrieve. (Default: ``''``)
    :returns: The token.
    """
    session_key = token_session_key(remote.name)
    return session.pop(session_key, None)


#
# Error handling decorators
#
def oauth_error_handler(f):
    """Handle exceptions."""
    @wraps(f)
    def inner(*args, **kwargs):
        # OAuthErrors should not happen, so they are not caught here. Hence
        # they will result in a 500 Internal Server Error which is what we
        # are interested in.
        try:
            return f(*args, **kwargs)
        except OAuthClientError as e:
            current_app.logger.warning(e.message, exc_info=True)
            return render_template(
                current_app.config[
                    'AUTHENTICATION_POPUP__NO_REDIRECT_TEMPLATE'],
                msg='Authorization with remote service failed.'
            ), 400
        except OAuthResponseError as e:
            return render_template(
                current_app.config[
                    'AUTHENTICATION_POPUP__NO_REDIRECT_TEMPLATE'],
                msg=e.message or 'Authorization with remote service failed.'
            ), 400
        except OAuthRejectedRequestError:
            return render_template(
                current_app.config[
                    'AUTHENTICATION_POPUP__NO_REDIRECT_TEMPLATE'],
                msg='You rejected the authentication request.'
            ), 400
        except AlreadyLinkedError:
            return render_template(
                current_app.config[
                    'AUTHENTICATION_POPUP__NO_REDIRECT_TEMPLATE'],
                msg='External service is already linked to another account.'
            ), 400
    return inner


#
# Handlers
#
@oauth_error_handler
def authorized_default_handler(resp, remote, *args, **kwargs):
    """Store access token in session.

    Default authorized handler.

    :param remote: The remote application.
    :param resp: The response.
    :returns: Redirect response.
    """
    response_token_setter(remote, resp)
    db.session.commit()
    return redirect(url_for('invenio_oauthclient_settings.index'))


@oauth_error_handler
def authorized_signup_handler(resp, remote, *args, **kwargs):
    """Handle sign-in/up functionality.

    :param remote: The remote application.
    :param resp: The response.
    :returns: Redirect response.
    """
    # Remove any previously stored auto register session key
    session.pop(token_session_key(remote.name) + '_autoregister', None)

    # Store token in session
    # ----------------------
    # Set token in session - token object only returned if
    # current_user.is_autenticated().
    token = response_token_setter(remote, resp)
    handlers = current_oauthclient.signup_handlers[remote.name]

    # Sign-in/up user
    # ---------------
    if not current_user.is_authenticated:
        account_info = handlers['info'](resp)
        account_info_received.send(
            remote, token=token, response=resp, account_info=account_info
        )

        user = oauth_get_user(
            remote.consumer_key,
            account_info=account_info,
            access_token=token_getter(remote)[0],
        )

        if user is None:
            # Auto sign-up if user not found
            form = create_csrf_disabled_registrationform()
            form = fill_form(
                form,
                account_info['user']
            )
            user = oauth_register(form)

            # if registration fails ...
            if user is None:
                # requires extra information
                session[
                    token_session_key(remote.name) + '_autoregister'] = True
                session[token_session_key(remote.name) +
                        '_account_info'] = account_info
                session[token_session_key(remote.name) +
                        '_response'] = resp
                db.session.commit()
                return render_template(
                    current_app.config['AUTHENTICATION_POPUP_TEMPLATE'],
                    msg='Registration to the service failed.'
                ), 400

        # Authenticate user
        if not oauth_authenticate(remote.consumer_key, user,
                                  require_existing_link=False):
            return render_template(
                current_app.config[
                    'AUTHENTICATION_POPUP__NO_REDIRECT_TEMPLATE'],
                msg='Error: Unauthorized user.'
            ), 401

        # Link account
        # ------------
        # Need to store token in database instead of only the session when
        # called first time.
        token = response_token_setter(remote, resp)

    # Setup account
    # -------------
    if not token.remote_account.extra_data:
        account_setup = handlers['setup'](token, resp)
        account_setup_received.send(
            remote, token=token, response=resp, account_setup=account_setup
        )
        db.session.commit()
        account_setup_committed.send(remote, token=token)
    else:
        db.session.commit()

    return render_template(
        current_app.config['AUTHENTICATION_POPUP_TEMPLATE'],
        msg='Account linked successfully.'
    ), 200


def disconnect_handler(remote, *args, **kwargs):
    """Handle unlinking of remote account.

    This default handler will just delete the remote account link. You may
    wish to extend this module to perform clean-up in the remote service
    before removing the link (e.g. removing install webhooks).

    :param remote: The remote application.
    :returns: Redirect response.
    """
    if not current_user.is_authenticated:
        return current_app.login_manager.unauthorized()

    with db.session.begin_nested():
        account = RemoteAccount.get(
            user_id=current_user.get_id(),
            client_id=remote.consumer_key
        )
        if account:
            account.delete()

    db.session.commit()
    return redirect('/')


def signup_handler(remote, *args, **kwargs):
    """Handle extra signup information.

    :param remote: The remote application.
    :returns: Redirect response or the template rendered.
    """
    # User already authenticated so move on
    if current_user.is_authenticated:
        return redirect('/')

    # Retrieve token from session
    oauth_token = token_getter(remote)
    if not oauth_token:
        return redirect('/')

    session_prefix = token_session_key(remote.name)

    # Test to see if this is coming from on authorized request
    if not session.get(session_prefix + '_autoregister', False):
        return redirect(url_for('.login', remote_app=remote.name))

    form = create_registrationform(request.form)

    if form.validate_on_submit():
        account_info = session.get(session_prefix + '_account_info')
        response = session.get(session_prefix + '_response')

        # Register user
        user = oauth_register(form)

        if user is None:
            raise OAuthError('Could not create user.', remote)

        # Remove session key
        session.pop(session_prefix + '_autoregister', None)

        # Link account and set session data
        token = token_setter(remote, oauth_token[0], secret=oauth_token[1],
                             user=user)
        handlers = current_oauthclient.signup_handlers[remote.name]

        if token is None:
            raise OAuthError('Could not create token for user.', remote)

        if not token.remote_account.extra_data:
            account_setup = handlers['setup'](token, response)
            account_setup_received.send(
                remote, token=token, response=response,
                account_setup=account_setup
            )
            # Registration has been finished
            db.session.commit()
            account_setup_committed.send(remote, token=token)
        else:
            # Registration has been finished
            db.session.commit()

        # Authenticate the user
        if not oauth_authenticate(remote.consumer_key, user,
                                  require_existing_link=False,
                                  remember=current_app.config[
                                      'OAUTHCLIENT_REMOTE_APPS']
                                  [remote.name].get('remember', False)):
            # Redirect the user after registration (which doesn't include the
            # activation), waiting for user to confirm his email.
            return redirect('/')

        # Remove account info from session
        session.pop(session_prefix + '_account_info', None)
        session.pop(session_prefix + '_response', None)

        # Redirect to next
        next_url = get_session_next_url(remote.name)
        if next_url:
            return redirect(next_url)
        else:
            return redirect('/')

    # Pre-fill form
    account_info = session.get(session_prefix + '_account_info')
    if not form.is_submitted():
        form = fill_form(form, account_info['user'])

    return render_template(
        current_app.config['OAUTHCLIENT_SIGNUP_TEMPLATE'],
        form=form,
        remote=remote,
        app_title=current_app.config['OAUTHCLIENT_REMOTE_APPS'][
            remote.name].get('title', ''),
        app_description=current_app.config['OAUTHCLIENT_REMOTE_APPS'][
            remote.name].get('description', ''),
        app_icon=current_app.config['OAUTHCLIENT_REMOTE_APPS'][
            remote.name].get('icon', None),
    )

#
# Helpers
#


def make_handler(f, remote, with_response=True):
    """Make a handler for authorized and disconnect callbacks.

    :param f: Callable or an import path to a callable
    """
    if isinstance(f, six.string_types):
        f = import_string(f)

    @wraps(f)
    def inner(*args, **kwargs):
        if with_response:
            return f(args[0], remote, *args[1:], **kwargs)
        else:
            return f(remote, *args, **kwargs)
    return inner


def make_token_getter(remote):
    """Make a token getter for a remote application."""
    return partial(token_getter, remote)


@bp.app_errorhandler(404)
def handle_404(err):
    return render_template(
        current_app.config['AUTHENTICATION_POPUP__NO_REDIRECT_TEMPLATE'],
        msg='Something went wrong: Error 404'
    ), 404


@bp.app_errorhandler(403)
def handle_403(err):
    return render_template(
        current_app.config['AUTHENTICATION_POPUP__NO_REDIRECT_TEMPLATE'],
        msg='Something went wrong: Error 403'
    ), 403


@bp.app_errorhandler(500)
def handle_500(err):
    return render_template(
        current_app.config['AUTHENTICATION_POPUP__NO_REDIRECT_TEMPLATE'],
        msg='Something went wrong: Error 500'
    ), 500
