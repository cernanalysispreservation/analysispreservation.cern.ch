# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2022 CERN.
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

"""CAP ADL ingestion service views."""

from io import BytesIO
from flask import jsonify, request

from invenio_files_rest.models import FileInstance, ObjectVersion
from invenio_pidstore.resolver import Resolver
from invenio_pidstore.errors import PIDDoesNotExistError

from . import blueprint
from cap.modules.access.utils import login_required
from cap.modules.deposit.api import CAPDeposit
from cap.modules.services.utils.adl import adl_parser


@blueprint.route('/adl/<record_id>/<file_name>', methods=['GET'])
@login_required
def ingest_adl(record_id, file_name):
    adl_file = None
    if record_id and file_name:
        try:
            resolver = Resolver(pid_type='depid',
                                object_type='rec',
                                getter=lambda x: x)

            _, rec_uuid = resolver.resolve(record_id)
            deposit = CAPDeposit.get_record(rec_uuid)
            adl_file = [
                file for file in deposit['_files']
                if file.get('key') == file_name
            ]
        except PIDDoesNotExistError:
            return jsonify({
                'message': 'You tried to provide a adl file'
                'with a non-existing record'}), 404
    if not adl_file:
        return jsonify({
            'message': 'You tried to provide a non existent adl file name.'
        }), 400
    adl_file_info = ObjectVersion.get(adl_file[-1].get('bucket'), file_name)
    adl_file_object = FileInstance.get(adl_file_info.file_id)

    try:
        parsed_adl = adl_parser(adl_file_object, deposit=True)
    except Exception as e:
        return jsonify({
            'message':
            'An exception `{}` has occured while parsing. '
            'Please try again.'.format(e)
        }), 400

    return jsonify(parsed_adl)


@blueprint.route('/adl/upload', methods=['POST'])
@login_required
def parse_adl_from_file():
    try:
        file_objects = request.files
        for _file in file_objects:
            adl_file = file_objects.get(_file).read()
    except Exception as e:
        return jsonify({
            'message':
            'An exception `{}` has occured while reading the file. '
            'Please try again.'.format(e)
        }), 400

    try:
        adl_file_object = BytesIO(adl_file)
        parsed_adl = adl_parser(adl_file_object, deposit=False)
    except Exception as e:
        return jsonify({
            'message':
            'An exception `{}` has occured while parsing. '
            'Please try again.'.format(e)
        }), 400

    return jsonify(parsed_adl)
