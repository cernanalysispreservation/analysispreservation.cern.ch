# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2020 CERN.
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
# or submit itself to any jurisdiction.

"""Zenodo Serializer/Validator."""

import arrow
from flask_login import current_user
from marshmallow import Schema, fields, ValidationError, validate, validates, \
    validates_schema

DATE_REGEX = r'\d{4}-\d{2}-\d{2}'
DATE_ERROR = 'The date should follow the pattern YYYY-mm-dd.'

UPLOAD_TYPES = [
    'publication',
    'poster',
    'presentation',
    'dataset',
    'image',
    'video',
    'software',
    'lesson',
    'physicalobject',
    'other'
]
LICENSES = [
    'CC-BY-4.0',
    'CC-BY-1.0',
    'CC-BY-2.0',
    'CC-BY-3.0'
]
ACCESS_RIGHTS = [
    'open',
    'embargoed',
    'restricted',
    'closed'
]


def choice_error_msg(choices):
    return f'Not a valid choice. Select one of: {choices}'


class ZenodoCreatorsSchema(Schema):
    name = fields.String(required=True)
    affiliation = fields.String()
    orcid = fields.String()


class ZenodoDepositMetadataSchema(Schema):
    title = fields.String(required=True)
    description = fields.String(required=True)
    version = fields.String()

    keywords = fields.List(fields.String())
    creators = fields.List(
        fields.Nested(ZenodoCreatorsSchema), required=True)

    upload_type = fields.String(required=True, validate=validate.OneOf(
        UPLOAD_TYPES, error=choice_error_msg(UPLOAD_TYPES)))
    license = fields.String(required=True, validate=validate.OneOf(
        LICENSES, error=choice_error_msg(LICENSES)))
    access_right = fields.String(required=True, validate=validate.OneOf(
        ACCESS_RIGHTS, error=choice_error_msg(ACCESS_RIGHTS)))

    publication_date = fields.String(
        required=True, validate=validate.Regexp(DATE_REGEX, error=DATE_ERROR))
    embargo_date = fields.String(
        validate=validate.Regexp(DATE_REGEX, error=DATE_ERROR))
    access_conditions = fields.String()

    @validates('embargo_date')
    def validate_embargo_date(self, value):
        """Validate that embargo date is in the future."""
        if arrow.get(value).date() <= arrow.utcnow().date():
            raise ValidationError(
                'Embargo date must be in the future.',
                field_names=['embargo_date']
            )

    @validates_schema()
    def validate_license(self, data, **kwargs):
        """Validate license according to what Zenodo expects."""
        access = data.get('access_right')
        if access in ['open', 'embargoed'] and 'license' not in data:
            raise ValidationError(
                'Required when access right is open or embargoed.',
                field_names=['license']
            )
        if access == 'embargoed' and 'embargo_date' not in data:
            raise ValidationError(
                'Required when access right is embargoed.',
                field_names=['embargo_date']
            )
        if access == 'restricted' and 'access_conditions' not in data:
            raise ValidationError(
                'Required when access right is restricted.',
                field_names=['access_conditions']
            )


class ZenodoUploadSchema(Schema):
    files = fields.List(fields.String(), required=True)
    data = fields.Nested(ZenodoDepositMetadataSchema, default=dict())

    def __init__(self, *args, **kwargs):
        self.recid = kwargs.pop('recid') if 'recid' in kwargs else None
        super(Schema, self).__init__(*args, **kwargs)

    @validates_schema()
    def validate_files(self, data, **kwargs):
        """Check if the files exist in this deposit."""
        from cap.modules.deposit.api import CAPDeposit
        rec = CAPDeposit.get_record(self.recid)

        for _file in data['files']:
            if _file not in rec.files.keys:
                raise ValidationError(
                    f'File `{_file}` not found in record.',
                    field_names=['files']
                )


class ZenodoDepositSchema(Schema):
    id = fields.Int(dump_only=True)
    created = fields.String(dump_only=True)

    title = fields.Method('get_title', dump_only=True, allow_none=True)
    creator = fields.Method('get_creator', dump_only=True, allow_none=True)
    links = fields.Method('get_links', dump_only=True)

    def get_creator(self, data):
        return current_user.id if current_user else None

    def get_title(self, data):
        return data.get('metadata', {}).get('title')

    def get_links(self, data):
        return {
            'self': data['links']['self'],
            'bucket': data['links']['bucket'],
            'html': data['links']['html'],
            'publish': data['links']['publish']
        }
