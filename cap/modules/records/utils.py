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
"""Record module utils."""

import random
import string

from flask import url_for
from invenio_db import db
from invenio_indexer.api import RecordIndexer
from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_pidstore.models import PersistentIdentifier, PIDStatus
from invenio_records.models import RecordMetadata
from six.moves.urllib import parse
from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.sqlite import JSON


def generate_recid(experiment):
    """CAP Pid generator."""
    while True:
        pid_value = random_pid(experiment)
        try:
            PersistentIdentifier.get('recid', pid_value)
        except PIDDoesNotExistError:
            return pid_value


def random_pid(experiment):
    """Generate a random pid value for experiments."""
    def _generate_random_string(length):
        """Random string generator."""
        chars = string.lowercase + string.digits
        return ''.join((random.choice(chars)) for x in range(length))

    return 'CAP.{}.{}.{}'.format(experiment,
                                 _generate_random_string(4).upper(),
                                 _generate_random_string(4).upper())


def url_to_api_url(url):
    """Translate url to api url."""
    parts = parse.urlsplit(url)
    api_url = parse.urlunsplit(
        (parts.scheme, parts.netloc, '/api' + parts.path, parts.query,
         parts.fragment))
    return api_url


def api_url_for(endpoint, pid, **kwargs):
    """API URL builder."""
    url = url_for('.{0}'.format(endpoint),
                  pid_value=pid.pid_value,
                  _external=True,
                  **kwargs)

    return url_to_api_url(url)


def reindex_by_schema_url(schema_url, pid_type):
    """Reindex all records of given pid_type belonging to that schema."""
    def _get_json_type():
        """If postgres db return JSONB, else JSON."""
        return JSONB if db.session.bind.dialect.name == 'postgresql' else JSON

    indexer = RecordIndexer()

    ids = [
        x[0] for x in RecordMetadata.query.filter(
            RecordMetadata.json['$schema'] == cast(
                schema_url, _get_json_type())).values(RecordMetadata.id)
    ]

    if ids:
        filtered_by_pid_type = (
            x[0] for x in PersistentIdentifier.query.filter(
                PersistentIdentifier.object_type == 'rec', PersistentIdentifier
                .pid_type == pid_type, PersistentIdentifier.status ==
                PIDStatus.REGISTERED, PersistentIdentifier.object_uuid.in_(
                    ids)).values(PersistentIdentifier.object_uuid))

        print('{} records will be reindexed...'.format(schema_url))

        indexer.bulk_index(filtered_by_pid_type)
        indexer.process_bulk_queue()
