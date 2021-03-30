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
from invenio_db import db
from invenio_jsonschemas.errors import JSONSchemaNotFound
from jsonpatch import (
    JsonPatchConflict,
    JsonPatchException,
    JsonPointerException,
    apply_patch,
)
from jsonref import JsonRefError
from sqlalchemy.exc import IntegrityError

from cap.modules.access.permissions import admin_permission_factory
from cap.modules.access.utils import login_required

from .helpers import ValidationError
from .models import Schema
from .permissions import AdminSchemaPermission, ReadSchemaPermission
from .serializers import (
    create_config_payload,
    link_serializer,
    update_payload_schema_serializer,
)
from .utils import (
    check_allowed_patch_operation,
    check_allowed_patch_path,
    get_schemas_for_user,
)

blueprint = Blueprint(
    'cap_schemas',
    __name__,
    url_prefix='/jsonschemas',
)

_admin_permission = admin_permission_factory(None)


@blueprint.route('/<string:name>/versions', methods=['GET'])
@login_required
def get_all_versions(name=None):
    """Get all versions of a schema that user has access to."""
    if name:
        try:
            schemas = Schema.get_all_versions(name)
            latest = schemas[0]
        except (JSONSchemaNotFound, IndexError):
            abort(404)
        response = {
            'versions': link_serializer.dump(schemas, many=True).data,
            'latest': link_serializer.dump(latest).data,
        }
    return jsonify(response)


class SchemaAPI(MethodView):
    """CRUD views for Schema model."""

    decorators = [login_required]

    def get(self, name=None, version=None):
        """Get all schemas that user has access to."""
        resolve = request.args.get('resolve', False)
        latest = request.args.get('latest', False)
        config = request.args.get('config', False)

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

            if config and AdminSchemaPermission(schema).can():
                try:
                    response = schema.config_serialize()
                except JsonRefError:
                    abort(404)
            else:
                try:
                    response = schema.serialize(resolve=resolve)
                except JsonRefError:
                    abort(404)

        else:
            schemas = get_schemas_for_user(latest=latest)
            response = [schema.serialize(resolve=resolve) for schema in schemas]

        return jsonify(response)

    @_admin_permission.require(http_exception=403)
    def post(self):
        """Create new schema."""
        data = request.get_json()

        serialized_data, errors = create_config_payload.load(data)

        if errors:
            raise abort(400, errors)

        try:
            with db.session.begin_nested():
                with db.session.begin_nested():
                    schema = Schema(**serialized_data)
                    db.session.add(schema)

                schema.give_admin_access_for_user(current_user)
            db.session.commit()

        except IntegrityError:
            raise abort(400, 'Error occured during saving schema in the db.')
        except ValidationError as err:
            return (
                jsonify({"message": err.description, "errors": err.errors}),
                400,
            )

        return jsonify(schema.config_serialize())

    @_admin_permission.require(http_exception=403)
    def put(self, name, version):
        """Update schema."""
        try:
            schema = Schema.get(name, version)
        except JSONSchemaNotFound:
            abort(404)

        with AdminSchemaPermission(schema).require(403):
            data = request.get_json()

            # self._validate_config(data)
            serialized_data, errors = update_payload_schema_serializer.load(
                data, partial=True
            )

            if errors:
                raise abort(400, errors)

            try:
                schema.update(**serialized_data)
                db.session.commit()
            except ValidationError as err:
                return (
                    jsonify({"message": err.description, "errors": err.errors}),
                    400,
                )

            return jsonify(schema.config_serialize())

    @_admin_permission.require(http_exception=403)
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

    @_admin_permission.require(http_exception=403)
    def patch(self, name, version):
        try:
            schema = Schema.get(name, version)
            serialized_schema = schema.patch_serialize()
        except JSONSchemaNotFound:
            return (
                jsonify(
                    {
                        'message': 'Schema not found. Please try '
                        'again with existing schemas.'
                    }
                ),
                404,
            )

        with AdminSchemaPermission(schema).require(403):
            data = request.get_json()
            data = check_allowed_patch_operation(data)
            if not data:
                return (
                    jsonify({'message': 'Invalid/No patch data provided.'}),
                    400,
                )

            try:
                check_allowed_patch_path(data)
                patched_schema = apply_patch(serialized_schema, data)
            except (
                JsonPatchException,
                JsonPatchConflict,
                JsonPointerException,
            ):
                return (
                    jsonify(
                        {
                            'message': 'An error occured while '
                            'applying the patch.'
                        }
                    ),
                    400,
                )

            serialized_data, errors = update_payload_schema_serializer.load(
                patched_schema, partial=True
            )
            if errors:
                return (
                    jsonify(
                        {
                            'message': 'An error {} occured while '
                            'serializing the patched schema.'.format(errors)
                        }
                    ),
                    400,
                )

            try:
                schema.update(**serialized_data)
                db.session.commit()
            except IntegrityError:
                return (
                    jsonify(
                        {
                            'message': 'Error occured during '
                            'saving schema in the db.'
                        }
                    ),
                    500,
                )
            except ValidationError as err:
                return (
                    jsonify({"message": err.description, "errors": err.errors}),
                    400,
                )

            return jsonify(schema.config_serialize())

    # TODO check if config validates with the model decorator
    # def _validate_config(self, data):
    #     config = data.get('config')
    #     if config:
    #         errors = validate_schema_config(config)
    #         if errors:
    #             raise abort(400, errors)


schema_view_func = SchemaAPI.as_view('schemas')

blueprint.add_url_rule(
    '/',
    view_func=schema_view_func,
    methods=[
        'GET',
    ],
)
blueprint.add_url_rule(
    '/',
    view_func=schema_view_func,
    methods=[
        'POST',
    ],
)
blueprint.add_url_rule(
    '/<string:name>',
    view_func=schema_view_func,
    methods=[
        'GET',
    ],
)
blueprint.add_url_rule(
    '/<string:name>/<string:version>',
    view_func=schema_view_func,
    methods=['GET', 'PUT', 'DELETE', 'PATCH'],
)
