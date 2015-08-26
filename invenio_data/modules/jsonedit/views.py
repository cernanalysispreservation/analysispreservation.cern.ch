# -*- coding: utf-8 -*-
#
# This file is part of Invenio-JSONSchemas.
# Copyright (C) 2015 CERN.
#
# Invenio is free software; you can redistribute it
# and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# Invenio is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Invenio; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

import json

import jsonpatch

from flask import abort, Blueprint, make_response, render_template, request

from flask_babel import lazy_gettext as _

from flask_breadcrumbs import default_breadcrumb_root, register_breadcrumb

from flask_login import login_required

from invenio.ext.principal import permission_required

from invenio_records.api import get_record, Record

from invenio_jsonschemas.api import InsecureSchemaLocation, validate_json

from invenio.ext.sqlalchemy import db

from werkzeug.exceptions import BadRequest, Conflict

blueprint = Blueprint(
    'jsonedit',
    __name__,
    url_prefix='/jsonedit',
    static_folder='static',
    template_folder='templates',
)

default_breadcrumb_root(blueprint, '.jsonedit')


@blueprint.route('/<path:path>', methods=['GET', 'POST'])
@register_breadcrumb(blueprint, '.', _('Editor'))
@login_required
@permission_required('runbibedit')
def edit(path):
    db.session.begin(subtransactions=True)
    try:
        # the DB record won't change after this point
        record = get_record(path)
        if not record:
            abort(404)

        if request.method == 'POST':
            # generate patch
            data_old = dict(record)
            patch = None
            if request.form['patch']:
                # prioritize `patch` variant
                patch = jsonpatch.JsonPatch.from_string(request.form['patch'])
            elif request.form['json']:
                # hard override, generate a patch for that
                data_new_should = json.loads(request.form['json'])
                patch = jsonpatch.make_patch(data_old, data_new_should)

            if patch:
                # create new record
                try:
                    record = record.patch(patch)
                except Exception as e:
                    patch_str = patch.to_string()
                    return make_response(
                        render_template(
                            'jsonedit/conflict.html',
                            reason='Could not apply patch: "{}".'.format(str(e)),
                            patch=json.loads(patch_str),
                            patch_str=patch_str,
                            record_old=json.dumps(data_old),
                            record_new=None
                        ),
                        409
                    )
                data_new = dict(record)

                # check if we still have the same recid
                if record.get('recid', None) != int(path):
                    return make_response(
                        render_template(
                            'jsonedit/conflict.html',
                            reason='Illegal change of `recid`, should be "{}",'
                            'was "{}" instead.'.format(
                                int(path),
                                record.get('recid', None)
                            ),
                            patch=json.loads(patch_str),
                            patch_str=patch_str,
                            record_old=json.dumps(data_old),
                            record_new=json.dumps(data_new)
                        ),
                        400
                    )

                # check if we still have a $schema entry
                if isinstance(record.get('$schema', None), basestring):
                    return make_response(
                        render_template(
                            'jsonedit/conflict.html',
                            reason='`$schema` entry of type string is required.',
                            patch=json.loads(patch_str),
                            patch_str=patch_str,
                            record_old=json.dumps(data_old),
                            record_new=json.dumps(data_new)
                        ),
                        400
                    )

                # try schema validation
                try:
                    validate_json(data_new)
                except InsecureSchemaLocation:
                    return make_response(
                        render_template(
                            'jsonedit/conflict.html',
                            reason='`$schema` does not point to a trusted location.',
                            patch=json.loads(patch_str),
                            patch_str=patch_str,
                            record_old=json.dumps(data_old),
                            record_new=json.dumps(data_new)
                        ),
                        400
                    )
                except Exception as e:
                    return make_response(
                        render_template(
                            'Record does is not valid against the provided schema: "{}".'.format(str(e)),
                            patch=json.loads(patch_str),
                            patch_str=patch_str,
                            record_old=json.dumps(data_old),
                            record_new=json.dumps(data_new)
                        ),
                        400
                    )

                # commit data to DB
                record.commit()

        # write data back to DB
        return render_template(
            'jsonedit/editor.html',
            json=json.dumps(record.dumps())
        )
    finally:
        db.session.commit()
