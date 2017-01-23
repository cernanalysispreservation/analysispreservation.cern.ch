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

from __future__ import absolute_import, print_function

from invenio_assets import NpmBundle

from invenio_deposit.bundles import js_dependencies_jquery, js_dependencies_ui_sortable,js_dependencies_ckeditor, js_dependecies_autocomplete, js_main, js_dependecies_uploader

js_dependecies_schema_form = NpmBundle(
    'node_modules/objectpath/lib/ObjectPath.js',
    'node_modules/tv4/tv4.js',
    'js/cap_deposit/schema-form.js',
    'js/cap_deposit/bootstrap-decorator.js',
    'node_modules/invenio-records-js/dist/invenio-records-js.js',
    npm={
        'angular-schema-form': '~0.8.13',
        'invenio-records-js': '~0.0.8',
        'objectpath': '~1.2.1',
        'tv4': '~1.2.7',
    }
)


forms_css = NpmBundle(
    'scss/forms.scss',
    filters='node-scss, cleancss',
    output='gen/cap.forms.%(version)s.css',
    npm={
        "almond": "~0.3.1",
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
    }
)


forms_js = NpmBundle(
    # ui-sortable requires jquery to be already loaded
    js_dependencies_jquery,
    js_main,
    js_dependecies_uploader,
    js_dependecies_schema_form,
    js_dependecies_autocomplete,
    js_dependencies_ui_sortable,
    js_dependencies_ckeditor,
    filters='jsmin',
    output='gen/cap.deposit.form.dependencies.%(version)s.js',
)
