# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

"""Blueprint for Records."""

from __future__ import absolute_import, print_function

import json
import os
from functools import partial
from uuid import uuid4

from flask import (Blueprint, Response, abort, current_app, jsonify,
                   render_template, request, url_for)
from flask.ext.login import current_user, login_required
from flask_security import login_required
from invenio_access.models import ActionRoles, ActionUsers
from invenio_access.permissions import (DynamicPermission,
                                        ParameterizedActionNeed)
from invenio_accounts.models import User
from invenio_collections.models import Collection
from invenio_db import db
from invenio_indexer.utils import RecordIndexer
from invenio_pidstore.providers.recordid import RecordIdProvider
from invenio_pidstore.resolver import Resolver
from invenio_records import Record
from invenio_records.models import RecordMetadata
from invenio_records.permissions import (RecordReadActionNeed,
                                         RecordUpdateActionNeed,
                                         read_permission_factory,
                                         update_permission_factory)
from invenio_records_ui.views import record_view
from invenio_search import Query, current_search_client
from jsonpatch import JsonPatchException, JsonPointerException
from jsonref import JsonRef
from jsonresolver import JSONResolver

blueprint = Blueprint(
    'records',
    __name__,
    template_folder='templates',
    url_prefix='/records',
    static_folder='static'
)


RecordIndexActionNeed = partial(ParameterizedActionNeed, 'records-index')
"""Action need for indexing a record."""

records_index_all = RecordReadActionNeed(None)
"""Read all records action need."""


@blueprint.app_template_filter('can_edit')
def can_edit_accessright(record):
    """Test if access right is valid."""

    r = RecordMetadata()
    setattr(r, 'id', record)
    permission_edit_record = update_permission_factory(r)
    if permission_edit_record.can():
        return True

    return False


@blueprint.app_template_filter('is_public')
def is_record_public(record):
    """Test if access right is valid."""
    r = RecordMetadata()
    setattr(r, 'id', record)

    is_public = ActionUsers.query.filter(
        ActionUsers.action == 'records-read',
        ActionUsers.argument == str(r.id),
        ActionUsers.user_id.is_(None)).first()
    if is_public:
        return True
    else:
        return False


def get_indexable_records_by_user(user_id, roles):
    # Getting private indexable records by user_id
    u_private = []
    if user_id:
        u_private = ActionUsers.query.filter(
            ActionUsers.action == 'records-index',
            ActionUsers.user_id == user_id).with_entities(ActionUsers.argument).all()

    # Getting public indexable records
    public = ActionUsers.query.filter(
        ActionUsers.action == 'records-index',
        ActionUsers.user_id.is_(None)).with_entities(ActionUsers.argument).all()

    # Getting private indexable records by user_roles
    r_private = ActionRoles.query.filter(
        ActionRoles.action == 'records-index',
        ActionRoles.role_id in roles).with_entities(ActionRoles.argument).all()
    r_list = u_private+r_private+list(set(public)-set(u_private))
    return zip(*r_list)[0] if r_list else []


def get_readable_records_by_user(user_id, roles):
    # Getting private readable records by user_id
    u_private = []
    if user_id:
        u_private = ActionUsers.query.filter(
            ActionUsers.action == 'records-read',
            ActionUsers.user_id == user_id).with_entities(ActionUsers.argument).all()

    # Getting public readable records
    public = ActionUsers.query.filter(
        ActionUsers.action == 'records-read',
        ActionUsers.user_id.is_(None)).with_entities(ActionUsers.argument).all()

    # Getting private readable records by user_roles
    r_private = ActionRoles.query.filter(
        ActionRoles.action == 'records-read',
        ActionRoles.role_id in roles).with_entities(ActionRoles.argument).all()
    r_list = u_private+r_private+list(set(public)-set(u_private))
    return zip(*r_list)[0] if r_list else []


@blueprint.route('/')
def recordsAll():
    """Basic test view."""

    # List of indexable records
    indexable_records = get_indexable_records_by_user(
            current_user.id if current_user.is_authenticated else None,
            current_user.roles)

    return jsonify(records=[(r.json, r.id)for r in
                            RecordMetadata
                            .query
                            .filter(RecordMetadata
                                    .id.in_(indexable_records)).all()])


@blueprint.route('/<path:collection>/create')
@login_required
def create_record_view(collection):
    return render_template('records/create.html', collection=collection)


@blueprint.route('/<path:collection>/create', methods=['POST'])
@login_required
def create_record(collection):
    """Basic test view."""

    # Creating a uuid4
    recid = uuid4()

    # Creating a PID for the record
    provider = RecordIdProvider.create(object_type='rec', object_uuid=recid)
    pid = provider.pid.pid_value

    data = json.loads(request.get_data())

    data['$schema'] = current_app.config.get(
            'JSONSCHEMAS_HOST') + url_for(
            "records.jsonschema", collection=collection)
    data['pid_value'] = pid
    data['control_number'] = pid
    data['collections'] = [collection]

    record = Record.create(data, id_=recid)

    # Invenio-Indexer is delegating the document inferring to
    # Invenio-Search which is analysing the string splitting by `/` and
    # using `.json` to be sure that it cans understand the mapping.
    record['$schema'] = 'mappings/{0}.json'.format(collection.lower())

    indexer = RecordIndexer()
    indexer.index(record)

    # Creating permission needs for the record
    action_edit_record = RecordUpdateActionNeed(str(recid))
    action_read_record = RecordReadActionNeed(str(recid))
    action_index_record = RecordIndexActionNeed(str(recid))

    # Giving index, read, write permissions to user/creator
    db.session.add(ActionUsers.allow(action_edit_record, user=current_user))
    db.session.add(ActionUsers.allow(action_read_record, user=current_user))
    db.session.add(ActionUsers.allow(action_index_record, user=current_user))

    db.session.commit()

    return '200'


def get_collections_tree(collections):
    result = []

    for current_collection in collections:
        result.append({
            'name': current_collection['node'].name,
            'children': get_collections_tree(
                    current_collection['children'])
                    if 'children' in current_collection else []
        })
    return result


def get_collections_queries(collections):
    """Return an array with all the dbqueries in collections."""
    result = []
    for current_collection in collections:
        if current_collection['node'].dbquery:
            result.append(current_collection['node'].dbquery)
        elif 'children' in current_collection:
            result += get_collections_queries(current_collection['children'])
        else:
            result += ['collections:' + current_collection['node'].name]
    return result


@blueprint.route('/collection/<string:collection>')
def collection_records(collection=None):
    collections = Collection.query.filter(
            Collection.name.in_([collection])).one().drilldown_tree()
    query_array = get_collections_queries(collections)
    query_string = ' or '.join(query_array)
    query = Query(query_string)
    response = current_search_client.search(
        body=query.body,
    )

    recs = response.get('hits', []).get('hits', [])

    records = {
        'records': recs
    }

    return jsonify(**records)


@blueprint.route('/<pid_value>/edit')
@login_required
def edit_record(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    try:
        pid, record = resolver.resolve(pid_value)
    except:
        abort(404)

    permission_edit_record = update_permission_factory(record)
    if permission_edit_record.can():
        return record_view(pid_value, resolver,
                           'records/edit.html')

    abort(403)


@blueprint.route('/<pid_value>', methods=["GET", "POST"], defaults={})
@login_required
def recid(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    try:
        pid, record = resolver.resolve(pid_value)
    except:
        abort(404)

    is_public = ActionUsers.query.filter(
        ActionUsers.action == 'records-read',
        ActionUsers.user_id.is_(None)).first()

    permission_edit_record = update_permission_factory(record)
    permission_read_record = read_permission_factory(record)

    if is_public or permission_read_record.can():
        return record_view(pid_value,
                           resolver,
                           'records/detail.html')

    abort(403)


@blueprint.route('/<pid_value>/update', methods=['POST'])
def update_record(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    try:
        pid, record = resolver.resolve(pid_value)
    except:
        abort(404)

    permission_edit_record = update_permission_factory(record)
    if not permission_edit_record.can():
        abort(404)

    try:
        record = record.patch(request.get_data())
    except (JsonPatchException, JsonPointerException):
        abort(400)

    record.commit()
    db.session.commit()
    return '200'


@blueprint.route('/<pid_value>/permissions', methods=['GET', 'POST'])
def record_permissions(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    pid, record = resolver.resolve(pid_value)

    permissions = get_record_permissions(record.id)

    result = dict()
    result['permissions'] = []
    for p in permissions:
        if p.user:
            result['permissions'].append(
                to_dict(
                    p,
                    show=[
                        'action',
                        'user',
                        'access_actionsusers.user.email']
                )
            )

    return jsonify(**result)


def get_record_permissions(recid=None):
    if not recid:
        return False

    action_edit_record = RecordUpdateActionNeed(str(recid))
    action_read_record = RecordReadActionNeed(str(recid))
    action_index_record = RecordIndexActionNeed(str(recid))

    permissions = dict()
    permissions['u_edit'] = ActionUsers.query_by_action(action_edit_record).all()
    permissions['u_read'] = ActionUsers.query_by_action(action_read_record).all()
    permissions['u_index'] = ActionUsers.query_by_action(action_index_record).all()

    permissions['r_edit'] = ActionRoles.query_by_action(action_edit_record).all()
    permissions['r_read'] = ActionRoles.query_by_action(action_read_record).all()
    permissions['r_index'] = ActionRoles.query_by_action(action_index_record).all()

    result = permissions['u_edit'] + permissions['u_read'] + permissions['u_index'] + \
        permissions['r_edit']+permissions['r_read']+permissions['r_index']

    return result


@blueprint.route('/<pid_value>/permissions/privacy/change', methods=['POST'])
def change_record_privacy(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    pid, record = resolver.resolve(pid_value)

    permission_update_record = update_permission_factory(record)
    if not permission_update_record.can():
        abort(403)

    db.session.begin(nested=True)
    index_instance = ActionUsers.query.filter(
        ActionUsers.action == "records-index",
        ActionUsers.argument == str(record.id),
        ActionUsers.user_id.is_(None)).first()

    read_instance = ActionUsers.query.filter(
        ActionUsers.action == "records-read",
        ActionUsers.argument == str(record.id),
        ActionUsers.user_id.is_(None)).first()

    if index_instance:
        db.session.delete(index_instance)
        db.session.delete(read_instance)
    else:
        action_read_record = RecordReadActionNeed(str(record.id))
        action_index_record = RecordIndexActionNeed(str(record.id))
        db.session.add(ActionUsers.allow(action_read_record))
        db.session.add(ActionUsers.allow(action_index_record))
    db.session.commit()

    return '200'


@blueprint.route('/<pid_value>/permissions/update', methods=['POST'])
def update_record_permissions(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    pid, record = resolver.resolve(pid_value)

    users = User.query.filter(User.email.in_(request.get_json())).all()

    action_edit_record = RecordUpdateActionNeed(str(record.id))
    action_read_record = RecordReadActionNeed(str(record.id))
    action_index_record = RecordIndexActionNeed(str(record.id))

    db.session.begin(nested=True)
    for user in users:
        for action in request.get_json().get(user.email, None):
            if (action.get("action", None) == "records-read" and action.get("op", None) == "add"):
                db.session.add(ActionUsers.allow(action_read_record, user=user))
            elif (action.get("action", None) == "records-index" and action.get("op", None) == "add"):
                db.session.add(ActionUsers.allow(action_index_record, user=user))
            elif (action.get("action", None) == "records-update" and action.get("op", None) == "add"):
                db.session.add(ActionUsers.allow(action_edit_record, user=user))
            elif (action.get("action", None) == "records-read" and action.get("op", None) == "remove"):
                au = ActionUsers.query.filter(ActionUsers.action == "records-read", ActionUsers.argument == str(record.id), ActionUsers.user_id == user.id).first()
                if (au):
                    db.session.delete(au)
            elif (action.get("action", None) == "records-index" and action.get("op", None) == "remove"):
                au = ActionUsers.query.filter(ActionUsers.action == "records-index", ActionUsers.argument == str(record.id), ActionUsers.user_id == user.id).first()
                if (au):
                    db.session.delete(au)
            elif (action.get("action", None) == "records-update" and action.get("op", None) == "remove"):
                au = ActionUsers.query.filter(ActionUsers.action == "records-update", ActionUsers.argument == str(record.id), ActionUsers.user_id == user.id).first()
                if (au):
                    db.session.delete(au)
    db.session.commit()

    return '200'


def delete_record_edit_permissions(recid=None, user=None):
    action_edit_record = RecordUpdateActionNeed(str(recid))
    db.session.delete(ActionUsers.allow(action_edit_record, user=user))


def delete_record_read_permissions(recid=None, user=None):
    action_read_record = RecordReadActionNeed(str(recid))
    db.session.delete(ActionUsers.allow(action_read_record, user=user))


def delete_record_index_permissions(recid=None, user=None):
    action_index_record = RecordIndexActionNeed(str(recid))
    db.session.delete(ActionUsers.allow(action_index_record, user=user))


def add_record_edit_permissions(recid=None, user=None):
    action_edit_record = RecordUpdateActionNeed(str(recid))
    db.session.add(ActionUsers.allow(action_edit_record, user=user))


def add_record_read_permissions(recid=None, user=None):
    action_read_record = RecordReadActionNeed(str(recid))
    db.session.add(ActionUsers.allow(action_read_record, user=user))


def add_record_index_permissions(recid=None, user=None):
    action_index_record = RecordIndexActionNeed(str(recid))
    db.session.add(ActionUsers.allow(action_index_record, user=user))


def to_dict(self, show=None, hide=None, path=None, show_all=None):
    """ Return a dictionary representation of this model."""

    if not show:
        show = []
    if not hide:
        hide = []
    hidden = []
    if hasattr(self, 'hidden_fields'):
        hidden = self.hidden_fields
    default = []
    if hasattr(self, 'default_fields'):
        default = self.default_fields

    ret_data = {}

    if not path:
        path = self.__tablename__.lower()

        def prepend_path(item):
            item = item.lower()
            if item.split('.', 1)[0] == path:
                return item
            if len(item) == 0:
                return item
            if item[0] != '.':
                item = '.%s' % item
            item = '%s%s' % (path, item)
            return item
        show[:] = [prepend_path(x) for x in show]
        hide[:] = [prepend_path(x) for x in hide]

    columns = self.__table__.columns.keys()
    relationships = self.__mapper__.relationships.keys()
    properties = dir(self)

    for key in columns:
        check = '%s.%s' % (path, key)
        if check in hide or key in hidden:
            continue
        if show_all or key is 'id' or check in show or key in default:
            ret_data[key] = getattr(self, key)

    for key in relationships:
        check = '%s.%s' % (path, key)
        if check in hide or key in hidden:
            continue
        if show_all or check in show or key in default:
            hide.append(check)
            is_list = self.__mapper__.relationships[key].uselist
            if is_list:
                ret_data[key] = []
                for item in getattr(self, key):
                    ret_data[key].append(to_dict(
                        item,
                        show=show,
                        hide=hide,
                        path=('%s.%s' % (path, key.lower())),
                        show_all=show_all,
                    ))
            else:
                if self.__mapper__.relationships[key].query_class is not None:
                    ret_data[key] = to_dict(
                        getattr(self, key),
                        show=show,
                        hide=hide,
                        path=('%s.%s' % (path, key.lower())),
                        show_all=show_all,
                    )
                else:
                    ret_data[key] = getattr(self, key)

    for key in list(set(properties) - set(columns) - set(relationships)):
        if key.startswith('_'):
            continue
        check = '%s.%s' % (path, key)
        if check in hide or key in hidden:
            continue
        if show_all or check in show or key in default:
            val = getattr(self, key)
            try:
                ret_data[key] = json.loads(json.dumps(val))
            except:
                pass

    return ret_data


def stream_file(uri):
    with open(uri, 'rb') as f:
        while True:
            chunk = f.read(1024)
            if chunk:
                yield chunk
            else:
                return


@blueprint.route('/jsonschemas/<collection>/')
def jsonschema(collection):
    jsonschema_path = os.path.join(os.path.dirname(__file__), 'jsonschemas',
                                   'records', '{0}.json'.format(collection))
    with open(jsonschema_path) as file:
        jsonschema_content = json.loads(file.read())
    json_resolver = JSONResolver(plugins=['cap.modules.records.resolvers.jsonschemas'])
    result = JsonRef.replace_refs(jsonschema_content, loader=json_resolver.resolve)
    return jsonify(result)


@blueprint.route('/jsonschemas/options/<collection>/')
def jsonschema_options(collection):
    jsonschema_options_path = os.path.join(os.path.dirname(__file__),
                                           'jsonschemas', 'options',
                                           '{0}.js'.format(collection))
    return Response(stream_file(jsonschema_options_path),
                    mimetype='application/javascript')


@blueprint.route('/jsonschemas/definitions/<definition>')
def jsonschema_definitions(definition):
    jsonschema_definition_path = os.path.join(os.path.dirname(__file__),
                                              'jsonschemas', 'definitions',
                                              definition)
    response = Response(stream_file(jsonschema_definition_path),
                        mimetype='application/json')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@blueprint.route('/jsonschemas/fields/<field>')
def jsonschema_fields(field):
    jsonschema_fields_path = os.path.join(os.path.dirname(__file__),
                                          'jsonschemas', 'fields',
                                          field)
    return Response(stream_file(jsonschema_fields_path),
                    mimetype='application/json')
