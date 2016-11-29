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

# css = NpmBundle(
#     'scss/cap.scss',
#     filters='node-scss, cleancss',
#     output='gen/cap.%(version)s.css',
#     npm={
#         "almond": "~0.3.1",
#         "bootstrap-sass": "~3.3.5",
#         "font-awesome": "~4.4.0",
#     }
# )

cms_js = NpmBundle(
    filters='jsmin',
    output="gen/cap.cms.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7",
        "bootstrap": "~3.3.5",
    }
)

lhcb_js = NpmBundle(
    filters='requirejs',
    output="gen/cap.lhcb.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7",
    }
)

atlas_js = NpmBundle(
    filters='requirejs',
    output="gen/cap.atlas.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7",
    }
)

alice_js = NpmBundle(
    filters='requirejs',
    output="gen/cap.alice.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7",
    }
)

experiments_js = NpmBundle(
    "node_modules/angular-ui-router/release/angular-ui-router.min.js",
    "node_modules/angular-animate/angular-animate.js",
    'node_modules/angular-loading-bar/build/loading-bar.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    'node_modules/invenio-search-js/dist/invenio-search-js.js',
    'node_modules/invenio-records-js/dist/invenio-records-js.js',
    "js/cap/cap.pushmenu.components.js",
    "js/cap/cap.pushmenu.js",
    "js/cap/cap.search.js",
    "js/cap/cap.records.js",
    "js/cap/cap.services.js",
    "js/cap/cap.app.js",
    "js/cap/cap.controllers.js",
    "js/cap/cap.config.js",
    "js/experiments/app.js",
    "js/cap/cap.main.js",
    output="gen/cap.experiments.%(version)s.js",
    npm={
        "angular": "~1.4.7",
        "angular-ui-bootstrap": "~2.2.0",
        "angular-ui-router": "~0.3.2",
        "angular-animate": "~1.3",
    }
)

experiments_css = NpmBundle(
    Bundle(
        'scss/experiments.scss',
        "scss/pushmenu.scss",
        filters='node-scss, cleancss',
    ),
    output='gen/cap.experiments.%(version)s.css',
    npm={
        "almond": "~0.3.1",
        "bootstrap-sass": "~3.3.5",
        "font-awesome": "~4.4.0",
    }
)
