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
"""Deposit validators."""

import re

from flask import current_app
from jsonref import JsonRef
from jsonresolver import JSONResolver
from jsonresolver.contrib.jsonref import json_loader_factory
from jsonschema.exceptions import ValidationError

# from cap.modules.deposit.validators import DepositValidator
from jsonschema.validators import Draft7Validator

json_resolver = JSONResolver(plugins=['cap.modules.deposit.resolvers'])
loader_cls = json_loader_factory(json_resolver)
loader = loader_cls(cache_results=False)


SERVICE_URLS_MAPPING = {"cap_deposit": {"urlRegex": ""}}


def find_field_copy(validator, value, instance, schema, **kwargs):
    yield ValidationError("x-cap-copy")


# Validate for schema field permissions
def fetch_data_from_url(validator, value, instance, schema):
    # {
    #     "type": "object",
    #     "properties": {
    #         "url/$ref": {
    #             "type": "string",
    #             "pattern": "https://analysis.ce.ch/{/d}"
    #         },
    #         "display_data": { "type": "string"},
    #         "data": {
    #             "type": "object"
    #         }
    #     }
    # }

    instance_url = instance.get("url")
    instance_data = instance.get("data")

    if instance_url is None:
        return ValidationError("Not a valid URL to fetch")

    # if "data" already part of the instance, DO NOT fetch
    if instance_data:
        #  maybe validate this data against the schema
        return

    # 1. Fetch data from URL
    data = {'$ref': instance_url}
    try:
        fetched_data = JsonRef.replace_refs(data, loader=loader)
        fetched_data = fetched_data.copy()
    except Exception:
        return ValidationError(
            "Either response is not in JSON format OR it failed"
        )

    # 2. Serialize `fetched_data` to desired format
    response_data_path = value.get('response_data_path')
    if response_data_path:
        fetched_data = parse_fetched_data(fetched_data)

    # 3. Validate serialized-fetched data. Pass to instance if valid
    if value.get("schema_url"):
        schema_to_validate = {"$ref": value.get("schema_url")}
    else:
        schema_to_validate = value.get('schema', {"type": "object"})

    validate_errors = validate_data(schema_to_validate, fetched_data)

    if any(validate_errors):
        yield ValidationError(
            "Data are not valid against the required JSON schema"
        )

    # 4. If all correct assign final fetched data into instance "data"
    instance["data"] = fetched_data


def is_valid_url(url_pattern, url):
    return re.match(url_pattern, url) is not None


def parse_fetched_data(data):
    return data


def validate_data(schema, data):
    if not isinstance(schema, dict):
        schema = {"$ref": schema}

    resolver = current_app.extensions[
        "invenio-records"
    ].ref_resolver_cls.from_schema(schema)
    validator = Draft7Validator(schema, resolver=resolver)

    errors = validator.iter_errors(data)

    return errors
