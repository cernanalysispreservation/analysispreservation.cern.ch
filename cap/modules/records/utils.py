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

from invenio_pidstore.models import PersistentIdentifier
from invenio_pidstore.errors import PIDDoesNotExistError


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

    return 'CAP.{}.{}.{}'.format(
        experiment,
        _generate_random_string(4).upper(),
        _generate_random_string(4).upper())
