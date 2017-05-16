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

from flask import (current_app, flash, redirect,
                   render_template, request, session, url_for)
from flask_babelex import gettext as _
from flask_login import current_user
from invenio_db import db
from werkzeug.utils import import_string

from invenio_oauthclient.errors import (AlreadyLinkedError, OAuthClientError,
                                        OAuthError, OAuthRejectedRequestError)
from invenio_oauthclient.models import RemoteAccount
from invenio_oauthclient.proxies import current_oauthclient
from invenio_oauthclient.signals import (account_info_received,
                                         account_setup_committed,
                                         account_setup_received)
from invenio_oauthclient.utils import (disable_csrf, fill_form,
                                       oauth_authenticate, oauth_get_user,
                                       oauth_register, registrationform_cls)


from invenio_oauthclient.handlers import (
    get_session_next_url, response_token_setter,
    token_session_key, token_setter, token_getter, token_delete)

#
# Error handling decorators
#


def oauth_error_handler(f):
    """Decorator to handle exceptions."""
    @wraps(f)
    def inner(*args, **kwargs):
        # OAuthErrors should not happen, so they are not caught here. Hence
        # they will result in a 500 Internal Server Error which is what we
        # are interested in.
        try:
            return f(*args, **kwargs)
        except OAuthClientError as e:
            current_app.logger.warning(e.message, exc_info=True)
            return oauth2_handle_error(
                e.remote, e.response, e.code, e.uri, e.description
            )
        except OAuthRejectedRequestError:
            # TOFIX
            flash(_('You rejected the authentication request.'),
                  category='info')
            return redirect('/')
        except AlreadyLinkedError:
            # TOFIX
            flash(_('External service is already linked to another account.'),
                  category='danger')
            return redirect('/')
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
    return redirect('/')


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
            form_cls = registrationform_cls()
            form = fill_form(
                disable_csrf(form_cls()),
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
                return redirect('/')

        # Authenticate user
        if not oauth_authenticate(remote.consumer_key, user,
                                  require_existing_link=False,
                                  remember=current_app.config[
                                      'OAUTHCLIENT_REMOTE_APPS']
                                  [remote.name].get('remember', False)):
            return current_app.login_manager.unauthorized()

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

    # Redirect to next
    next_url = get_session_next_url(remote.name)
    if next_url:
        return redirect(next_url)
    return redirect('/')


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

    form = registrationform_cls()(request.form)

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


def oauth_logout_handler(sender_app, user=None):
    """Remove all access tokens from session on logout."""
    oauth = current_app.extensions['oauthlib.client']
    for remote in oauth.remote_apps.values():
        token_delete(remote)
    db.session.commit()


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


def oauth2_handle_error(remote, resp, error_code, error_uri,
                        error_description):
    """Handle errors during exchange of one-time code for an access tokens."""
    flash(_('Authorization with remote service failed.'))
    return redirect('/')
