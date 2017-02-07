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

"""Blueprint for Records."""

#########################################################
#########################################################
##                                                     ##
##            ***** LEGACY VIEWS *****                 ##
##   Kept for compatibility with "old" records and     ##
##   until all needed parts are moved to new style     ##
##                                                     ##
#########################################################
#########################################################

from __future__ import absolute_import, print_function

import os
import re
from functools import partial
from uuid import uuid4

import simplejson as json
import six
from elasticsearch_dsl.query import QueryString
from flask import (Blueprint, Response, abort, current_app, jsonify,
                   render_template, request, url_for)
from flask_login import current_user, login_required
from flask_security import login_required
from invenio_access.models import ActionRoles, ActionUsers
from invenio_access.permissions import (DynamicPermission,
                                        ParameterizedActionNeed)
from invenio_accounts.models import Role, User
from invenio_collections.models import Collection
from invenio_db import db
from invenio_indexer.utils import RecordIndexer
from invenio_pidstore.providers.recordid import RecordIdProvider
from invenio_pidstore.resolver import Resolver
from invenio_records import Record
from invenio_records.models import RecordMetadata
from .permissions import (RecordReadActionNeed,
                          RecordUpdateActionNeed,
                          read_permission_factory,
                          update_permission_factory)
from invenio_records_ui.views import default_view_method, record_view
from invenio_search import RecordsSearch
from jsonpatch import JsonPatchException, JsonPointerException
from jsonref import JsonRef
from jsonresolver import JSONResolver
from jsonschema.exceptions import ValidationError
from werkzeug.local import LocalProxy

from cap.config import JSON_METADATA_PATH, JSONSCHEMAS_VERSIONS
from cap.modules.records.serializers import json_v1

from .fetchers import cap_record_fetcher
import six
from werkzeug.local import LocalProxy
from cap.config import CAP_COLLECTION_TO_DOCUMENT_TYPE

_datastore = LocalProxy(lambda: current_app.extensions['security'].datastore)

RecordIndexActionNeed = partial(ParameterizedActionNeed, 'records-index')
"""Action need for indexing a record."""

records_index_all = RecordReadActionNeed(None)
"""Read all records action need."""


def can_edit_accessright(record):
    """Test if access right is valid."""

    r = RecordMetadata()
    setattr(r, 'id', record)
    permission_edit_record = update_permission_factory(r)
    if permission_edit_record.can():
        return True

    return False


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
    r_list = u_private + r_private + list(set(public) - set(u_private))
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
    r_list = u_private + r_private + list(set(public) - set(u_private))
    return zip(*r_list)[0] if r_list else []


def get_document_type(collection_name):
    """Calculate the human readable name for the document type specified."""
    return CAP_COLLECTION_TO_DOCUMENT_TYPE.get(
        collection_name, collection_name)


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



def construct_record(collection, metadata, creator_id, schema):
    """Create a record."""
    # Creating a uuid4
    recid = uuid4()

    # Creating a PID for the record
    provider = RecordIdProvider.create(object_type='rec', object_uuid=recid)
    pid = provider.pid.pid_value

    data = {}
    _deposit = {}
    _metadata = metadata
    _deposit['created_by'] = creator_id
    # _deposit['id'] = recid.int
    _deposit['pid'] = {
        "revision_id": 0,
        "type": "recid",
        "value": pid
    }
    _deposit['status'] = "draft"
    _deposit['pid_value'] = pid
    _deposit['control_number'] = pid
    if collection.parent and collection.parent.parent.name == 'CERNAnalysisPreservation':
        data['experiment'] = collection.parent.name
    data['collections'] = [collection.name]
    data['document_type_human'] = get_document_type(collection.name)

    data['$schema'] = schema
    # data["recid"] = recid.int
    data["_deposit"] = _deposit
    data['_metadata'] = _metadata
    data['_files'] = []

    return data, pid, recid


def record_permissions(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    pid, record = resolver.resolve(pid_value)

    permissions = get_record_permissions(record.id)

    result = dict()
    result['permissions'] = []

    collab_egroups = current_app.config.get('CAP_COLLAB_EGROUPS')

    if record.get('experiment', None):
        result['collab_egroup'] = six.next(
            six.itervalues(collab_egroups.get(record['experiment']))
        )[0]

    for p in permissions:
        if isinstance(p, ActionUsers) and p.user:
            result['permissions'].append(
                {"action": p.action, "user": {"email": p.user.email}}
            )
        elif isinstance(p, ActionRoles) and p.role:
            result['permissions'].append(
                {"action": p.action, "user": {"email": p.role.name}}
            )

    resp = jsonify(**result)
    resp.status_code = 200
    return resp


def get_record_permissions(recid=None):
    if not recid:
        return False

    action_edit_record = RecordUpdateActionNeed(str(recid))
    action_read_record = RecordReadActionNeed(str(recid))
    action_index_record = RecordIndexActionNeed(str(recid))

    permissions = dict()
    permissions['u_edit'] = ActionUsers.query_by_action(
        action_edit_record).all()
    permissions['u_read'] = ActionUsers.query_by_action(
        action_read_record).all()
    permissions['u_index'] = ActionUsers.query_by_action(
        action_index_record).all()

    permissions['r_edit'] = ActionRoles.query_by_action(
        action_edit_record).all()
    permissions['r_read'] = ActionRoles.query_by_action(
        action_read_record).all()
    permissions['r_index'] = ActionRoles.query_by_action(
        action_index_record).all()

    result = permissions['u_edit'] + permissions['u_read'] + permissions['u_index'] + \
        permissions['r_edit'] + permissions['r_read'] + permissions['r_index']

    return result


def change_record_privacy(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    pid, record = resolver.resolve(pid_value)

    permission_update_record = update_permission_factory(record)
    if not permission_update_record.can():
        abort(403)

    index_instance = ActionUsers.query.filter(
        ActionUsers.action == "records-index",
        ActionUsers.argument == str(record.id),
        ActionUsers.user_id.is_(None)).first()

    read_instance = ActionUsers.query.filter(
        ActionUsers.action == "records-read",
        ActionUsers.argument == str(record.id),
        ActionUsers.user_id.is_(None)).first()

    with db.session.begin_nested():
        if index_instance:
            db.session.delete(index_instance)
            db.session.delete(read_instance)
        else:
            action_read_record = RecordReadActionNeed(str(record.id))
            action_index_record = RecordIndexActionNeed(str(record.id))
            db.session.add(ActionUsers.allow(action_read_record))
            db.session.add(ActionUsers.allow(action_index_record))

    db.session.commit()

    resp = jsonify()
    resp.status_code = 200
    return resp


def update_record_permissions(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    pid, record = resolver.resolve(pid_value)

    emails = []
    roles = []
    userrole_list = request.get_json().keys()

    if not (current_app.config.get('EMAIL_REGEX', None)):
        resp = jsonify(**{message: "ERROR in email regex ;)"})
        resp.status_code = 400
        return resp

    email_regex = re.compile(current_app.config.get('EMAIL_REGEX'), )

    for userrole in userrole_list:
        if email_regex.match(userrole):
            emails.append(userrole)
        else:
            #: [TOBEFIXED] Needs to check if E-Group exists
            try:
                role = Role.query.filter(Role.name == userrole).first()
                if not role:
                    tmp_role = _datastore.create_role(name=userrole)
                roles.append(userrole)
            except:
                print("Something happened when trying to create '" +
                      userrole + "' role")
            # Role.add(tmp_role)

    users = User.query.filter(User.email.in_(emails)).all()
    roles = Role.query.filter(Role.name.in_(roles)).all()

    action_edit_record = RecordUpdateActionNeed(str(record.id))
    action_read_record = RecordReadActionNeed(str(record.id))
    action_index_record = RecordIndexActionNeed(str(record.id))

    with db.session.begin_nested():
        for user in users:
            for action in request.get_json().get(user.email, None):
                if (action.get("action", None) == "records-read" and action.get("op", None) == "add"):
                    db.session.add(ActionUsers.allow(
                        action_read_record, user=user))
                elif (action.get("action", None) == "records-index" and action.get("op", None) == "add"):
                    db.session.add(ActionUsers.allow(
                        action_index_record, user=user))
                elif (action.get("action", None) == "records-update" and action.get("op", None) == "add"):
                    db.session.add(ActionUsers.allow(
                        action_edit_record, user=user))
                elif (action.get("action", None) == "records-read" and action.get("op", None) == "remove"):
                    au = ActionUsers.query.filter(ActionUsers.action == "records-read", ActionUsers.argument == str(
                        record.id), ActionUsers.user_id == user.id).first()
                    if (au):
                        db.session.delete(au)
                elif (action.get("action", None) == "records-index" and action.get("op", None) == "remove"):
                    au = ActionUsers.query.filter(ActionUsers.action == "records-index", ActionUsers.argument == str(
                        record.id), ActionUsers.user_id == user.id).first()
                    if (au):
                        db.session.delete(au)
                elif (action.get("action", None) == "records-update" and action.get("op", None) == "remove"):
                    au = ActionUsers.query.filter(ActionUsers.action == "records-update", ActionUsers.argument == str(
                        record.id), ActionUsers.user_id == user.id).first()
                    if (au):
                        db.session.delete(au)

        # db.session.begin(nested=True)
        for role in roles:
            for action in request.get_json().get(role.name, None):
                if (action.get("action", None) == "records-read" and action.get("op", None) == "add"):
                    db.session.add(ActionRoles.allow(
                        action_read_record, role=role))
                elif (action.get("action", None) == "records-index" and action.get("op", None) == "add"):
                    db.session.add(ActionRoles.allow(
                        action_index_record, role=role))
                elif (action.get("action", None) == "records-update" and action.get("op", None) == "add"):
                    db.session.add(ActionRoles.allow(
                        action_edit_record, role=role))
                elif (action.get("action", None) == "records-read" and action.get("op", None) == "remove"):
                    au = ActionRoles.query.filter(ActionRoles.action == "records-read", ActionRoles.argument == str(
                        record.id), ActionRoles.role_id == role.id).first()
                    if (au):
                        db.session.delete(au)
                elif (action.get("action", None) == "records-index" and action.get("op", None) == "remove"):
                    au = ActionRoles.query.filter(ActionRoles.action == "records-index", ActionRoles.argument == str(
                        record.id), ActionRoles.role_id == role.id).first()
                    if (au):
                        db.session.delete(au)
                elif (action.get("action", None) == "records-update" and action.get("op", None) == "remove"):
                    au = ActionRoles.query.filter(ActionRoles.action == "records-update", ActionRoles.argument == str(
                        record.id), ActionRoles.role_id == role.id).first()
                    if (au):
                        db.session.delete(au)

    db.session.commit()

    resp = jsonify()
    resp.status_code = 200
    return resp


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
