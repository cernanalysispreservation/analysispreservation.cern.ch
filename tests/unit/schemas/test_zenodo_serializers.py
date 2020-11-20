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

"""Zenodo upload serializers."""

from cap.modules.services.serializers.zenodo import ZenodoUploadSchema, ZenodoDepositSchema


def test_zenodo_upload_serializer(app, deposit_with_file):
    recid = str(deposit_with_file.id)

    data = {
        'data': {
            'title': 'My first upload yoohoo',
            'upload_type': 'poster',
            'description': 'This is my first upload',
            'creators': [
                {'name': 'Ilias KoKoKo', 'affiliation': 'Zenodo CAP'}
            ],
            'access_right': 'open',
            'license': 'CC-BY-4.0',
            'publication_date': '2020-11-20',
            'embargo_date': '2030-09-09'
        },
        'files': ['test-file.txt']
    }
    payload, errors = ZenodoUploadSchema(recid=recid).load(data)
    assert errors == {}
    assert payload == data

    # not existing files
    data = {
        'data': {
            'title': 'My first upload yoohoo',
            'upload_type': 'poster',
            'description': 'This is my first upload',
            'creators': [
                {'name': 'Ilias KoKoKo', 'affiliation': 'Zenodo CAP'}
            ],
            'access_right': 'open',
            'license': 'CC-BY-4.0',
            'publication_date': '2020-11-20',
            'embargo_date': '2030-09-09'
        },
        'files': ['test-file.txt', 'no-file.txt'],
    }
    payload, errors = ZenodoUploadSchema(recid=recid).load(data)
    assert errors == {'files': ['File `no-file.txt` not found in record.']}

    # missing required fields
    data = {
        'data': {
            'title': 'My first upload yoohoo',
            'creators': [
                {'name': 'Ilias KoKoKo', 'affiliation': 'Zenodo CAP'}
            ],
            'access_right': 'open',
            'license': 'CC-BY-4.0',
            'publication_date': '2020-11-20',
            'embargo_date': '2030-09-09'
        },
        'files': ['test-file.txt']
    }
    payload, errors = ZenodoUploadSchema(recid=recid).load(data)
    assert errors == {
        'data': {
            'upload_type': ['Missing data for required field.'],
            'description': ['Missing data for required field.']}
    }

    # embargo date in the past
    data = {
        'data': {
            'title': 'My first upload yoohoo',
            'upload_type': 'poster',
            'description': 'This is my first upload',
            'creators': [
                {'name': 'Ilias KoKoKo', 'affiliation': 'Zenodo CAP'}
            ],
            'access_right': 'open',
            'license': 'CC-BY-4.0',
            'publication_date': '2020-11-20',
            'embargo_date': '2015-09-09'
        },
        'files': ['test-file.txt']
    }
    payload, errors = ZenodoUploadSchema(recid=recid).load(data)
    assert errors == {
        'data': {
            'embargo_date': ['Embargo date must be in the future.']
        }}

    # malformed dates
    data = {
        'data': {
            'title': 'My first upload yoohoo',
            'upload_type': 'poster',
            'description': 'This is my first upload',
            'creators': [
                {'name': 'Ilias KoKoKo', 'affiliation': 'Zenodo CAP'}
            ],
            'access_right': 'open',
            'license': 'CC-BY-4.0',
            'publication_date': '2020-11',
            'embargo_date': '2015-01'
        },
        'files': ['test-file.txt']
    }
    payload, errors = ZenodoUploadSchema(recid=recid).load(data)
    assert errors == {
        'data': {
            'publication_date': ['The date should follow the pattern YYYY-mm-dd.'],
            'embargo_date': ['The date should follow the pattern YYYY-mm-dd.']
        }}

    # wrong enum in license/upload/access
    data = {
        'data': {
            'title': 'My first upload yoohoo',
            'upload_type': 'test',
            'description': 'This is my first upload',
            'creators': [
                {'name': 'Ilias KoKoKo', 'affiliation': 'Zenodo CAP'}
            ],
            'access_right': 'test',
            'license': 'test',
            'publication_date': '2020-11-20',
            'embargo_date': '2030-09-09'
        },
        'files': ['test-file.txt']
    }
    payload, errors = ZenodoUploadSchema(recid=recid).load(data)
    assert errors == {
        'data': {
            'license': ["Not a valid choice. Select one of: ['CC-BY-4.0', 'CC-BY-1.0', 'CC-BY-2.0', 'CC-BY-3.0']"],
            'access_right': ["Not a valid choice. Select one of: ['open', 'embargoed', 'restricted', 'closed']"],
            'upload_type': ["Not a valid choice. Select one of: ['publication', 'poster', "
                            "'presentation', 'dataset', 'image', 'video', 'software', "
                            "'lesson', 'physicalobject', 'other']"]
        }
    }

    # access conditional
    data = {
        'data': {
            'title': 'My first upload yoohoo',
            'upload_type': 'poster',
            'description': 'This is my first upload',
            'creators': [
                {'name': 'Ilias KoKoKo', 'affiliation': 'Zenodo CAP'}
            ],
            'access_right': 'restricted',
            'license': 'CC-BY-4.0',
            'publication_date': '2020-11-20',
            'embargo_date': '2030-09-09'
        },
        'files': ['test-file.txt']
    }
    payload, errors = ZenodoUploadSchema(recid=recid).load(data)
    assert errors == {
        'data': {
            'access_conditions': ['Required when access right is restricted.']
        }}


def test_zenodo_deposit_serializer():
    payload = {
        'id': 111,
        'record_id': 111,
        'metadata': {
            'title': 'test'
        },
        'links': {
            'bucket': 'http://zenodo-test.com/test-bucket',
            'html': 'https://sandbox.zenodo.org/deposit/111',
            'publish': 'https://sandbox.zenodo.org/api/deposit/depositions/111/actions/publish',
            'self': 'https://sandbox.zenodo.org/api/deposit/depositions/111'
        },
        'files': [],
        'created': '2020-11-20T11:49:39.147767+00:00'
    }

    data = ZenodoDepositSchema().dump(payload).data
    assert data['id'] == 111
    assert data['title'] == 'test'
    assert data['creator'] is None
