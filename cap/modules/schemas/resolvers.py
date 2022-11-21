# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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
"""Resolver for JSON Schemas."""

from __future__ import absolute_import, print_function

import re

import jsonresolver
from cachetools.func import lru_cache
from flask import current_app
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound
from invenio_jsonschemas.proxies import current_jsonschemas
from sqlalchemy.orm.exc import NoResultFound

from .models import Schema


@jsonresolver.route('/schemas/<path:path>',
                    host='analysispreservation.cern.ch')
def resolve(path):
    """Resolve CAP JSON schemas."""
    return resolve_by_path(path)


def resolve_by_path(path):
    """Resolve CAP JSON schemas."""
    try:
        options, _, type_, name, major, minor, patch = parse_path(path)
        schema = Schema.query \
            .filter_by(name=name,
                       major=major,
                       minor=minor,
                       patch=patch)\
            .one()
    except (NoResultFound, AttributeError, TypeError):
        raise JSONSchemaNotFound(schema=path)

    if type_ == current_app.config['SCHEMAS_DEPOSIT_PREFIX']:
        jsonschema = schema.deposit_options if options \
            else schema.deposit_schema
    else:
        jsonschema = schema.record_options if options \
            else schema.record_schema

    return jsonschema


def parse_path(string):
    """Parse schema path.

    Returns None if not a valid path

    :param string: schema path
    :type string: str

    :return: tuple of
    (is_options_schema, deposit|record, name, major, minor, patch)
    :rtype: tuple or None
    """
    pattern = re.compile(
        """
        (?P<options>{})?/?                      # check if options schema
        (?P<index_prefix>{})?/?                 # check if index prefix
        (?P<schema_type>{}|{})/?                # check if deposit/record
        (?P<name>\S+)                           # name of the schema
        -v(?P<major>\d+).                       # version
        (?P<minor>\d+).                         # version
        (?P<patch>\d+)                          # version
        """.format(re.escape(current_app.config['SCHEMAS_OPTIONS_PREFIX']),
                   re.escape(current_app.config['CAP_SEARCH_INDEX_PREFIX'][:-1]),
                   re.escape(current_app.config['SCHEMAS_RECORD_PREFIX']),
                   re.escape(current_app.config['SCHEMAS_DEPOSIT_PREFIX'])),
        re.VERBOSE)

    match = re.match(pattern, string)

    return match.groups() if match else None


def schema_name_to_url(schema_name, version=None):
    """Return url eg. https://host.com/schemas/schema-v0.0.1.json."""
    schema = resolve_schema_by_name_and_version(schema_name, version)
    url = current_jsonschemas.path_to_url(schema.deposit_path)
    return url


def resolve_schema_by_name_and_version(schema_name, version=None):
    """Get Schema object for given name and (optionally) version."""
    return Schema.get(schema_name, version) if version \
        else Schema.get_latest(schema_name)


@lru_cache(maxsize=1024)
def resolve_schema_by_url(url):
    """Get Schema object for given url."""
    path = current_jsonschemas.url_to_path(url)

    try:
        _, _, _, name, major, minor, patch = parse_path(path)
        schema = Schema.query \
            .filter_by(name=name,
                       major=major,
                       minor=minor,
                       patch=patch)\
            .one()
    except (NoResultFound, AttributeError, TypeError):
        raise JSONSchemaNotFound(schema=url)

    db.session.expunge(schema)

    return schema
