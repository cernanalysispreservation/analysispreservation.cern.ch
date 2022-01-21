# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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


"""CAP Indico service views."""

import requests
from flask import jsonify

from . import blueprint
from ..serializers.indico import IndicoEventSchema
from cap.modules.access.utils import login_required
from cap.modules.experiments.errors import ExternalAPIException

INDICO_URL = 'https://indico.cern.ch/export/event/{}.json?tz=Europe/Zurich'


def _indico(event_id):
    """Get Indico event by id."""
    url = INDICO_URL.format(event_id)
    resp = requests.get(url)
    return resp.json(), resp.status_code


@blueprint.route('/indico/<event_id>')
@login_required
def get_indico_event(event_id):
    """Get Indico event by id and serialize the response."""
    try:
        resp, status = _indico(event_id)
        serialized = IndicoEventSchema().dump(resp['results'][0]).data
        return jsonify(serialized), status
    except IndexError:
        return jsonify([]), 200
    except ExternalAPIException:
        raise
