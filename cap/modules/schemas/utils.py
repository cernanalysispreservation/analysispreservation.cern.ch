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

"""Utils for Schemas module."""

import re

from invenio_db import db

from .errors import SchemaDoesNotExist
from .models import Schema


def add_or_update_schema(fullpath=None, json=None):
    """Add or update schema by fullpath, e.g. records/ana1-v0.0.1.json."""
    try:
        schema = Schema.get_by_fullstring(fullpath)
        schema.json = json

        print('{} updated.'.format(fullpath))

    except SchemaDoesNotExist:
        regex = re.compile('/?(?P<name>\S+)'
                           '-v(?P<major>\d+).'
                           '(?P<minor>\d+).'
                           '(?P<patch>\d+)'
                           '(?:.json)'
                           )
        name, major, minor, patch = re.search(regex, fullpath).groups()

        experiment = None
        permission = None

        if name == 'records/lhcb':
            permission = 'cap.modules.experiments.permissions' + \
                '.lhcb.lhcb_group_need'
            experiment = 'LHCb'
        elif name in ('records/atlas-analysis', 'records/atlas-workflows'):
            permission = 'cap.modules.experiments.permissions' + \
                '.atlas.atlas_group_need'
            experiment = 'ATLAS'
        elif name in ('records/cms-analysis', 'records/cms-questionnaire'):
            permission = 'cap.modules.experiments.permissions' + \
                '.cms.cms_group_need'
            experiment = 'CMS'
        elif name == 'records/alice-analysis':
            permission = 'cap.modules.experiments.permissions' + \
                '.alice.alice_group_need'
            experiment = 'ALICE'

        schema = Schema(name=name, experiment=experiment,
                        permission=permission, major=major, minor=minor,
                        patch=patch, json=json)
        db.session.add(schema)

        print('{} added.'.format(fullpath))

    db.session.commit()
