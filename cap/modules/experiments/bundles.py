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
    "js/experiments/main.js",
    filters='requirejs',
    output="gen/cap.experiments.%(version)s.js",
    npm={
        "almond": "~0.3.1",
        "angular": "~1.4.7",
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
