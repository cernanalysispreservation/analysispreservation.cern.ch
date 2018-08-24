# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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


"""CAP Deposit utils."""

from __future__ import absolute_import, print_function

from flask import current_app

from cap.modules.schemas.models import Schema
from .errors import WrongJSONSchemaError


def clean_empty_values(data):
    """Removes empty values from model."""
    if not isinstance(data, (dict, list)):
        return data
    if isinstance(data, list):
        return [v for v in (clean_empty_values(v) for v in data) if v]
    return {k: v for k, v in (
        (k, clean_empty_values(v)) for k, v in data.items()) if v}


def discover_schema(deposit):
    """If schema url not passed directly, set it based on $ana_type field."""
    if '$schema' not in deposit:
        schemas = Schema.get_schemas()

        ana_type = deposit.get("$ana_type", None)

        if ana_type is None:
            raise WrongJSONSchemaError()

        schema = (s for s in schemas if ana_type in s)

        if schema:
            host = current_app.config.get('JSONSCHEMAS_HOST', None)
            protocol = current_app.config.get(
                'JSONSCHEMAS_URL_SCHEME', 'https')
            schema = "{protocol}://{host}/schemas/{schema}".format(
                host=host,
                schema=schema.next(),
                protocol=protocol)
    else:
        schema = deposit['$schema']

    return schema
