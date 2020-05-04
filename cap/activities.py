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
"""CAP utilities for registering activities with SQL-Continuum plugin."""
from flask import current_app
from invenio_db import db

# list of available activities -> message to show to user (for serializers)
ACTIVITIES = {
    'create deposit': None,
    'update permissions': None,
    'publish analysis': None,
    'reedit published analysis': None,
    'update analysis': None,
    'patch analysis': None,
}


def get_activity_model():
    """Return SQLAlchemy activities model if registered."""
    return getattr(current_app.extensions['invenio-db'].versioning_manager,
                   'activity_cls', None)


def register_activity(verb,
                      object=None,
                      object_id=None,
                      data=None,
                      target=None,
                      target_id=None):
    """Register activity if activities plugin on."""

    activity_model = get_activity_model()

    # check if activities plugin is there
    if not activity_model:
        return

    assert isinstance(object_id, int) if object_id else True
    assert isinstance(target_id, int) if target_id else True

    assert verb in ACTIVITIES.keys()

    with db.session.begin_nested():
        db.session.add(
            activity_model(verb=verb,
                           data=data,
                           object=object,
                           object_id=object_id,
                           target=target,
                           target_id=target_id))
