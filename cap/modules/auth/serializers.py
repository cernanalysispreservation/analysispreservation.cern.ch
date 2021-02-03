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

"""Serializers for external services information."""

from __future__ import absolute_import, print_function

from marshmallow import Schema, fields


class CERNProfileSchema(Schema):
    """Schema for CERN profile info."""
    name = fields.Str(dump_only=True)
    family_name = fields.Str(dump_only=True)
    given_name = fields.Str(dump_only=True)
    home_institute = fields.Str(dump_only=True)
    preferred_username = fields.Str(dump_only=True)
    sub = fields.Str(dump_only=True)
    email = fields.Str(dump_only=True)

    cern_mail_upn = fields.Str(dump_only=True)
    cern_upn = fields.Str(dump_only=True)
    cern_preferred_language = fields.Str(dump_only=True)

    cern_gid = fields.Int(dump_only=True)
    cern_person_id = fields.Int(dump_only=True)
    cern_uid = fields.Int(dump_only=True)

    groups = fields.List(fields.Str(), dump_only=True)


class GitHubLoginSchema(Schema):
    """Schema for GitHub login info."""

    name = fields.Str(dump_only=True)
    username = fields.Str(attribute='login', dump_only=True)
    id = fields.Int(dump_only=True)
    email = fields.Str(dump_only=True)
    avatar_url = fields.Str(dump_only=True)
    profile_url = fields.Str(attribute='html_url', dump_only=True)


class GitLabLoginSchema(Schema):
    """Schema for GitLab login info."""

    name = fields.Str(dump_only=True)
    username = fields.Str(dump_only=True)
    id = fields.Int(dump_only=True)
    email = fields.Str(dump_only=True)
    avatar_url = fields.Str(dump_only=True)
    profile_url = fields.Str(attribute='web_url', dump_only=True)


class ZenodoLoginSchema(Schema):
    """Schema for Zenodo login info."""

    links = fields.Function(lambda obj: obj['links'])


class OrcidLoginSchema(Schema):
    """Schema for ORCID login info."""

    name = fields.Method('get_name', dump_only=True)
    orcid = fields.Method('get_orcid', dump_only=True)
    email = fields.List(fields.Str(), attribute='person.emails.email',
                        dump_only=True)

    def get_name(self, obj):
        """Compose the full name of the person."""
        name = obj['person']['name']
        return '{} {}'.format(name['given-names']['value'],
                              name['family-name']['value'])

    def get_orcid(self, obj):
        """Retrieve ORCID id and url."""
        return {
            'id': obj['orcid-identifier']['path'],
            'url': obj['orcid-identifier']['uri']
        }
