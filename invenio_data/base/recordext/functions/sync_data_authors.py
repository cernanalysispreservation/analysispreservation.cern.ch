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

from invenio.modules.jsonalchemy.jsonext.functions.util_merge_fields_info_list \
    import util_merge_fields_info_list


def sync_data_authors(self, field_name, connected_field, action):  # pylint: disable=W0613
    """Sync authors content only when `__setitem__` or similar is used"""
    if action == 'set':
        if field_name == 'data_authors' and self.get('data_authors'):
            self.__setitem__('_data_first_author', self['data_authors'][0],
                             exclude=['connect'])
            if self['data_authors'][1:]:
                self.__setitem__('_data_additional_authors', self['data_authors'][1:],
                                 exclude=['connect'])
        elif field_name in ('_data_first_author', '_data_additional_authors'):
            self.__setitem__(
                'data_authors',
                util_merge_fields_info_list(self, ['_data_first_author',
                                            '_data_additional_authors']),
                exclude=['connect'])
