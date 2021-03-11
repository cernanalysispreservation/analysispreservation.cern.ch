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

from __future__ import absolute_import, print_function


def oauth_extra_data_serializer(resource):
    """Serializer for Oauthclient extra_data resources."""
    data = {
        'common_name': resource.get('CommonName', [None])[0],
        'first_name': resource.get('Firstname', [None])[0],
        'last_name': resource.get('Lastname', [None])[0],
        'display_name': resource.get('DisplayName', [None])[0],

        'building': resource.get('Building', [None])[0],
        'department': resource.get('Department', [None])[0],
        'person_id': resource.get('PersonID', [None])[0],
        'identity_class': resource.get('IdentityClass', [None])[0],
    }

    return {
        k: v
        for k, v in data.items()
        if v is not None
    }
