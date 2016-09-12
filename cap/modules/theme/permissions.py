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

from invenio_access.models import ActionRoles, ActionUsers
from invenio_access.permissions import DynamicPermission
from invenio_records.permissions import RecordReadActionNeed


def read_permission_factory(record):
    """Factory for creating read permissions for records."""
    permission = DynamicPermission(RecordReadActionNeed(str(record.id)))

    old_can = permission.can

    def new_can():
        is_public = ActionUsers.query.filter(
            ActionUsers.action == 'records-read',
            ActionUsers.argument == str(record.id),
            ActionUsers.user_id.is_(None)).first()

        if is_public or old_can():
            return True
        else:
            return False

    permission.can = new_can

    return permission
