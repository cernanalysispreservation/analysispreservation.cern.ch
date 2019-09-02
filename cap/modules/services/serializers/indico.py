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
from datetime import datetime
import pytz

from marshmallow import Schema, fields


class IndicoDateField(fields.Field):
    """Schema for date extraction."""

    def _serialize(self, val, attr, obj):
        # add milliseconds to time to ensure the parsing works
        _time = val['time'] if '.' in val['time'] else val['time'] + '.0'
        _dateobj = datetime.strptime('{} {}'.format(val['date'], _time),
                                     '%Y-%m-%d %H:%M:%S.%f')

        _tz = pytz.timezone(val['tz'])
        return _tz.localize(_dateobj, is_dst=None).isoformat()


class IndicoEventSchema(Schema):
    """Schema for Indico events in JSON."""

    id = fields.Str(dump_only=True)
    title = fields.Str(dump_only=True)
    description = fields.Str(dump_only=True)
    category = fields.Str(dump_only=True)
    url = fields.Str(dump_only=True)
    location = fields.Str(dump_only=True)
    address = fields.Str(dump_only=True)
    room = fields.Str()
    room_map_url = fields.Str(attribute='roomFullname', dump_only=True)

    start_date = IndicoDateField(attribute='startDate', dump_only=True)
    end_date = IndicoDateField(attribute='endDate', dump_only=True)
    creation_date = IndicoDateField(attribute='creationDate', dump_only=True)

    creator = fields.Method('get_creator', dump_only=True)
    chairs = fields.Method('get_chairs', dump_only=True)
    folders = fields.Method('get_folders', dump_only=True)

    def get_creator(self, obj):
        """Get the serialized creator of the event."""
        creator = obj['creator']
        return {
            'creator_id': creator['id'],
            'affiliation': creator['affiliation'],
            'first_name': creator['first_name'],
            'last_name': creator['last_name'],
            'full_name': creator['fullName']
        }

    def get_chairs(self, obj):
        """Get the serialized chairs of the event."""
        _chairs = []
        for chair in obj['chairs']:
            _chairs.append({
                'chair_db_id': chair['id'],
                'person_id': chair['person_id'],
                'affiliation': chair['affiliation'],
                'first_name': chair['first_name'],
                'last_name': chair['last_name'],
                'full_name': chair['fullName']
            })

        return _chairs

    def get_folders(self, obj):
        """Get the serialized folders of the event."""
        _folders = []
        for folder in obj['folders']:
            _folder = {
                'folder_id': folder['id'],
                'title': folder['title'],
                'description': folder['description'],
            }

            if folder['attachments']:
                _attachments = []
                for att in folder['attachments']:
                    _attachments.append({
                        'attachment_id': att['id'],
                        'title': att['title'],
                        'size': att['size'],
                        'filename': att['filename'],
                        'description': att['description'],
                        'content_type': att['content_type'],
                        'modified_dt': att['modified_dt'],
                        'download_url': att['download_url'],
                    })
                _folder.update({'attachments': _attachments})
            _folders.append(_folder)

        return _folders
