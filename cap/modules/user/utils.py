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

import ldap
from cachetools.func import lru_cache
from flask import current_app
from flask_login import current_user
from invenio_access.permissions import Permission, superuser_access
from invenio_accounts.models import Role, User
from invenio_oauthclient.models import RemoteAccount
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.local import LocalProxy

from .errors import DoesNotExistInLDAP

_datastore = LocalProxy(lambda: current_app.extensions['security'].datastore)


def is_super_user():
    return Permission(superuser_access).can()


def get_admin_roles_for_user(latest=True):
    """Return list of schemas user can admin."""
    from cap.modules.schemas.imp import (
        get_cached_indexed_schemas_for_user_admin,
    )

    roles = []
    schemas = get_cached_indexed_schemas_for_user_admin(
        latest=latest, user_id=current_user.id
    )

    for schema in schemas:
        roles.append(f"{schema.name}")

    return roles


USER_UI_ROLES = {
    'superuser': is_super_user,
    'schema-admin': get_admin_roles_for_user,
}


def get_user_ui_roles():
    roles = []
    for method_name, method in USER_UI_ROLES.items():
        result = method()
        if isinstance(result, bool) and result:
            roles.append(method_name)
        elif isinstance(result, list):
            for role in result:
                roles.append(f"{method_name}:{role}")
    return roles


def _query_ldap(base, query, fields):
    lc = ldap.initialize('ldap://xldap.cern.ch')
    lc.search_ext(
        base,
        ldap.SCOPE_ONELEVEL,
        query,
        fields,
        serverctrls=[
            ldap.controls.SimplePagedResultsControl(True, size=7, cookie='')
        ],
    )

    return lc.result()[1]


def get_user_mail_from_ldap(display_name):
    """Get user email from ldap, based on display name."""
    if not display_name:
        raise DoesNotExistInLDAP

    res = _query_ldap(
        base='OU=Users,OU=Organic Units,DC=cern,DC=ch',
        query='(&(cernAccountType=Primary)(displayName={}))'.format(
            display_name
        ),
        fields=['mail'],
    )

    if not res:
        parts = display_name.split(' ')
        res = _query_ldap(
            base='OU=Users,OU=Organic Units,DC=cern,DC=ch',
            query='(&(cernAccountType=Primary)(givenName={}*)(sn=*{}))'.format(
                parts[0], parts[-1]
            ),
            fields=['mail'],
        )

    if len(res) != 1:
        raise DoesNotExistInLDAP

    try:
        return res[0][1]['mail'][0].decode('utf-8')
    except (IndexError, KeyError):
        raise DoesNotExistInLDAP


def does_user_exist_in_ldap(mail):
    """Query ldap to check if user exists."""
    res = _query_ldap(
        base='OU=Users,OU=Organic Units,DC=cern,DC=ch',
        query='(&(cernAccountType=Primary)(mail={}))'.format(mail),
        fields=['mail'],
    )

    return True if res else False


def does_egroup_exist_in_ldap(mail):
    """Query ldap to check if user exists."""
    res = _query_ldap(
        base='OU=e-groups,OU=Workgroups,DC=cern,DC=ch',
        query='mail={}'.format(mail),
        fields=['mail'],
    )

    return True if res else False


def get_existing_or_register_user(mail):
    """Get user instance - if not registered, add to the db."""
    mail = mail.lower()
    try:
        user = User.query.filter_by(email=mail).one()
    except NoResultFound:
        if does_user_exist_in_ldap(mail):
            user = _datastore.create_user(email=mail, active=True)
        else:
            raise DoesNotExistInLDAP

    return user


def get_existing_or_register_role(mail):
    """Get role instance - if not registered, add to the db."""
    mail = mail.lower()
    try:
        role = Role.query.filter_by(name=mail).one()
    except NoResultFound:
        if does_egroup_exist_in_ldap(mail):
            role = _datastore.create_role(name=mail)
        else:
            raise DoesNotExistInLDAP

    return role


@lru_cache(maxsize=1024)
def get_user_email_by_id(user_id):
    user = User.query.filter_by(id=user_id).one()
    return user.email


@lru_cache(maxsize=1024)
def get_role_name_by_id(role_id):
    role = Role.query.filter_by(id=role_id).one()
    return role.name


@lru_cache(maxsize=1024)
def get_remote_account_by_id(user_id):
    cern_app_id = current_app.config.get('CERN_APP_CREDENTIALS_KEY')
    account = RemoteAccount.get(user_id=user_id, client_id=cern_app_id)

    email = account.user.email if account else get_user_email_by_id(user_id)
    profile = account.extra_data if account else {}

    if 'groups' in profile.keys():
        del profile['groups']

    return dict(email=email, profile=profile)
