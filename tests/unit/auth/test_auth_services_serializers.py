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

from __future__ import absolute_import, print_function

from cap.modules.auth.serializers import GitLabLoginSchema, GitHubLoginSchema,\
    OrcidLoginSchema, ZenodoLoginSchema


def test_github_serializer():
    mock_resp = {
        'avatar_url': 'https://avatars1.githubusercontent.com/u/2445433?v=4',
        'company': 'CERN', 'created_at': '2012-09-28T12:52:05Z',
        'email': 'ilias.koutsakis@cern.ch',
        'followers': 13, 'following': 5, 'id': 2445433,
        'html_url': 'https://github.com/Lilykos',
        'location': 'Geneva, Switzerland',
        'login': 'Lilykos', 'name': 'Ilias Koutsakis',
        'public_gists': 3, 'public_repos': 31
    }

    serializer = GitHubLoginSchema()
    assert serializer.dump(mock_resp).data == {
        'name': 'Ilias Koutsakis',
        'username': 'Lilykos',
        'id': 2445433,
        'email': 'ilias.koutsakis@cern.ch',
        'avatar_url': 'https://avatars1.githubusercontent.com/u/2445433?v=4',
        'profile_url': 'https://github.com/Lilykos'
    }


def test_gitlab_serializer():
    mock_resp = {
        'avatar_url': 'http://example.com',
        'created_at': '2019-10-31T10:34:58.009+01:00',
        'email': 'ilias.koutsakis@cern.ch', 'id': 12,
        'identities': [
            {'extern_uid': 'ilkoutsa', 'provider': 'saml'},
            {'extern_uid': 'cn=ilkoutsa,ou=users,ou=organic units,dc=cern,dc=ch', 'provider': 'ldapmain'},
            {'extern_uid': 'ilkoutsa@CERN.CH', 'provider': 'kerberos'}],
        'location': None, 'organization': None,
        'name': 'Ilias Koutsakis', 'username': 'ilkoutsa',
        'web_url': 'https://gitlab-test.cern.ch/ilkoutsa', 'website_url': ''
    }

    serializer = GitLabLoginSchema()
    assert serializer.dump(mock_resp).data == {
        'name': 'Ilias Koutsakis',
        'username': 'ilkoutsa',
        'id': 12,
        'email': 'ilias.koutsakis@cern.ch',
        'avatar_url': 'http://example.com',
        'profile_url': 'https://gitlab-test.cern.ch/ilkoutsa'
    }


def test_zenodo_serializer():
    mock_resp = {
        'links': {
            'communities': 'https://zenodo.org/api/communities/',
            'deposits': 'https://zenodo.org/api/deposit/depositions',
            'files': 'https://zenodo.org/api/files',
            'funders': 'https://zenodo.org/api/funders/',
            'grants': 'https://zenodo.org/api/grants/',
            'licenses': 'https://zenodo.org/api/licenses/',
            'records': 'https://zenodo.org/api/records/'
        }
    }

    serializer = ZenodoLoginSchema()
    assert serializer.dump(mock_resp).data == mock_resp


def test_orcid_serializer():
    mock_resp = {
        'orcid-identifier': {
            'host': 'orcid.org',
            'path': '0000-0003-0710-0576',
            'uri': 'https://orcid.org/0000-0003-0710-0576'
        },
        'person': {
            'emails': {
                'email': ['ilias.koutsakis@cern.ch'],
                'last-modified-date': None,
                'path': '/0000-0003-0710-0576/email'
            },
            'name': {
                'credit-name': None,
                'family-name': {'value': 'Koutsakis'},
                'given-names': {'value': 'Ilias'},
                'last-modified-date': {'value': 1562598902436},
                'path': '0000-0003-0710-0576',
                'source': None,
                'visibility': 'public'
            }
        }
    }

    serializer = OrcidLoginSchema()
    assert serializer.dump(mock_resp).data == {
        'email': ['ilias.koutsakis@cern.ch'],
        'name': 'Ilias Koutsakis',
        'orcid': {
            'id': '0000-0003-0710-0576',
            'url': 'https://orcid.org/0000-0003-0710-0576'
        }
    }

