# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2018 CERN.
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


"""CAP CERN services status checks responses, used for testing."""

from __future__ import absolute_import, print_function

orcid_name = {
    u'num-found': 1,
    u'result': [{
        u'orcid-identifier':
            {u'path': u'0000-0003-0710-0576',
             u'host': u'orcid.org',
             u'uri': u'https://orcid.org/0000-0003-0710-0576'}
    }]
}

orcid_id = {u'preferences': {u'locale': u'EN'},
            u'orcid-identifier': {
                u'path': u'0000-0003-0710-0576', u'host': u'orcid.org',
                u'uri': u'https://orcid.org/0000-0003-0710-0576'},
            u'person': {
                u'name': {
                    u'credit-name': None, u'family-name': {u'value': u'Koutsakis'},
                    u'last-modified-date':
                        {u'value': 1562598902436}, u'created-date': {u'value': 1562598902198},
                    u'visibility': u'PUBLIC', u'source': None, u'given-names': {u'value': u'Ilias'},
                    u'path': u'0000-0003-0710-0576'}, u'last-modified-date': None,
                u'researcher-urls': {u'researcher-url': [], u'path': u'/0000-0003-0710-0576/researcher-urls',
                                     u'last-modified-date': None},
                u'other-names': {u'other-name': [], u'path': u'/0000-0003-0710-0576/other-names',
                                 u'last-modified-date': None},
                u'keywords': {u'path': u'/0000-0003-0710-0576/keywords', u'keyword': [], u'last-modified-date': None},
                u'path': u'/0000-0003-0710-0576/person',
                u'external-identifiers': {u'path': u'/0000-0003-0710-0576/external-identifiers',
                                          u'external-identifier': [],
                                          u'last-modified-date': None},
                u'emails': {u'path': u'/0000-0003-0710-0576/email', u'email': [], u'last-modified-date': None},
                u'biography': None,
                u'addresses': {u'path': u'/0000-0003-0710-0576/address', u'address': [], u'last-modified-date': None}},
            u'activities-summary': {u'last-modified-date': {u'value': 1562599078232},
                                    u'educations': {u'path': u'/0000-0003-0710-0576/educations', u'education-summary': [
                                        {u'department-name': u'Information Studies - Data Science',
                                         u'put-code': 8217374,
                                         u'start-date': {u'month': None, u'day': None, u'year': {u'value': u'2016'}},
                                         u'last-modified-date': {u'value': 1562599078232},
                                         u'created-date': {u'value': 1562599078232}, u'visibility': u'PUBLIC',
                                         u'source': {
                                             u'source-orcid': {u'path': u'0000-0003-0710-0576', u'host': u'orcid.org',
                                                               u'uri': u'https://orcid.org/0000-0003-0710-0576'},
                                             u'source-name': {u'value': u'Ilias Koutsakis'}, u'source-client-id': None},
                                         u'path': u'/0000-0003-0710-0576/education/8217374', u'organization': {
                                            u'disambiguated-organization': {
                                                u'disambiguated-organization-identifier': u'grid.7177.6',
                                                u'disambiguation-source': u'GRID'}, u'name': u'University of Amsterdam',
                                            u'address': {u'city': u'Amsterdam', u'region': u'Noord-Holland',
                                                         u'country': u'NL'}},
                                         u'end-date': {u'month': None, u'day': None, u'year': {u'value': u'2017'}},
                                         u'role-title': u'M.Sc.'},
                                        {u'department-name': u'Informatics and Telecommunications',
                                         u'put-code': 8217364,
                                         u'start-date': {u'month': None, u'day': None, u'year': {u'value': u'2008'}},
                                         u'last-modified-date': {u'value': 1562599025129},
                                         u'created-date': {u'value': 1562599025129}, u'visibility': u'PUBLIC',
                                         u'source': {
                                             u'source-orcid': {u'path': u'0000-0003-0710-0576', u'host': u'orcid.org',
                                                               u'uri': u'https://orcid.org/0000-0003-0710-0576'},
                                             u'source-name': {u'value': u'Ilias Koutsakis'}, u'source-client-id': None},
                                         u'path': u'/0000-0003-0710-0576/education/8217364', u'organization': {
                                            u'disambiguated-organization': {
                                                u'disambiguated-organization-identifier':
                                                    u'http://dx.doi.org/10.13039/501100005187',
                                                u'disambiguation-source': u'FUNDREF'},
                                            u'name': u'National and Kapodistrian University of Athens',
                                            u'address': {u'city': u'Athens', u'region': None, u'country': u'GR'}},
                                         u'end-date': {u'month': None, u'day': None, u'year': {u'value': u'2016'}},
                                         u'role-title': u'B.Sc.'}], u'last-modified-date': {u'value': 1562599078232}},
                                    u'fundings': {u'path': u'/0000-0003-0710-0576/fundings', u'group': [],
                                                  u'last-modified-date': None},
                                    u'path': u'/0000-0003-0710-0576/activities',
                                    u'employments': {u'path': u'/0000-0003-0710-0576/employments',
                                                     u'employment-summary': [], u'last-modified-date': None},
                                    u'works': {u'path': u'/0000-0003-0710-0576/works', u'group': [],
                                               u'last-modified-date': None},
                                    u'peer-reviews': {u'path': u'/0000-0003-0710-0576/peer-reviews', u'group': [],
                                                      u'last-modified-date': None}}, u'path': u'/0000-0003-0710-0576',
            u'history': {u'deactivation-date': None, u'source': None, u'creation-method': u'DIRECT',
                         u'submission-date': {u'value': 1562598902198},
                         u'last-modified-date': {u'value': 1562617266409}, u'verified-primary-email': True,
                         u'verified-email': True, u'completion-date': None, u'claimed': True}}

zenodo = {u'files': [{u'links': {
    u'self': u'https://zenodo.org/api/files/59bd9652-ee05-4cbc-a755-7f050ca9b1b1/2019-WangYe-ACSAMI-raw-data.7z'},
    u'checksum': u'md5:85a8117dfd0a95345e58e1e7d841c31a',
    u'bucket': u'59bd9652-ee05-4cbc-a755-7f050ca9b1b1', u'key': u'2019-WangYe-ACSAMI-raw-data.7z',
    u'type': u'7z', u'size': 416918641}], u'owners': [24678], u'doi': u'10.5281/zenodo.3243963',
    u'stats': {u'version_unique_downloads': 25.0, u'unique_views': 277.0, u'views': 347.0, u'downloads': 33.0,
               u'unique_downloads': 25.0, u'version_unique_views': 274.0, u'volume': 13758315153.0,
               u'version_downloads': 33.0, u'version_views': 343.0, u'version_volume': 13758315153.0},
    u'links': {u'doi': u'https://doi.org/10.5281/zenodo.3243963',
               u'conceptdoi': u'https://doi.org/10.5281/zenodo.3243962',
               u'self': u'https://zenodo.org/api/records/3243963',
               u'bucket': u'https://zenodo.org/api/files/59bd9652-ee05-4cbc-a755-7f050ca9b1b1',
               u'conceptbadge': u'https://zenodo.org/badge/doi/10.5281/zenodo.3243962.svg',
               u'html': u'https://zenodo.org/record/3243963',
               u'latest_html': u'https://zenodo.org/record/3243963',
               u'badge': u'https://zenodo.org/badge/doi/10.5281/zenodo.3243963.svg',
               u'latest': u'https://zenodo.org/api/records/3243963'}, u'conceptdoi': u'10.5281/zenodo.3243962',
    u'created': u'2019-07-02T08:59:01.862420+00:00', u'updated': u'2019-07-02T19:05:45.898884+00:00',
    u'conceptrecid': u'3243962', u'revision': 3, u'id': 3243963,
    u'metadata': {u'access_right_category': u'success', u'doi': u'10.5281/zenodo.3243963',
                  u'description': u'<p>Raw research data supporting the publication:</p>\n\n<p>Wang Y. et al., 2019, '
                                  u'ACS Applied Materials and Interfaces, DOI: 10.1021/acsami.9b04663</p>',
                  u'license': {u'id': u'CC-BY-4.0'},
                  u'title': u'Research data supporting "Rolling Circle Transcription-Amplified Hierarchically '
                            u'Structured Organic-Inorganic Hybrid RNA Flowers for Enzyme Immobilization""',
                  u'relations': {u'version': [{u'count': 1, u'index': 0, u'is_last': True,
                                               u'last_child': {u'pid_type': u'recid', u'pid_value': u'3243963'},
                                               u'parent': {u'pid_type': u'recid', u'pid_value': u'3243962'}}]},
                  u'communities': [{u'id': u'zenodo'}], u'publication_date': u'2019-06-19',
                  u'creators': [{u'affiliation': u'Imperial College London, UK', u'name': u'Wang, Y.'},
                                {u'affiliation': u'Imperial College London, UK', u'name': u'Kim. E.'},
                                {u'affiliation': u'Imperial College London, UK', u'name': u'Lin, Y.'},
                                {u'affiliation': u'Imperial College London, UK', u'name': u'Kim, N.'},
                                {u'affiliation': u'Imperial College London, UK', u'name': u'Kit-Anan, W.'},
                                {u'affiliation': u'Imperial College London, UK', u'name': u'Gopal, S.'},
                                {u'affiliation': u'Imperial College London, UK', u'name': u'Agarwal, S.'},
                                {u'affiliation': u'Imperial College London, UK', u'name': u'Howes, P.'},
                                {u'affiliation': u'Imperial College London, UK', u'name': u'Stevens, M.'}],
                  u'access_right': u'open', u'resource_type': {u'type': u'dataset', u'title': u'Dataset'},
                  u'related_identifiers': [{u'scheme': u'doi', u'identifier': u'10.1021/acsami.9b04663',
                                            u'relation': u'isSupplementTo'},
                                           {u'scheme': u'doi', u'identifier': u'10.5281/zenodo.3243962',
                                            u'relation': u'isVersionOf'}]}}

ldap_mail = (101, [('CN=ilkoutsa,OU=Users,OU=Organic Units,DC=cern,DC=ch', {'mail': ['ilias.koutsakis@cern.ch']})])

ldap_egroup = (101, [('CN=sis-group-documentation,OU=e-groups,OU=Workgroups,DC=cern,DC=ch',
                      {'displayName': ['sis-group-documentation (Access to the RCS-SIS Group documentation)'],
                       'description': ['Access to the RCS-SIS Group documentation'], 'objectClass': ['top', 'group'],
                       'member': ['CN=inspire-experts,OU=e-groups,OU=Workgroups,DC=cern,DC=ch',
                                  'CN=rcs-dep-sis-complete,OU=e-groups,OU=Workgroups,DC=cern,DC=ch'],
                       'mail': ['sis-group-documentation@cern.ch'], 'cn': ['sis-group-documentation']})])

cms_cadi = {
    'status': u'PUB',
    'publication_status': u'Free',
    'pas': u'http://cms.cern.ch:80/iCMS/analysisadmin/get?analysis=EXO-17-023-pas-v1.pdf',
    'name': u'Search for Black Holes and Sphalerons',
    'created': u'03/10/2017',
    'paper': u'http://cms.cern.ch:80/iCMS/analysisadmin/get?analysis=EXO-17-023-paper-v27.pdf',
    'contact': u'Ka Hei Martin Kwok (BROWN-UNIV)',
    'twiki': u'https://twiki.cern.ch/twiki/bin/view/CMS/EXO17023',
    'description': u'Search for Black Holes and Sphalerons (full 2016 data)'}

atlas_glance = {u'count': 1, u'links': [
    {u'href': u'https://oraweb.cern.ch/ords/atlr/atlas_authdb/atlas/analysis/analysis/?client_name=cap&id=225',
     u'rel': u'self'},
    {u'href': u'https://oraweb.cern.ch/ords/atlr/atlas_authdb/metadata-catalog/atlas/analysis/analysis/',
     u'rel': u'describedby'}], u'items': [{u'status': u'phase0_closed', u'gitlab_projects': [{u'group_id': 14349,
                                                                                              u'link': u'https://gitlab.cern.ch/atlas-physics-office/EXOT/ANA-EXOT-2018-01/ANA-EXOT-2018-01-INT1'},
                                                                                             {u'group_id': 14349,
                                                                                              u'link': u'https://gitlab.cern.ch/atlas-physics-office/EXOT/ANA-EXOT-2018-01/ANA-EXOT-2018-01-CONF'}],
                                           u'phase0': [{
                                               u'model_tested': u"-Benchmark model used:\r\nZ'-2HDM : https://arxiv.org/abs/1402.7074\r\nMC production documented here: https://its.cern.ch/jira/browse/ATLMCPROD-5422\r\nModel Independent Limits also to be provided, similar to the previous result:\r\nhttps://atlas.web.cern.ch/Atlas/GROUPS/PHYSICS/PAPERS/EXOT-2016-25/tab_02.png",
                                               u'main_physics_aim': u'Search for new physics in the signature of H->bb and MET. Motivated by Dark Matter models but also want to produce reinterpretable limits. Higgs reconstruction is done in boosted/merged regime and resolved regime. \r\nNon-physics goal: Include 2017 data to validate release 21 reconstruction and understand 2017 data conditions (high mu)',
                                               u'dataset_used': u'2015-2017 with release 21',
                                               u'methods': u'Previous analysis was EXOT-2016-25 .\r\n\r\n* Planned CP Techniques (beyond standard object reconstruction/selection):\r\nBoth Large-R and small-R jet reconstruction ,\r\ncorrections for semi-leptonic b-hadron decays,\r\nVariable Radius track jet b-tagging,\r\nMET significance (object based)\r\n \r\nPlanned Analysis Techniques:\r\nCombined likelihood fit for background estimation from Monte Carlo with\r\nseveral exclusive signal and control region selections.'}],
                                           u'pub_short_title': u'MET + H->bb search 13 TeV 2017',
                                           u'short_title': u'JDM - mono-H(bb) 2017',
                                           u'creation_date': u'2018-02-05T15:43:48Z',
                                           u'full_title': u'Search for Dark Matter Produced in Association with a Higgs Boson Decaying to $b\\bar{b}$ using 36 fb$^{-1}$ of pp collisions at $\\sqrt{s}=13$ TeV with the ATLAS Detector',
                                           u'refcode': u'ANA-EXOT-2018-01', u'id': 225}], u'hasMore': False,
                u'offset': 0, u'limit': 0}

github = {}
gitlab = {u'error': u'404 Not Found'}
indico = {
  "count": 1,
  "additionalInfo": {},
  "_type": "HTTPAPIResult",
  "url": "https://indico.cern.ch/export/event/845049.json",
  "results": [
    {
      "folders": [
        {
          "_type": "folder",
          "attachments": [
            {
              "_type": "attachment",
              "description": "",
              "content_type": "image/png",
              "id": 3136666,
              "size": 2294221,
              "modified_dt": "2019-08-30T14:30:46.031039+00:00",
              "title": "img_2.png",
              "download_url": "https://indico.cern.ch/event/845049/attachments/1900364/3136666/img_2.png",
              "filename": "img_2.png",
              "is_protected": False,
              "type": "file"
            }
          ],
          "title": None,
          "is_protected": False,
          "default_folder": True,
          "id": 1900364,
          "description": ""
        },
        {
          "_type": "folder",
          "attachments": [],
          "title": "another folder",
          "is_protected": False,
          "default_folder": False,
          "id": 1900363,
          "description": "another folder for stuff"
        },
        {
          "_type": "folder",
          "attachments": [],
          "title": "materials_folder",
          "is_protected": False,
          "default_folder": False,
          "id": 1900362,
          "description": "this folder has materials"
        }
      ],
      "startDate": {
        "date": "2019-08-30",
        "tz": "Europe/Zurich",
        "time": "17:00:00"
      },
      "_type": "Conference",
      "hasAnyProtection": False,
      "endDate": {
        "date": "2019-08-30",
        "tz": "Europe/Zurich",
        "time": "19:00:00"
      },
      "description": "<p>this is the description stuff</p>",
      "roomMapURL": "https://maps.cern.ch/mapsearch/mapsearch.htm?n=['4/2-037']",
      "creator": {
        "affiliation": "",
        "_type": "Avatar",
        "last_name": "Koutsakis",
        "emailHash": "514487040d28517d3c94700dd987e10e",
        "_fossil": "conferenceChairMetadata",
        "fullName": "Koutsakis, Ilias",
        "first_name": "Ilias",
        "id": "77851"
      },
      "material": [],
      "visibility": {
        "id": "",
        "name": "Everywhere"
      },
      "roomFullname": "4/2-037 - TH meeting room",
      "references": [
        {
          "url": None,
          "urn": None,
          "type": "Local",
          "value": "localID"
        },
        {
          "url": "https://edms.cern.ch/document/edmsID",
          "urn": None,
          "type": "EDMS",
          "value": "edmsID"
        }
      ],
      "address": "Address Adressington 13, Geneva",
      "timezone": "Europe/Zurich",
      "creationDate": {
        "date": "2019-08-30",
        "tz": "Europe/Zurich",
        "time": "16:27:13.211866"
      },
      "id": "845049",
      "category": "TEST Category",
      "room": "4/2-037",
      "title": "test_folders",
      "url": "https://indico.cern.ch/event/845049/",
      "note": {},
      "chairs": [
        {
          "person_id": 4676217,
          "affiliation": "CERN",
          "_type": "ConferenceChair",
          "last_name": "Fokianos",
          "db_id": 770812,
          "emailHash": "0bc625725a7099d0e24b738432077ba2",
          "_fossil": "conferenceChairMetadata",
          "fullName": "Fokianos, Pamfilos",
          "first_name": "Pamfilos",
          "id": "770812"
        },
        {
          "person_id": 4676216,
          "affiliation": "",
          "_type": "ConferenceChair",
          "last_name": "Koutsakis",
          "db_id": 770811,
          "emailHash": "514487040d28517d3c94700dd987e10e",
          "_fossil": "conferenceChairMetadata",
          "fullName": "Mr Koutsakis, Ilias",
          "first_name": "Ilias",
          "id": "770811"
        }
      ],
      "location": "CERN",
      "_fossil": "conferenceMetadata",
      "type": "meeting",
      "categoryId": 2
    }
  ],
  "ts": 1567417389
}
ror = {"id": "https://ror.org/05a28rw58",
       "name": "Swiss Federal Institute of Technology in Zurich",
       "types": ["Education"], "links": ["https://www.ethz.ch/en.html"],
       "aliases": ["ETH Zurich"], "acronyms": [],
       "wikipedia_url": "http://en.wikipedia.org/wiki/ETH_Zurich",
       "labels": [{"label": "Politecnico federale di Zurigo", "iso639": "it"},
                  {"label": "École polytechnique fédérale de zurich", "iso639": "fr"},
                  {"label": "Eidgenössische Technische Hochschule Zürich", "iso639": "de"}],
       "country": {"country_name": "Switzerland", "country_code": "CH"},
       "external_ids": {"ISNI": {"preferred": None, "all": ["0000 0001 2156 2780"]},
                        "FundRef": {"preferred": "501100003006", "all": ["501100003006", "501100003070", "501100001710"]},
                        "OrgRef": {"preferred": None, "all": ["210910"]},
                        "Wikidata": {"preferred":None, "all": ["Q11942"]},
                        "GRID": {"preferred": "grid.5801.c", "all": "grid.5801.c"}}}
