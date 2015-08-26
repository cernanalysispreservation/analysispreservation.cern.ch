# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2015 CERN.
#
# CERN Analysis Preservation Framework is free software; you can
# redistribute it and/or modify it under the terms of the GNU General
# Public License as published by the Free Software Foundation; either
# version 2 of the License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that
# it will be useful, but WITHOUT ANY WARRANTY; without even the
# implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
# PURPOSE.  See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this software; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307,
# USA.

"""Bundles for jsondeposit."""

from __future__ import unicode_literals

from invenio.base.bundles import invenio as _invenio_js, \
    jquery as _j, \
    styles as _invenio_css
from invenio.ext.assets import Bundle, RequireJSFilter
from invenio_deposit.bundles import js as _deposit_js, \
    styles as _deposit_css

from invenio_deposit.filter import CSSUrlFixer

_invenio_js.contents.extend([
    "vendors/json-editor/dist/jsoneditor.js",
    "js/jsondeposit/record.js",
    "js/jsondeposit/fingerprint.js",
])

_invenio_js.bower.update({
    'fuse.js': 'latest',
    'tv4': 'latest',
    'Sortable': 'latest',
})

_invenio_css.contents.append(Bundle(
    "less/jsondeposit/record.less",
    "less/jsondeposit/fingerprint.less",
    filters="less,cleancss",
))
