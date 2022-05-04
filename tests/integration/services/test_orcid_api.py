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
"""Integration tests for user views."""
import responses


def test_get_orcid_when_name_not_present_returns_400(client, auth_headers_for_superuser):
    resp = client.get("/services/orcid",
                      headers=auth_headers_for_superuser)

    assert resp.json['message'] == 'name parameter not found.'


@responses.activate
def test_get_orcid_when_no_results_for_given_name_returns_empty_object(
        client, auth_headers_for_superuser):
    orcid_resp = {"num-results": 0, "result": []}

    responses.add(
        responses.GET,
        "https://pub.orcid.org/v2.1/search/?"
        "q=given-names:some+AND+family-name:name",
        json=orcid_resp,
        status=200,
    )

    resp = client.get("/services/orcid?name=some%20name",
                      headers=auth_headers_for_superuser)

    assert resp.json == {}


@responses.activate
def test_get_orcid_when_multiple_results_for_given_name_returns_empty_object(
        client, auth_headers_for_superuser):

    orcid_resp = {
        "num-results": 2,
        "result": [
            {
                "orcid-identifier": {
                    "path": "0000-0002-2341-2132"
                }
            },
            {
                "orcid-identifier": {
                    "path": "0000-0002-2341-2132"
                }
            },
        ],
    }
    responses.add(
        responses.GET,
        "https://pub.orcid.org/v2.1/search/?"
        "q=given-names:some+AND+family-name:name",
        json=orcid_resp,
        status=200,
    )

    resp = client.get("/services/orcid?name=some%20name",
                      headers=auth_headers_for_superuser)

    assert resp.json == {}


@responses.activate
def test_get_orcid_when_exactly_one_results_returns_orcid_path(
        client, auth_headers_for_superuser):

    orcid_resp = {
        "num-results": 1,
        "result": [{
            "orcid-identifier": {
                "path": "0000-0002-2341-2132"
            }
        }],
    }

    responses.add(
        responses.GET,
        "https://pub.orcid.org/v2.1/search/?"
        "q=given-names:some+AND+family-name:name",
        json=orcid_resp,
        status=200,
    )

    resp = client.get("/services/orcid?name=some%20name",
                      headers=auth_headers_for_superuser)

    assert resp.json == {"orcid": "0000-0002-2341-2132"}
