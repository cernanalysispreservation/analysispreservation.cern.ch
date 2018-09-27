# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017 CERN.
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

"""User module utils methods."""

from flask import current_app
from werkzeug.local import LocalProxy

import ldap
from invenio_accounts.models import Role, User
from sqlalchemy.orm.exc import NoResultFound

from .errors import DoesNotExistInLDAP

_datastore = LocalProxy(
    lambda: current_app.extensions['security'].datastore
)


def get_existing_or_register_user(mail):
    """Get user instance - if not registered, add to the db."""
    try:
        user = User.query.filter_by(email=mail).one()
    except NoResultFound:
        if does_user_exist_in_ldap(mail):
            user = _datastore.create_user(email=mail,
                                          active=True)
        else:
            raise DoesNotExistInLDAP

    return user


def get_existing_or_register_role(mail):
    """Get role instance - if not registered, add to the db."""
    try:
        role = Role.query.filter_by(name=mail).one()
    except NoResultFound:
        if does_egroup_exist_in_ldap(mail):
            role = _datastore.create_role(name=mail)
        else:
            raise DoesNotExistInLDAP

    return role


def does_user_exist_in_ldap(mail):
    """Query ldap to check if user exists."""
    lc = ldap.initialize('ldap://xldap.cern.ch')

    lc.search_ext(
        'OU=Users,OU=Organic Units,DC=cern,DC=ch',
        ldap.SCOPE_ONELEVEL,
        '(&(cernAccountType=Primary)(mail={}))'.format(mail),
        ['mail'],
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=7, cookie='')]
    )

    res = lc.result()[1]

    return mail in [x[1]['mail'][0] for x in res]


def does_egroup_exist_in_ldap(mail):
    """Query ldap to check if user exists."""
    lc = ldap.initialize('ldap://xldap.cern.ch')
    lc.search_ext(
        'OU=e-groups,OU=Workgroups,DC=cern,DC=ch',
        ldap.SCOPE_ONELEVEL,
        'mail={}'.format(mail),
        ['mail'],
        serverctrls=[ldap.controls.SimplePagedResultsControl(
            True, size=7, cookie='')]
    )
    res = lc.result()[1]

    return mail in [x[1]['mail'][0] for x in res]
