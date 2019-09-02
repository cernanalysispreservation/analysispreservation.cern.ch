# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2017 CERN.
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

"""Integration tests for CAP api."""

from __future__ import absolute_import, print_function
from mock import patch

from cap.modules.experiments.errors import ExternalAPIException


@patch('cap.modules.services.views.indico._indico')
def test_indico_empty_list(mock_indico, app, auth_headers_for_superuser):
    mock_indico_id = '1111'
    mock_indico.return_value = {u'count': 0, u'additionalInfo': {}, u'_type': u'HTTPAPIResult',
                                u'url': u'https://indico.cern.ch/export/event/1111.json',
                                u'ts': 1568636014, u'results': []}, 200

    with app.test_client() as client:
        resp = client.get('services/indico/{}'.format(mock_indico_id), headers=auth_headers_for_superuser)

        assert resp.status_code == 200
        assert resp.json == []


@patch('cap.modules.services.views.indico._indico', side_effect=ExternalAPIException())
def test_indico_exception(mock_indico, app, auth_headers_for_superuser):
    mock_indico_id = '848989'

    with app.test_client() as client:
        resp = client.get('services/indico/{}'.format(mock_indico_id), headers=auth_headers_for_superuser)

        assert resp.status_code == 503
        assert resp.json['message'] == 'External API replied with an error.'


@patch('cap.modules.services.views.indico._indico')
def test_indico(mock_indico, app, auth_headers_for_superuser):
    mock_indico_id = '848989'
    mock_indico.return_value = ({
        '_type': 'HTTPAPIResult', 'additionalInfo': {}, 'count': 1,
        'results': [{'_fossil': 'conferenceMetadata', '_type': 'Conference',
                     'address': '', 'category': 'TEST Category', 'categoryId': 2,
                     'chairs': [], 'material': [], 'references': [], 'note': {},
                     'creator': {'_fossil': 'conferenceChairMetadata', '_type': 'Avatar',
                                 'affiliation': '', 'emailHash': '514487040d28517d3c94700dd987e10e',
                                 'first_name': 'Ilias', 'fullName': 'Koutsakis, Ilias',
                                 'id': '77851', 'last_name': 'Koutsakis'},
                     'description': '', 'room': '', 'roomFullname': '', 'roomMapURL': None, 'title': 'test',
                     'creationDate': {'date': '2019-09-16', 'time': '13:46:47.701463', 'tz': 'Europe/Zurich'},
                     'endDate': {'date': '2019-09-16', 'time': '16:00:00', 'tz': 'Europe/Zurich'},
                     'startDate': {'date': '2019-09-16', 'time': '14:00:00', 'tz': 'Europe/Zurich'},
                     'folders': [], 'hasAnyProtection': False, 'id': '848989',
                     'location': 'CERN', 'timezone': 'Europe/Zurich', 'type': 'simple_event',
                     'url': 'https://indico.cern.ch/event/848989/',
                     'visibility': {'id': '', 'name': 'Everywhere'}}],
        'ts': 1568634418, 'url': 'https://indico.cern.ch/export/event/848989.json'}, 200)

    with app.test_client() as client:
        resp = client.get('services/indico/{}'.format(mock_indico_id), headers=auth_headers_for_superuser)

        assert resp.status_code == 200
        assert resp.json == {
            "address": "", "category": "TEST Category", "description": "", "id": "848989",
            "room_map_url": "", "title": "test", "url": "https://indico.cern.ch/event/848989/",
            "chairs": [], "folders": [], "location": "CERN", "room": "",
            "creation_date": "2019-09-16T13:46:47.701463+02:00",
            "end_date": "2019-09-16T16:00:00+02:00",
            "start_date": "2019-09-16T14:00:00+02:00",
            "creator": {"affiliation": "", "creator_id": "77851", "first_name": "Ilias",
                        "full_name": "Koutsakis, Ilias",
                        "last_name": "Koutsakis"}
        }
