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

"""Serializers for ROR organization model."""

from __future__ import absolute_import, print_function

from marshmallow import Schema, fields


class RORAffiliationsListSchema(Schema):
    """Schema for ROR organizations list in JSON."""

    ror_org_id = fields.Function(lambda obj: obj['id'].split('/')[-1],
                                 dump_only=True)
    name = fields.Str(dump_only=True)
    acronyms = fields.List(fields.Str(), dump_only=True)


class RORAffiliationSchema(Schema):
    """Schema for ROR organizations in JSON."""

    ror_org_id = fields.Function(lambda obj: obj['id'].split('/')[-1],
                                 attribute='org_id', dump_only=True)
    name = fields.Str(dump_only=True)
    wikipedia_url = fields.Str(dump_only=True)

    links = fields.List(fields.Str(), dump_only=True)
    aliases = fields.List(fields.Str(), dump_only=True)
    acronyms = fields.List(fields.Str(), dump_only=True)
    types = fields.List(fields.Str(), dump_only=True)

    country = fields.Dict(dump_only=True)
    labels = fields.List(fields.Dict(), dump_only=True)
    external_ids = fields.Method('get_external_ids', dump_only=True)

    def get_external_ids(self, obj):
        """Get the serialized creator of the event."""
        external = obj['external_ids']

        # get preferred, except when it's None
        # check if v['all'] is a list or a string to get the result
        return {k: v['preferred'] or v['all'][0]
                if isinstance(v['all'], list) else v['all']
                for k, v in external.items()}
