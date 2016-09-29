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


"""CAP deposit UI views"""
from ..api import CAPDeposit
from cap.config import DEPOSIT_GROUPS
from cap.utils import obj_or_import_string
from flask import Blueprint, abort, current_app, render_template, url_for
from flask.views import View

blueprint = Blueprint(
    'cap_deposit_ui',
    __name__,
    template_folder='../templates',
    url_prefix='/deposit',
    static_folder='../static'
)


def create_blueprint():
    # Get DEPOSIT_GROUPS from configuration
    deposit_groups = DEPOSIT_GROUPS

    for group_name, group in deposit_groups.iteritems():
        blueprint.add_url_rule(
            '/{0}/new'.format(group_name),
            view_func=NewItemView.as_view(
                'deposit_item_new_{0}'.format(group_name),
                template_name=group.get('item_new_template', None),
                schema=group.get('schema', None),
                create_permission_factory=group.get(
                    'create_permission_factory_imp', None),
                schema_form=group.get('schema_form', None),
            )
        )

        blueprint.add_url_rule(
            '/{0}'.format(group_name),
            view_func=ListView.as_view(
                'deposit_list_{0}'.format(group_name),
                template_name=group.get('list_template', None),
                schema=group.get('schema', None),
            )
        )

    return blueprint


@blueprint.app_template_filter('tolinksjs')
def to_links_js(pid, deposit=None):
    """Get API links."""
    self_url = current_app.config['DEPOSIT_RECORDS_API'].format(
        pid_value=pid.pid_value)

    return {
        'self': self_url,
        'html': url_for(
            'invenio_deposit_ui.{}'.format(pid.pid_type),
            pid_value=pid.pid_value),
        'bucket': current_app.config['DEPOSIT_FILES_API'] + '/{0}'.format(
            str(deposit.files.bucket.id)),
        'discard': self_url + '/actions/discard',
        'edit': self_url + '/actions/edit',
        'publish': self_url + '/actions/publish',
        'files': self_url + '/files',
    }


@blueprint.app_template_filter('tofilesjs')
def to_files_js(deposit):
    """List files in a deposit."""
    res = []

    for f in deposit.files:
        res.append({
            'key': f.key,
            'version_id': f.version_id,
            'checksum': f.file.checksum,
            'size': f.file.size,
            'completed': True,
            'progress': 100,
            'links': {
                'self': (
                    current_app.config['DEPOSIT_FILES_API'] +
                    u'/{bucket}/{key}?versionId={version_id}'.format(
                        bucket=f.bucket_id,
                        key=f.key,
                        version_id=f.version_id,
                    )),
            }
        })

    return res


class NewItemView(View):

    def __init__(self, template_name=None,
                 schema=None,
                 schema_form=None,
                 create_permission_factory=None):

        self.template_name = template_name
        self.schema = schema
        self.schema_form = schema_form

        try:
            assert create_permission_factory
            self._create_deposit_permission = \
                obj_or_import_string(create_permission_factory)
        except:
            abort(403)

    def render_template(self, context):
        return render_template(self.template_name, **context)

    def dispatch_request(self):
        if self._create_deposit_permission.can():
            context = {
                "record": {'_deposit': {'id': None}},
                "schema": self.schema,
                "schema_form": self.schema_form,
            }
            return self.render_template(context)
        else:
            abort(403)


class ListView(View):

    def __init__(self, template_name=None,
                 schema=None, schema_form=None,
                 read_permission_factory=None,
                 create_permission_factory=None,
                 update_permission_factory=None,
                 delete_permission_factory=None):

        self.template_name = template_name
        self.schema = schema
        self.schema_form = schema_form
        self.read_permission_factory = read_permission_factory
        self.create_permission_factory = create_permission_factory
        self.update_permission_factory = update_permission_factory
        self.delete_permission_factory = delete_permission_factory

    def check_permissions(self):
        raise NotImplementedError()

    def render_template(self, context):
        return render_template(self.template_name, **context)

    def dispatch_request(self):
        context = {
            "schema": self.schema,
        }
        return self.render_template(context)
