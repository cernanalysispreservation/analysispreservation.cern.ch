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
"""Views for schemas."""

from flask import Blueprint, abort, jsonify, request
from flask.views import MethodView
from flask_login import current_user
from jsonref import JsonRefError
from sqlalchemy.exc import IntegrityError

from cap.modules.access.utils import login_required
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound

from .models.schemas import Schema
from .permissions import AdminSchemaPermission, ReadSchemaPermission
from .serializers import schema_serializer, update_schema_serializer
from .utils import _filter_only_latest, _filter_by_read_access

blueprint = Blueprint(
    'cap_schemas',
    __name__,
    url_prefix='/jsonschemas',
)


class SchemaAPI(MethodView):
    """CRUD views for Schema model."""

    decorators = [login_required]

    def get(self, name=None, version=None):
        """Get all schemas that user has access to."""
        resolve = request.args.get('resolve', False)
        latest = request.args.get('latest', False)
        if name:
            try:
                if version:
                    schema = Schema.get(name, version)
                else:
                    schema = Schema.get_latest(name)
            except JSONSchemaNotFound:
                abort(404)

            if not ReadSchemaPermission(schema).can():
                abort(403)

            try:
                response = schema.serialize(resolve=resolve)
            except JsonRefError:
                abort(404)

        else:
            # get schemas for user
            schemas = Schema.query.order_by(
                Schema.name,
                Schema.major.desc(), Schema.minor.desc(), Schema.patch.desc()
            ).all()

            schemas = _filter_by_read_access(schemas)
            schemas = _filter_only_latest(schemas) if latest else schemas

            response = [
                schema.serialize(resolve=resolve) for schema in schemas
            ]

        return jsonify(response)

    def post(self):
        """Create new schema."""
        data = request.get_json()

        serialized_data, errors = schema_serializer.load(data)

        if errors:
            raise abort(400, errors)

        try:
            with db.session.begin_nested():
                with db.session.begin_nested():
                    schema = Schema(**serialized_data)
                    db.session.add(schema)

                schema.give_admin_access_for_user(current_user)

        except IntegrityError:
            raise abort(400, 'Error occured during saving schema in the db.')

        return jsonify(schema.serialize())

    def put(self, name, version):
        """Update schema."""
        try:
            schema = Schema.get(name, version)
        except JSONSchemaNotFound:
            abort(404)

        with AdminSchemaPermission(schema).require(403):
            data = request.get_json()
            serialized_data, errors = update_schema_serializer.load(
                data, partial=True)

            if errors:
                raise abort(400, errors)

            schema.update(**serialized_data)
            db.session.commit()

            return jsonify(schema.serialize())

    def delete(self, name, version):
        """Delete schema."""
        try:
            schema = Schema.get(name, version)
        except JSONSchemaNotFound:
            abort(404)

        with AdminSchemaPermission(schema).require(403):
            db.session.delete(schema)
            db.session.commit()

            return 'Schema deleted.', 204


schema_view_func = SchemaAPI.as_view('schemas')

blueprint.add_url_rule('/', view_func=schema_view_func, methods=[
    'GET',
])
blueprint.add_url_rule('/', view_func=schema_view_func, methods=[
    'POST',
])
blueprint.add_url_rule('/<string:name>',
                       view_func=schema_view_func,
                       methods=[
                           'GET',
                       ])
blueprint.add_url_rule('/<string:name>/<string:version>',
                       view_func=schema_view_func,
                       methods=['GET', 'PUT', 'DELETE'])
