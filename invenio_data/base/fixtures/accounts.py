# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2014, 2015 CERN.
#
# CERN Analysis Preservation Framework is free software; you can
# redistribute it and/or modify it under the terms of the GNU General
# Public License as published by the Free Software Foundation; either
# version 2 of the License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that
# it will be useful, but WITHOUT ANY WARRANTY; without even the
# implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
# PURPOSE.  See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this software; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307,
# USA.

"""Accounts fixture."""

from fixture import DataSet

from flask import current_app

from invenio_groups.models import PrivacyPolicy, SubscriptionPolicy


class UserData(DataSet):

    """User data."""

    class admin:
        id = 1
        email = current_app.config.get('CFG_SITE_ADMIN_EMAIL')
        password = ''
        note = '1'
        nickname = 'admin'

    class marco:
        id = 2
        email = 'javier.delgado.fernandez@cern.ch'
        password = ''
        note = '1'
        nickname = 'jadelgad'

    class pamfilos:
        id = 3
        email = 'pamfilos.fokianos@cern.ch'
        password = ''
        note = '1'
        nickname = 'pfokiano'

    class tibor:
        id = 4
        email = 'tibor.simko@cern.ch'
        password = ''
        note = '1'
        nickname = 'simko'


class GroupData(DataSet):

    """Group dataset class."""

    class support:
        id = 1
        name = 'analysis-preservation-support'
        description = 'CERN Analysis Preservation Support Team'
        is_managed = True
        privacy_policy = PrivacyPolicy.PUBLIC
        subscription_policy = SubscriptionPolicy.CLOSED

    class development:
        id = 2
        name = 'analysis-preservation-development'
        description = 'People involved with the development of the CERN Analysis Preservation Platform'
        is_managed = True
        privacy_policy = PrivacyPolicy.MEMBERS
        subscription_policy = SubscriptionPolicy.CLOSED

    class cms:
        id = 3
        name = 'cms-members'
        description = 'All CMS Members'
        is_managed = True
        privacy_policy = PrivacyPolicy.ADMINS
        subscription_policy = SubscriptionPolicy.CLOSED


__all__ = (
    'UserData',
    'GroupData',
)
