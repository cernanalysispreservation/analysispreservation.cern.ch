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

"""Theme blueprint in order for template and static files to be loaded."""

from __future__ import absolute_import, print_function

import codecs
import json

import pkg_resources
from flask import Blueprint, current_app, g, jsonify, render_template, request
from flask_security import login_required
from invenio_collections.models import Collection
from py2neo import Graph

# TOFIX: To be updated when records view_.py is removed
from cap.modules.records.views_ import collection_records, get_collections_tree

from ..permissions.lhcb import lhcb_permission


lhcb_bp = Blueprint(
    'cap_lhcb',
    __name__,
    url_prefix='/LHCb',
    template_folder='templates',
    static_folder='static',
)


@lhcb_bp.before_request
@login_required
def restrict_bp_to_lhcb_members():
    g.experiment = 'LHCb'


@lhcb_bp.route('/')
@lhcb_permission.require(403)
def lhcb_landing():
    """Basic LHCb landing view."""
    collections = Collection.query.filter(
        Collection.name.in_(['LHCb'])).one().drilldown_tree()
    return render_template('lhcb/landing_page.html',
                           record_types=get_collections_tree(collections))


@lhcb_bp.route('/records')
@lhcb_permission.require(403)
def lhcb_records():
    """Basic LHCb records view."""
    return collection_records(collection=g.experiment)


@lhcb_bp.route('/analyses/short', methods=['GET', 'POST'])
@lhcb_permission.require(403)
def lhcb_analyses_short():
    title = request.args.get('title', '')

    filepath = pkg_resources.resource_filename(
        'cap.modules.experiments.scripts', '/lhcb/analyses_short.json')
    with open(filepath, 'r') as fp:
        data = json.load(fp)

    # print(data)

    analyses = data
    # print(json.dumps(data, indent=4, sort_keys=True))

    try:
        a = analyses[title]
    except:
        return jsonify({})

    return jsonify(a)


@lhcb_bp.route('/api/WG/analyses', methods=['GET', 'POST'])
@lhcb_permission.require(403)
def lhcb_analyses():
    title = request.args.get('title', '')

    return jsonify(get_lhcb_WG_analysis_by_title(title))


@lhcb_bp.route('/api/publications/', methods=['GET', 'POST'])
@lhcb_permission.require(403)
def lhcb_publications():
    title = request.args.get('title', '')

    return jsonify(get_lhcb_publications_by_ananote(title))


def get_lhcb_WG_analysis_by_title(title):
    filepath = pkg_resources.resource_filename(
        'cap.modules.experiments.scripts', '/lhcb/analyses.json')

    with codecs.open(filepath, 'r', encoding='utf8', errors='ignore') as fp:
        analyses = json.load(fp)

    try:
        a = analyses[title]
    except:
        return {}

    return a


def get_lhcb_publications_by_ananote(ananote):
    # LHCb Publications DB JSON file "LHCb_publications.json" must be placed
    # in the following path
    filepath = pkg_resources.resource_filename(
        'cap.modules.experiments.scripts', '/lhcb/LHCb_publications.json')

    with codecs.open(filepath, 'r', encoding='utf8', errors='ignore') as fp:
        analyses = json.load(fp)

    try:
        a = analyses[ananote]
    except:
        return {}

    return a


@lhcb_bp.route('/api/dependencies/platform/<app_name>/<app_version>')
@lhcb_permission.require(403)
def get_platform(app_name, app_version):
    """ Method for getting a platform name from application name """
    results = []
    url = current_app.config['GRAPHENEDB_URL']
    graph = Graph(url + '/db/data/')
    query = "MATCH (n:Application{project:{app_name}, " \
            "version:{app_version}})-[*..3]-(p:Platform) " \
            "RETURN p.platform as platform LIMIT 5"
    for num in graph.cypher.execute(query, app_name=app_name,
                                    app_version=app_version):
        results.append(num)

    return '<br/>'.join(str(x) for x in results)


@lhcb_bp.route('/api/analysis', methods=['GET', 'POST'])
@lhcb_permission.require(403)
def lhcb_analysis():
    title = request.args.get('title', '')
    ananote = request.args.get('ananote', '')
    results = {}

    internal_reports = []

    if title:
        wg = get_lhcb_WG_analysis_by_title(title)

        if "title" in wg:
            results['title'] = wg["name"]
        if "ananote" in wg:
            results['ananote'] = wg["ananote"]
        if "twiki" in wg:
            results['twiki'] = wg["twiki"]
        if "egroup" in wg:
            results['egroup'] = wg["egroup"]
        if "arxiv" in wg:
            results['arxiv'] = wg["arxiv"]
        if "status" in wg:
            results['status'] = wg["status"]
        if ("collabreport" in wg) and not (isinstance(wg["collabreport"], basestring)):
            for k, r in wg["collabreport"].iteritems():
                tmp_report = {}
                if "link" in r:
                    tmp_report['url'] = r["link"]
                if "title" in r:
                    tmp_report['title'] = r["title"]
                if "meeting" in r:
                    tmp_report['meeting'] = r["meeting"]
                internal_reports.append(tmp_report)

            results['internal_discussions'] = internal_reports
        if ("report" in wg) and not (isinstance(wg["report"], basestring)):
            for k, r in wg["report"].iteritems():
                tmp_report = {}
                if "link" in r:
                    tmp_report['url'] = r["link"]
                if "title" in r:
                    tmp_report['title'] = r["title"]
                if "meeting" in r:
                    tmp_report['meeting'] = r["meeting"]
                internal_reports.append(tmp_report)

            results['internal_discussions'] = internal_reports
        if ("presentation" in wg) and not \
           (isinstance(wg["presentation"], basestring)):
            presentations = []
            for k, r in wg["presentation"].iteritems():
                tmp_presentation = {}
                if "link" in r:
                    tmp_presentation['url'] = r["link"]
                if "title" in r:
                    tmp_presentation['title'] = r["title"]
                if "meeting" in r:
                    tmp_presentation['meeting'] = r["meeting"]
                presentations.append(tmp_presentation)

            results['presentations'] = presentations

        if "ananote" in wg:
            pubs = get_lhcb_publications_by_ananote(
                wg["ananote"])
            publications = []
            if "CDS" in pubs:
                for p in pubs['CDS']:
                    tmp_publication = {}
                    tmp_publication["url"] = p
                    if "roles" in pubs:
                        tmp_publication["roles"] = pubs["roles"]
                    if "reviewegroup" in pubs:
                        tmp_publication["reviewegroup"] = \
                            json.dumps(pubs["reviewegroup"])

                    publications.append(tmp_publication)

            results['publications'] = publications

    elif ananote:
        publications = get_lhcb_publications_by_ananote(ananote)
        if "ananote" in publications:
            wg = get_lhcb_WG_analysis_by_title(title)

    return jsonify(results)
