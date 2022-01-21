# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2021 CERN.
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

"""Serializers for CDS records."""

from __future__ import absolute_import, print_function

from marshmallow import fields, Schema


class LDAPUserSchema(Schema):
    """Schema for CERN LDAP."""

    email = fields.Method('get_mail', dump_only=True)
    profile = fields.Method('get_profile', dump_only=True)

    def get_mail(self, obj):
        return obj['mail'][0].decode('utf-8')

    def get_profile(self, obj):
        return {
            'display_name': obj['displayName'][0].decode('utf-8'),
            'common_name': obj['cn'][0].decode('utf-8'),
            'department': obj['department'][0].decode('utf-8')
        }


class OIDCUserSchema(Schema):
    """Schema for CERN OIDC Users."""

    email = fields.Str(attribute='emailAddress', dump_only=True)
    profile = fields.Method('get_profile', dump_only=True)

    def get_profile(self, obj):
        return {
            'display_name': obj['displayName'],
            'common_name': obj['uniqueIdentifier'],
            'department': obj['cernDepartment']
        }
