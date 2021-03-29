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
"""Serializer for deposit reviews."""

from __future__ import absolute_import, print_function

import requests
from flask import request
from flask_login import current_user

from invenio_deposit.api import index
from invenio_deposit.utils import mark_as_action

from cap.modules.deposit.errors import CERNBoxError
from cap.modules.deposit.permissions import UpdateDepositPermission
from cap.modules.deposit.utils import get_cernbox_creds, get_cern_common_name


class CERNBoxProvider(object):
    """Integration for CERNBox, upload files and share them."""

    def init_cernbox_storage(self):
        """
        Initialize CERNBox for use with SWAN.
        - Create a folder named after the analysis ID in CERNBox.
        - Share the folder with the analysis owner, give full permissions
        - the CERN common_name is required
        """
        username = get_cern_common_name(current_user)
        if username:
            depid = self['_deposit']['id']

            # 1. create cernbox folder
            response = self._create_folder(depid)
            if not response.ok:
                raise CERNBoxError('Could not create CERNBox folder.')

            # 2. share with current user
            response = self._share_folder(depid, 0, username, 'admin')
            if not response.ok:
                raise CERNBoxError(f'Could not share with user {username}.')

            # 3. save to deposit and update
            access = {'read': [], 'update': [], 'admin': []}
            self['_notebook'] = {
                'files': [],
                'access': {
                    'users': access,
                    'groups': access
                }
            }

    @index
    @mark_as_action
    def cernboxupload(self, pid=None):
        """Upload an existing file, to the associated CERNBox folder."""
        with UpdateDepositPermission(self).require(403):
            if request:
                data = request.get_json()
                filename = data.get('filename')
                filepath = data.get('filepath')

                # retrieve file contents
                try:
                    file_obj = self.files[filename].obj
                    file_content = open(file_obj.file.uri).read()
                except KeyError:
                    raise CERNBoxError(
                        f'File {filename} could not be found in the analysis.')

                # apply new path (optional)
                new_file = f'{filepath}/{filename}' if filepath else filename
                depid = self['_deposit']['id']

                response = self._upload_to_folder(
                    depid, new_file, file_content)
                if not response.ok:
                    raise CERNBoxError(f'Upload of {filename} failed.')

                self['_notebook']['files'].append(new_file)

            return self

    @index
    @mark_as_action
    def cernboxshare(self, pid=None):
        """Share your analysis folder, with groups/users."""
        with UpdateDepositPermission(self).require(403):
            if request:
                data = request.get_json()
                groups = data.get('groups', [])
                users = data.get('users', [])
                perm = data.get('permission')

                depid = self['_deposit']['id']

                for group in groups:
                    response = self._share_folder(depid, 1, group, perm)
                    if not response.ok:
                        raise CERNBoxError(
                            f'Could not provide {perm} permission to {group}.')
                    self['_notebooks']['access']['groups'][perm].append(group)

                for user in users:
                    response = self._share_folder(depid, 0, user, perm)
                    if not response.ok:
                        raise CERNBoxError(
                            f'Could not provide {perm} permission to {user}.')
                    self['_notebooks']['access']['users'][perm].append(user)

            return self

    @index
    @mark_as_action
    def cernboxdelete(self, pid=None):
        """Share your analysis folder, with groups/users."""
        with UpdateDepositPermission(self).require(403):
            if request:
                data = request.get_json()
                path = data.get('permission')

                depid = self['_deposit']['id']
                path = f'{depid}/{path}'

                response = self._delete_folder(path)
                if not response.ok:
                    raise CERNBoxError(f'Could not delete {path}.')
                # need to delete files as well, need to think about that
                # files - folders, how to handle?
                # maybe save them differently? tree structure?
            return self

    def _create_folder(self, depid):
        """Create a folder in CERNBox, named after the current analysis."""
        host, user, password, auth = get_cernbox_creds()
        response = requests.request(
            'MKCOL',
            url=f'{host}/remote.php/dav/files/{user}/{depid}',
            auth=auth
        )
        return response

    def _upload_to_folder(self, depid, new_file, file_content):
        """Upload a file to CERNBox."""
        host, user, password, auth = get_cernbox_creds()
        response = requests.put(
            url=f'{host}/remote.php/dav/files/{user}/{depid}/{new_file}',
            data=file_content,
            auth=auth,
            headers={'Content-Type': 'application/octet-stream'}
        )
        return response

    def _share_folder(self, depid, _type, _with, perm):
        """
        Share request for users/groups, providing specific permissions.
        more info: https://doc.owncloud.org/server/9.0/developer_manual/core/ocs-share-api.html  # noqa
        Important: shareType: 0 for users, 1 for groups
                   permissions: 1-read, 2-update, 31-admin
        """
        host, _, _, auth = get_cernbox_creds()
        permissions = {
            'read': 1,
            'update': 2,
            'admin': 31
        }

        response = requests.post(
            url=f'{host}/ocs/v2.php/apps/files_sharing/api/v1/shares?format=json',  # noqa
            data={
                "shareType": _type,
                "shareWith": _with,
                "permissions": permissions[perm],
                "path": f'/{depid}'
            },
            auth=auth
        )
        return response

    def _delete_folder(self, path):
        host, user, password, auth = get_cernbox_creds()
        response = requests.delete(
            url=f'{host}/remote.php/dav/files/{user}/{path}',
            auth=auth
        )
        return response
