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

from marshmallow import Schema, ValidationError, fields, validates_schema
from flask import current_app, has_request_context, url_for
from werkzeug.routing import BuildError

from invenio_search.utils import schema_to_index
from invenio_search import current_search


def schema_prefix(schema):
    """Get index prefix for a given schema."""
    if not schema:
        return None
    index, doctype = schema_to_index(
        schema, index_names=current_search.mappings.keys())
    return index.split('-')[0]


def is_record(record):
    """Determine if a record is a bibliographic record."""
    return schema_prefix(record.get('$schema')) == 'records'


def is_deposit(record):
    """Determine if a record is a deposit record."""
    return schema_prefix(record.get('$schema')) == 'deposits'


class StrictKeysMixin(object):
    """Ensure only defined keys exists in data."""

    @validates_schema(pass_original=True)
    def check_unknown_fields(self, data, original_data):
        """Check for unknown keys."""
        if not isinstance(original_data, list):
            items = [original_data]
        else:
            items = original_data
        for original_data in items:
            for key in original_data:
                if key not in self.fields:
                    raise ValidationError(
                        'Unknown field name.'.format(key),
                        field_names=[key],
                    )


class CommonRecordSchemaV1(Schema, StrictKeysMixin):
    """Common record schema."""

    id = fields.Integer(attribute='pid.pid_value', dump_only=True)
    created = fields.Str(dump_only=True)
    meta_info = fields.Method('dump_meta_info', dump_only=True)
    links = fields.Raw()
    files = fields.Raw(dump_only=True)

    def dump_links(self, obj):
        """Dump links."""
        links = obj.get('links', {})
        m = obj.get('metadata', {})
        _id = obj.get('pid', {}).pid_value

        if has_request_context():
            if is_deposit(m):
                bucket_id = m.get('_buckets', {}).get('deposit')
                recid = m.get('recid') if m.get('_deposit', {}).get('pid') \
                    else None

                # Constructing links
                self_url = current_app.config['DEPOSIT_RECORDS_API'].format(pid_value=_id)

                links['self'] = self_url
                # [TO FIX] create a coneverter to format `html` link
                links['html'] = '/deposit/{}/'.format(_id)
                links['discard'] = self_url + '/actions/discard'
                links['edit'] = self_url + '/actions/edit'
                links['publish'] = self_url + '/actions/publish'
                links['files'] = self_url + '/files'

            else:
                bucket_id = m.get('_buckets', {}).get('record')
                recid = m.get('recid')
                # api_key = None
                # html_key = 'html'

                # Constructing links
                self_url = current_app.config['SEARCH_UI_SEARCH_API']+'{pid_value}'.format(pid_value=_id)

                links['self'] = self_url

            if bucket_id:
                try:
                    links['bucket'] = url_for(
                        'invenio_files_rest.bucket_api',
                        bucket_id=bucket_id,
                        _external=True,
                    )
                except BuildError:
                    pass

            # if recid:
            #     try:
            #         if api_key:
            #             links[api_key] = url_for(
            #                 'invenio_records_rest.recid_item',
            #                 pid_value=recid,
            #                 _external=True,
            #             )
            #         if html_key:
            #             links[html_key] = \
            #                 current_app.config['RECORDS_UI_ENDPOINT'].format(
            #                 host=request.host,
            #                 scheme=request.scheme,
            #                 pid_value=recid,
            #             )
            #     except BuildError:
            #         pass
        return links

    def dump_meta_info(self, obj):
        """Dump meta_info."""

        m = obj.get('metadata', {})
        _meta_info = obj.get('_meta_info', {})
        _id = obj.get('pid', {}).pid_value

        # import ipdb;ipdb.set_trace()
        # _meta_info['boom'] = "bam"
        if _id:
            _meta_info['initialization'] = current_app.config['DEPOSIT_RECORDS_API'].format(pid_value=_id)
            _meta_info['files'] = {
                'action': current_app.config['DEPOSIT_RECORDS_API'].format(pid_value=_id),
                'files': m.get('_files', [])
            }
        else:
            _meta_info['initialization'] = current_app.config['DEPOSIT_SEARCH_API']

        _meta_info['template_params'] = {
            "messages": current_app.config['DEPOSIT_RESPONSE_MESSAGES']
        }
        _meta_info['extra_params'] = {
            "headers": {
                "Content-Type": "application/json"
            }
        }

        _meta_info['schema'] = m.get('$schema', "").replace('http://', 'https://')
        _meta_info['schema_form'] = _meta_info['schema'].replace('/schemas/', '/static/json/')

        _meta_info['loading_template'] = url_for('static', filename='node_modules/invenio-records-js/dist/templates/loading.html')
        _meta_info['alert_template'] = url_for('static', filename='templates/cap_records_js/alert.html')
        _meta_info['form_template'] = {
            'form_templates': current_app.config['DEPOSIT_FORM_TEMPLATES'],
            'form_templates_base': url_for('static', filename=current_app.config['DEPOSIT_FORM_TEMPLATES_BASE']),
            'template': url_for('static', filename=current_app.config['DEPOSIT_UI_JSTEMPLATE_FORM']),
        }

        _meta_info['files'].update({
            'extra-params': {
                "headers": {
                    "Content-Type": "application/json"
                }
            },
            'upload_zone_template': url_for('static', filename='templates/cap_files_js/upload.html'),
            'list_template': url_for('static', filename='templates/cap_files_js/list.html'),
        })

        return _meta_info
