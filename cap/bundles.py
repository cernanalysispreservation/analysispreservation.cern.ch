# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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


app_js = NpmBundle(
    "node_modules/angular-ui-router/release/angular-ui-router.min.js",
    "node_modules/angular-media-queries/match-media.js",
    "node_modules/angular-animate/angular-animate.js",
    "node_modules/angular-filter/dist/angular-filter.js",
    'node_modules/angular-loading-bar/build/loading-bar.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/jsoneditor/dist/jsoneditor.js',
    'node_modules/ng-jsoneditor/ng-jsoneditor.js',
    'node_modules/angular-hotkeys/build/hotkeys.js',
    'node_modules/invenio-search-js/dist/invenio-search-js.js',
    'node_modules/invenio-records-js/dist/invenio-records-js.js',
    "js/cap/cap.app.js",
    "js/cap/directives/cap.pushmenu.components.js",
    "js/cap/directives/cap.pushmenu.js",
    "js/cap/services/capUserClient.js",
    "js/cap/services/capRecordsClient.js",
    "js/cap/cap.shortcuts.js",
    "js/cap/factories/capFocus.js",
    "js/cap/controllers/capCtrl.js",
    "js/cap/controllers/capDepositCtrl.js",
    "js/cap/controllers/capFormAutofillCtrl.js",
    "js/cap/controllers/capWGCtrl.js",
    "js/cap/controllers/capRecordCtrl.js",
    "js/cap/directives/capResults.js",
    "js/cap/directives/capEventFocus.js",
    "js/cap/cap.config.js",
    "js/cap/components/contentBar.js",
    "js/cap/cap.main.js",
    output="gen/cap.app.%(version)s.js",
    npm={
        "angular": "~1.5",
        "angular-ui-bootstrap": "~2.2.0",
        "angular-ui-router": "~0.3.2",
        "angular-animate": "~1.3",
        "angular-filter": "~0.5.14",
        "angular-hotkeys": "~1.7.0",
        "ng-jsoneditor": "~1.0.0",
        "angular-media-queries": "~0.6.1",
        "jsoneditor": "~5.5.6"
    }
)

app_css = NpmBundle(
    Bundle(
        'scss/cap.scss',
        'node_modules/angular-hotkeys/build/hotkeys.css',
        'node_modules/jsoneditor/dist/jsoneditor.css',
        "scss/pushmenu.scss",
        filters='node-scss, cleancss',
    ),
    output='gen/cap.app.%(version)s.css',
    npm={
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
        "angular-hotkeys": "~1.7.0"
    }
)
