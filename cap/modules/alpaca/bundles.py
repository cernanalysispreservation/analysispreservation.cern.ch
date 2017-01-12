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

from flask_assets import Bundle
from invenio_assets import NpmBundle

display_js = NpmBundle(
    Bundle(
        filters="uglifyjs",
    ),
    Bundle(
        'js/jsondisplay.js',
        filters="requirejs",
    ),
    filters="requirejs",
    output="gen/invenio.alpaca.display.%(version)s.js",
    npm={
        "jquery": "~1.9.1",
        "select2": "~4.0.1",
        "underscore": "~1.8.3",
        "bloodhound-js": "~1.2.1",
        "bootstrap-3-typeahead": "~4.0.2",
        "handlebars": "~4.0.5",
        "moment": "~2.10.6",
        "json-schema-ref-parser": "~1.4.0",
        "alpaca": "1.5.22",
        "gulp": "3.9.0",
    }
)

create_js = NpmBundle(
    Bundle(
        filters="uglifyjs",
    ),
    Bundle(
        'js/jsonwidget-create.js',
        'js/records/main.js',
        filters="requirejs",
    ),
    output="gen/invenio.alpaca.create.%(version)s.js",
    npm={
        "jquery": "~1.9.1",
        "select2": "~4.0.1",
        "underscore": "~1.8.3",
        "bloodhound-js": "~1.2.1",
        "bootstrap-3-typeahead": "~4.0.2",
        "bootstrap-tokenfield": "~0.12.0",
        "handlebars": "~4.0.5",
        "moment": "~2.10.6",
        "json-schema-ref-parser": "~1.4.0",
        "alpaca": "1.5.22",
        "gulp": "3.9.0",
        "fast-json-patch": "~0.5.4",
    }
)

edit_js = NpmBundle(
    Bundle(
        filters="uglifyjs",
    ),
    Bundle(
        'js/jsonwidget-edit.js',
        'js/records/main.js',
        filters="requirejs",
    ),
    output="gen/invenio.alpaca.edit.%(version)s.js",
    npm={
        "jquery": "~1.9.1",
        "select2": "~4.0.1",
        "underscore": "~1.8.3",
        "bloodhound-js": "~1.2.1",
        "bootstrap-3-typeahead": "~4.0.2",
        "bootstrap-tokenfield": "~0.12.0",
        "handlebars": "~4.0.5",
        "moment": "~2.10.6",
        "json-schema-ref-parser": "~1.4.0",
        "alpaca": "1.5.22",
        "gulp": "3.9.0",
        "fast-json-patch": "~0.5.4",
    }
)

display_css = NpmBundle(
    'scss/invenio-alpaca-display.scss',
    filters="node-scss, cleancss",
    output="gen/invenio.alpaca.display.%(version)s.css",
    npm={
        "almond": "~0.3.1",
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
    }
)
edit_css = NpmBundle(
    Bundle(
        'node_modules/select2/dist/css/select2.css',
        'scss/invenio-alpaca-edit.scss',
        filters="node-scss, cleancss",
    ),
    output="gen/invenio.alpaca.edit.%(version)s.css",
    npm={
        "almond": "~0.3.1",
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
    }
)
