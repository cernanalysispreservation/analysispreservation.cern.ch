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
"""Extra records views."""

from __future__ import absolute_import, print_function

from flask import Blueprint, g
from invenio_files_rest.views import bucket_view, object_view
from sqlalchemy.orm.exc import NoResultFound

from .api import CAPRecord


def create_cap_record_blueprint(app):
    """Create blueprint from a Flask application.
    :params app: A Flask application.
    :returns: Configured blueprint.
    """
    cap_records_bp = Blueprint('cap_records_files', __name__, url_prefix='')

    record_item_path = app.config['RECORDS_REST_ENDPOINTS']['recid'][
        'item_route']
    cap_records_bp.add_url_rule('{}/files'.format(record_item_path),
                                view_func=bucket_view)
    cap_records_bp.add_url_rule('{}/files/<path:key>'.format(record_item_path),
                                view_func=object_view)

    @cap_records_bp.url_value_preprocessor
    def resolve_pid_to_bucket_id(endpoint, values):
        """Flask URL preprocessor to resolve pid to Bucket ID.
        In the ``cap_records_bp`` we are gluing together Records-REST
        and Files-REST APIs. Records-REST knows about PIDs but Files-REST does
        not, this function will pre-process the URL so the PID is removed from
        the URL and resolved to bucket ID which is injected into Files-REST
        view calls:
        ``/api/<record_type>/<pid_value>/files/<key>`` ->
        ``/files/<bucket>/<key>``.
        """
        # Remove the 'pid_value' in order to match the Files-REST bucket view
        # signature. Store the value in Flask global request object for later
        # usage.
        g.pid = values.pop('pid_value')
        pid, _ = g.pid.data

        try:
            record = CAPRecord.get_record(pid.object_uuid)
            values['bucket_id'] = str(record.files.bucket)
        except (AttributeError, NoResultFound):
            # Hack, to make invenio_files_rest.views.as_uuid throw a
            # ValueError instead of a TypeError if we set the value to None.
            values['bucket_id'] = ''

    @cap_records_bp.url_defaults
    def restore_pid_to_url(endpoint, values):
        """Put ``pid_value`` back to the URL after matching Files-REST views.
        Since we are computing the URL more than one times, we need the
        original values of the request to be unchanged so that it can be
        reproduced.
        """
        # Value here has been saved in above method (resolve_pid_to_bucket_id)
        values['pid_value'] = g.pid

    return cap_records_bp
