# -*- coding: utf-8 -*-
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
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.
"""Utils for Schemas module."""

from invenio_access.models import ActionRoles, ActionUsers
from invenio_db import db


def _allow_role(action, arg, id):
    """Allow action for schema processor."""
    db.session.add(ActionRoles.allow(action, argument=arg, role_id=id))
    delete_access_cache()


def _deny_role(action, arg, id):
    """Deny action for schema processor."""
    db.session.add(ActionRoles.deny(action, argument=arg, role_id=id))
    delete_access_cache()


def _remove_role(action, arg, id):
    """Remove action for schema processor."""
    ActionRoles.query_by_action(action, argument=arg).filter(
        ActionRoles.role_id == id
    ).delete(synchronize_session=False)
    delete_access_cache()


def _allow_user(action, arg, id):
    """Allow action for schema processor."""
    db.session.add(ActionUsers.allow(action, argument=arg, user_id=id))
    delete_access_cache()


def _deny_user(action, arg, id):
    """Deny action for schema processor."""
    db.session.add(ActionUsers.deny(action, argument=arg, user_id=id))
    delete_access_cache()


def _remove_user(action, arg, id):
    """Remove action for schema processor."""
    ActionUsers.query_by_action(action, argument=arg).filter(
        ActionUsers.user_id == id
    ).delete(synchronize_session=False)
    delete_access_cache()


def delete_access_cache():
    from cap.modules.schemas.imp import delete_schema_access_cache

    delete_schema_access_cache()
