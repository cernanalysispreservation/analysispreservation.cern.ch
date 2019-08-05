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


"""CAP CERN service views."""

import ldap
from flask import jsonify, request

from cap.modules.access.utils import login_required

from . import blueprint

LDAP_USER_RESP_FIELDS = [
    'cn',
    'displayName',
    'mail',
    'memberOf',
    'company',
    'department',
    'cernAccountType',
    'objectClass'
]

LDAP_EGROUP_RESP_FIELDS = [
    'cn',
    'displayName',
    'description',
    'mail',
    'member',
    'objectClass'
]


@blueprint.route('/ldap/user/mail')
@login_required
def ldap_user_by_mail():
    """LDAP user by username query."""
    query = request.args.get('query', None)

    if not query:
        return jsonify([])

    lc = ldap.initialize('ldap://xldap.cern.ch')
    lc.search_ext(
        'OU=Users,OU=Organic Units,DC=cern,DC=ch',
        ldap.SCOPE_ONELEVEL,
        '(&(cernAccountType=Primary)(mail=*{}*))'.format(query),
        ['mail'],
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=7, cookie='')]
    )
    res = lc.result()[1]

    res = [x[1]['mail'][0] for x in res]
    return jsonify(res)


@blueprint.route('/ldap/egroup/mail')
@login_required
def ldap_egroup_mail():
    """LDAP egroup query."""
    query = request.args.get('query', None)
    sf = request.args.get('sf', 'cn')

    if not query:
        return jsonify([])

    lc = ldap.initialize('ldap://xldap.cern.ch')
    lc.search_ext(
        'OU=e-groups,OU=Workgroups,DC=cern,DC=ch',
        ldap.SCOPE_ONELEVEL,
        '{}=*{}*'.format(sf, query),
        LDAP_EGROUP_RESP_FIELDS,
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=7, cookie='')]
    )
    res = lc.result()[1]

    res = [x[1]['mail'][0] for x in res]
    return jsonify(res)


def ldap_user_by_mail_no_route(query='ilias.koutsakis@cern.ch'):
    """LDAP mail query no route."""
    url = 'ldap://xldap.cern.ch'
    lc = ldap.initialize(url)
    lc.search_ext(
        'OU=Users,OU=Organic Units,DC=cern,DC=ch', ldap.SCOPE_ONELEVEL,
        '(&(cernAccountType=Primary)(mail=*{}*))'.format(query), ['mail'],
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=7, cookie='')]
    )
    res = lc.result()[1]
    status = 'LDAP Failure'

    if len(res) >= 1:
        status = 'Success'
        res = [x[1]['mail'][0] for x in res][0]

    return url, status, res


def ldap_egroup_mail_no_route(query='sis-group-documentation'):
    """LDAP egroup query no route."""
    sf = 'cn'
    url = 'ldap://xldap.cern.ch'
    lc = ldap.initialize(url)
    lc.search_ext(
        'OU=e-groups,OU=Workgroups,DC=cern,DC=ch', ldap.SCOPE_ONELEVEL,
        '{}=*{}*'.format(sf, query), LDAP_EGROUP_RESP_FIELDS,
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=7, cookie='')]
    )
    res = lc.result()[1]
    status = 'LDAP Failure'

    if len(res) >= 1:
        status = 'Success'
        res = [x[1]['mail'][0] for x in res][0]

    return url, status, res
