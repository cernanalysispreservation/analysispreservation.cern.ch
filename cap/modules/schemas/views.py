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
from sqlalchemy.orm.attributes import flag_modified

from cap.modules.access.permissions import admin_permission_factory
from cap.modules.access.utils import login_required

from .helpers import ValidationError
from .imp import get_schemas_for_user
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
    get_default_mapping,
    get_schema,
    schema_admin_permission,
)

blueprint = Blueprint(
    'cap_schemas',
    __name__,
    url_prefix='/jsonschemas',
)

super_admin_permission = admin_permission_factory(None)


def process_config_operations(request, config_key, schema):
    serialized_config = schema.config_serialize().get('config', {})
    if request.method == 'GET':
        return serialized_config.get(config_key, {})

    if request.method == 'DELETE':
        key_config_schema = {'config': {config_key: {}}}
        schema.update(**key_config_schema)
        db.session.commit()
        return 'Deleted.', 204

    try:
        data = request.get_json()
        key_config = serialized_config.get(config_key, {})
        if request.method == "POST":
            post_obejct = {'config': {config_key: data}}
            schema.update(**post_obejct)
            flag_modified(schema, 'config')
        if request.method == 'PATCH':
            patched_key_config = apply_patch(key_config, data)
            patched_object = {'config': {config_key: patched_key_config}}
            schema.update(**patched_object)
        db.session.commit()
        return jsonify(schema.config_serialize()), 201
    except AttributeError:
            return jsonify({'message': 'Error occured due to invalid JSON.'}), 400
    except ValidationError as err:
        return (
            jsonify({'message': err.description, 'errors': err.errors}),
            400,
        )
    except (
            JsonPatchException,
            JsonPatchConflict,
            JsonPointerException,
            TypeError,
        ) as err:
            return (
                jsonify(
                    {
                        'message': 'Could not apply '
                        'json-patch to object: {}'.format(err)
                    }
                ),
                400,
            )


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


@blueprint.route(
    '/<string:name>/permissions', methods=['GET', 'POST', 'DELETE']
)
@blueprint.route(
    '/<string:name>/<string:version>/permissions',
    methods=['GET', 'POST', 'DELETE'],
)
# @login_required
@super_admin_permission.require(http_exception=403)
def permissions(name=None, version=None):
    """Get all versions of a schema that user has access to."""
    if name:
        try:
            if version:
                schema = Schema.get(name, version)
            else:
                schema = Schema.get_latest(name)
        except JSONSchemaNotFound:
            abort(404)

    if not AdminSchemaPermission(schema).can():
        abort(403)

    if request.method == "GET":
        schema_permissions = schema.get_schema_permissions()
        return jsonify(schema_permissions)
    elif request.method == "POST":
        data = request.json
        schema.modify_record_permissions(data)
        return jsonify({}), 201
    elif request.method == "DELETE":
        return jsonify({}), 204


@blueprint.route(
    '/<string:name>/notifications',
    methods=['GET', 'PATCH', 'DELETE', 'POST']
)
@blueprint.route(
    '/<string:name>/<string:version>/notifications',
    methods=['GET', 'PATCH', 'DELETE', 'POST'],
)
@get_schema
@schema_admin_permission
@super_admin_permission.require(http_exception=403)
def notifications_config(name=None, version=None, schema=None, *args, **kwargs):
    """CRUD operations for schema notification configuration."""
    config_key = 'notifications'
    return process_config_operations(request, config_key, schema)


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

    @super_admin_permission.require(http_exception=403)
    def post(self):
        """Create new schema."""
        data = request.get_json()

        serialized_data, errors = create_config_payload.load(data)

        if errors:
            raise abort(400, errors)

        if not serialized_data.get('deposit_mapping', {}):
            serialized_data['deposit_mapping'] = get_default_mapping(
                serialized_data.get('name'), serialized_data.get('version')
            )
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

    @super_admin_permission.require(http_exception=403)
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

    @super_admin_permission.require(http_exception=403)
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

    @super_admin_permission.require(http_exception=403)
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
