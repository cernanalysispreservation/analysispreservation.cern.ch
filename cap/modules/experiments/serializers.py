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
"""Serializers for Reana models."""

from __future__ import absolute_import, print_function

from marshmallow import Schema, fields

try:
    from HTMLParser import HTMLParser
    unescape = HTMLParser().unescape
except ImportError:
    from html import unescape


class CADIField(fields.Field):
    """CADI html preprocessing field."""

    def _serialize(self, value, attr, obj):
        return '' if value is None \
            else unescape(unescape(value))


class CADIRelatedNotes(Schema):
    """Schema for CADI in JSON."""

    id = fields.Function(
        lambda entry: entry.get('noteId', '').replace('CMS ', ''),
        dump_only=True)
    url = CADIField(dump_default='', dump_only=True)


class CADISchema(Schema):
    """Schema for CADI in JSON."""

    name = CADIField(dump_default='', dump_only=True)
    description = CADIField(dump_default='', dump_only=True)
    pas = CADIField(attribute='pas', dump_default='', dump_only=True)
    paper = CADIField(attribute='paper', dump_default='', dump_only=True)
    paper_tar = CADIField(attribute='papertar', dump_default='', dump_only=True)
    created = CADIField(attribute='creationDate', dump_default='', dump_only=True)
    updated = CADIField(attribute='updateDate', dump_default='', dump_only=True)
    contact = CADIField(attribute='contact.email', dump_default='', dump_only=True)
    creator = CADIField(attribute='creator.email', dump_default='', dump_only=True)
    updater = CADIField(attribute='updater.email', dump_default='', dump_only=True)
    twiki = CADIField(attribute='url', dump_default='', dump_only=True)
    status = CADIField(dump_default='', dump_only=True)
    publication_status = CADIField(attribute='publicationStatus',
                                   dump_default='',
                                   dump_only=True)
    awg = CADIField(dump_default='', dump_only=True)
    conference = CADIField(dump_default='', dump_only=True)
    hepData = CADIField(dump_default='', dump_only=True)

    cadi_id = CADIField(attribute='code', dump_default='', dump_only=True)

    relatedNotes = fields.Nested(CADIRelatedNotes,
                                 attribute='relatedNotesInfo',
                                 many=True)


cadi_serializer = CADISchema()
