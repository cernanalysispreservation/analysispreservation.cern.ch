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

from flask import current_app, url_for
from six.moves.urllib import parse

from cap.modules.schemas.resolvers import resolve_schema_by_url

from invenio_pidstore.errors import PIDDoesNotExistError
from invenio_pidstore.models import PersistentIdentifier


def generate_recid(data):
    """CAP Pid generator."""
    while True:
        schema = resolve_schema_by_url(data.get('$schema'))
        if schema.config.get('auto_increment'):
            pid_value = data['_deposit']['id']
        else:
            experiment = data.get('_experiment')
            pid_value = random_pid(experiment)
        try:
            PersistentIdentifier.get('recid', pid_value)
        except PIDDoesNotExistError:
            return pid_value


def random_pid(experiment):
    """Generate a random pid value for experiments."""
    def _generate_random_string(length):
        """Random string generator."""
        chars = string.ascii_lowercase + string.digits
        return ''.join((random.choice(chars)) for x in range(length))

    return 'CAP.{}.{}.{}'.format(experiment,
                                 _generate_random_string(4).upper(),
                                 _generate_random_string(4).upper())


def url_to_api_url(url):
    """Translate url to api url."""
    if current_app.config.get('CAP_CLIENT_DEBUG'):
        return url

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


def clean_api_url_for(endpoint, pid, **kwargs):
    """API URL builder."""
    url = url_for('{0}'.format(endpoint),
                  pid_value=pid.pid_value,
                  _external=True,
                  **kwargs)

    return url_to_api_url(url)
