from __future__ import absolute_import, print_function

from flask import Blueprint, render_template, jsonify, request, \
    redirect, url_for, abort, current_app
# from flask_menu import register_menu
# from invenio_search import Query, current_search_client
from invenio_records import Record
from invenio_records.models import RecordMetadata
from sqlalchemy.orm.exc import NoResultFound
from invenio_pidstore.providers.recordid import RecordIdProvider
from invenio_pidstore.resolver import Resolver
# from invenio_pidstore.models import PersistentIdentifier, PIDStatus
from invenio_records_ui.views import record_view
from invenio_db import db
from invenio_search import InvenioSearch, Query, current_search_client
from uuid import uuid4
import json
from jsonpatch import JsonPatchException, JsonPointerException

blueprint = Blueprint(
    'cap_front',
    __name__,
    url_prefix='',
    template_folder='templates',
    static_folder='static',
)


@blueprint.route('/')
# @register_menu(blueprint, 'main.index', 'Search')
def index():
    """Frontpage blueprint."""

    return render_template('cap_theme/home.html')


@blueprint.route('/records')
def recordsAll():
    """Basic test view."""
    return jsonify(records=[(r.json, r.id)for r in RecordMetadata.query.all()])


@blueprint.route('/records/<collection>/<subcollection>/create')
def record_create(collection=None, subcollection=None):
    """Basic test view."""

    if not collection in current_app.config['CAP_COLLECTIONS']:
        abort(404)

    # Creating a uuid4
    recid = uuid4()

    data = {}
    data['collections'] = {}
    if collection and subcollection:
        data['collections']['primary'] = collection
        data['collections']['secondary'] = subcollection
    else:
        abort(404)

    # Creating a PID for the record
    provider = RecordIdProvider.create(object_type='rec', object_uuid=recid)
    pid = provider.pid.pid_value

    # Creating record with new recid
    data['pid_value'] = pid
    record = Record.create(data, id_=recid)

    return redirect(url_for('.edit_record', pid_value=pid))


@blueprint.route('/records/collection/<string:collection>')
def collection_records(collection=None):
    page = request.values.get('page', 1, type=int)
    size = request.values.get('size', 1, type=int)
    # query = Query(request.values.get('q', ''))[(page-1)*size:page*size]
    response = current_search_client.search(
        index='records',
        # doc_type=request.values.get('type', 'example'),
        q='collections.primary:'+collection,
    )

    recs = response.get('hits', []).get('hits', [])

    records = {
        'records': recs
    }

    return jsonify(**records)


@blueprint.route('/records/<pid_value>/edit')
def edit_record(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    pid, record = resolver.resolve(pid_value)
    collections = record.get('collections', None)
    print(collections)

    return record_view(pid_value, resolver, 'cap_theme/records_ui/edit.html', collections=collections)


@blueprint.route('/records/<pid_value>/update', methods=['POST'])
def update_record(pid_value=None):
    resolver = Resolver(
        pid_type='recid',
        object_type='rec',
        getter=Record.get_record)

    pid, record = resolver.resolve(pid_value)

    # record.patch(request.get_data())

    try:
        record = record.patch(request.get_data())
    except (JsonPatchException, JsonPointerException):
        abort(400)

    record.commit()
    db.session.commit()
    # print(request.get_data())
    return '200'

@blueprint.route('/search')
def search():
    """CAP Search page."""
    return render_template('cap_theme/search.html')


@blueprint.route('/elastic', methods=['GET', 'POST'])
@blueprint.route('/elastic/<index_name>', methods=['GET', 'POST'])
@blueprint.route('/elastic/<index_name>/_search', methods=['GET', 'POST'])
def elastic(index_name='cap'):
    """CAP Home page."""
    page = request.values.get('page', 1, type=int)
    size = request.values.get('size', 1, type=int)
    query = Query(request.values.get('q', ''))[(page-1)*size:page*size]
    response = current_search_client.search(
        index=index_name,
        doc_type=request.values.get('type', 'example'),
        body=query.body,
    )
    return jsonify(**response)
