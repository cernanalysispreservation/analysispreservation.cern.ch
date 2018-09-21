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

"""Overriding remote application methods for CERN OAuth contrib."""

from flask import current_app, g, redirect, session

from flask_login import current_user
from flask_principal import (AnonymousIdentity, identity_changed,
                             identity_loaded)
from invenio_access import superuser_access
from invenio_db import db
from invenio_oauthclient.contrib.cern import (OAUTHCLIENT_CERN_REFRESH_TIMEDELTA,
                                              OAUTHCLIENT_CERN_SESSION_KEY,
                                              account_groups, extend_identity,
                                              find_remote_by_client_id,
                                              get_resource)
from invenio_oauthclient.models import RemoteAccount
from invenio_oauthclient.utils import oauth_link_external_id


def disconnect_handler(remote, *args, **kwargs):
    """Handle unlinking of remote account."""
    if not current_user.is_authenticated:
        return current_app.login_manager.unauthorized()

    # TOFIX Should we have a disconnect handler??
    return redirect('/')
