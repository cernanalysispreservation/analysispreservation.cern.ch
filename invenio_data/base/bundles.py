# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2014, 2015 CERN.
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

"""Data-demo bundles."""


from invenio_base.bundles import styles as _styles
from invenio_ext.assets import Bundle


_styles.contents.remove("less/base.less")
_styles.contents += ("less/cds.less",)
_styles.contents += ("less/experiments.less",)
_styles.contents += ("less/font.less",)

base_js = Bundle(
    filters="requirejs",
    bower={
        'base-64': 'latest',
        'bootstrap-select': 'latest',
        'fuse': 'latest',
        'tv4': 'latest',
        'jquery': 'latest',
        'jquery-ui': 'latest',
        'typeahead.js': 'latest',
        'utf8': 'latest'
    }
)
