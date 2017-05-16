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

"""Pre-configured remote application for enabling sign in/up with CERN.

**Usage:**

1. Edit your configuration and add:

   .. code-block:: python

       import copy

       from invenio_oauthclient.contrib import cern

       CERN_REMOTE_APP = copy.deepcopy(cern.REMOTE_APP)
       CERN_REMOTE_APP["params"].update(dict(request_token_params={
           "resource": "changeme.cern.ch",  # replace with your server
           "scope": "Name Email Bio Groups",
       }))

       OAUTHCLIENT_REMOTE_APPS = dict(
           cern=CERN_REMOTE_APP,
       )

       CERN_APP_CREDENTIALS = dict(
           consumer_key="changeme",
           consumer_secret="changeme",
       )

  Note, if you want to use the CERN sandbox, use ``cern.REMOTE_SANDBOX_APP``
  instead of ``cern.REMOTE_APP``.

2. Register a new application with CERN. When registering the
   application ensure that the *Redirect URI* points to:
   ``http://localhost:5000/oauth/authorized/cern/`` (note, CERN does not
   allow localhost to be used, thus testing on development machines is
   somewhat complicated by this).


3. Grab the *Client ID* and *Client Secret* after registering the application
   and add them to your instance configuration (``invenio.cfg``):

   .. code-block:: python

       CERN_APP_CREDENTIALS = dict(
           consumer_key="<CLIENT ID>",
           consumer_secret="<CLIENT SECRET>",
       )

4. Now login using CERN OAuth:
   http://localhost:5000/oauth/login/cern/.

5. Also, you should see CERN listed under Linked accounts:
   http://localhost:5000/account/settings/linkedaccounts/

By default the CERN module will try first look if a link already exists
between a CERN account and a user. If no link is found, the user is asked
to provide an email address to sign-up.

In templates you can add a sign in/up link:

.. code-block:: jinja

    <a href="{{ url_for("invenio_oauthclient.login", remote_app="cern") }}">
      Sign in with CERN
    </a>
"""

from flask import current_app, g, redirect, session
from flask_login import current_user
from flask_principal import AnonymousIdentity, identity_changed, \
    identity_loaded
from invenio_db import db

from invenio_oauthclient.models import RemoteAccount
from invenio_oauthclient.utils import oauth_link_external_id

from invenio_oauthclient.contrib.cern import (
    OAUTHCLIENT_CERN_REFRESH_TIMEDELTA, OAUTHCLIENT_CERN_SESSION_KEY,

    find_remote_by_client_id, account_groups,
    extend_identity, get_resource
)


def account_info(remote, resp):
    """Retrieve remote account information used to find local user."""
    resource = get_resource(remote)

    email = resource['EmailAddress'][0]
    external_id = resource['uidNumber'][0]
    nice = resource['CommonName'][0]
    name = resource['DisplayName'][0]

    return dict(
        user=dict(
            email=email.lower(),
            profile=dict(username=nice, full_name=name),
        ),
        external_id=external_id, external_method='cern',
        active=True
    )


def disconnect_handler(remote, *args, **kwargs):
    """Handle unlinking of remote account."""
    if not current_user.is_authenticated:
        return current_app.login_manager.unauthorized()

    # account = RemoteAccount.get(user_id=current_user.get_id(),
    #                             client_id=remote.consumer_key)
    # external_id = account.extra_data.get('external_id')

    # if external_id:
    #     oauth_unlink_external_id(dict(id=external_id, method='cern'))
    # if account:
    #     with db.session.begin_nested():
    #         account.delete()

    # disconnect_identity(g.identity)

    # TOFIX Should we have a disconnect handler??
    return redirect('/')


def account_setup(remote, token, resp):
    """Perform additional setup after user have been logged in."""
    resource = get_resource(remote)

    with db.session.begin_nested():
        external_id = resource['uidNumber'][0]

        # Set CERN person ID in extra_data.
        token.remote_account.extra_data = {
            'external_id': external_id,
        }
        groups = account_groups(token.remote_account, resource)
        assert not isinstance(g.identity, AnonymousIdentity)
        extend_identity(g.identity, groups)

        user = token.remote_account.user

        # Create user <-> external id link.
        oauth_link_external_id(user, dict(id=external_id, method='cern'))


@identity_changed.connect
def on_identity_changed(sender, identity):
    """Store groups in session whenever identity changes.

    :param identity: The user identity where information are stored.
    """
    if isinstance(identity, AnonymousIdentity):
        return

    client_id = current_app.config['CERN_APP_CREDENTIALS']['consumer_key']
    account = RemoteAccount.get(
        user_id=current_user.get_id(),
        client_id=client_id,
    )
    groups = []
    if account:
        groups = account.extra_data.get('groups', [])
        remote = find_remote_by_client_id(client_id)
        resource = get_resource(remote)
        refresh = current_app.config.get(
            'OAUTHCLIENT_CERN_REFRESH_TIMEDELTA',
            OAUTHCLIENT_CERN_REFRESH_TIMEDELTA
        )

        # if 'resource' exists, update groups with new ones received
        # else keep old ones from 'extra_data'
        if resource:
            oauth_groups = account_groups(
                account, resource, refresh_timedelta=refresh)

            groups = groups + list(set(oauth_groups) - set(groups))

    extend_identity(identity, groups)


@identity_loaded.connect
def on_identity_loaded(sender, identity):
    """Store groups in session whenever identity is loaded."""
    identity.provides.update(session.get(OAUTHCLIENT_CERN_SESSION_KEY, []))
