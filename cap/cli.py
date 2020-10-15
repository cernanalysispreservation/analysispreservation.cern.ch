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

"""CAP base Invenio configuration."""

from __future__ import absolute_import, print_function
from click import Option, UsageError
from invenio_base.app import create_cli

from cap.factory import create_api


class MutuallyExclusiveOption(Option):
    """
    Class that allows the use of mutually exclusive arguments in cli commands.
    """
    def __init__(self, *args, **kwargs):
        self.mutually_exclusive = set(kwargs.pop('mutually_exclusive', []))
        self.help = kwargs.get('help', '')

        if self.mutually_exclusive:
            self.exclusives = ', '.join(self.mutually_exclusive)
            kwargs['help'] = f'{self.help} NOTE: This argument is mutually ' \
                             f'exclusive with arguments: [{self.exclusives}].'

        super(MutuallyExclusiveOption, self).__init__(*args, **kwargs)

    def handle_parse_result(self, ctx, opts, args):
        if self.mutually_exclusive.intersection(opts) and self.name in opts:
            raise UsageError(f'Illegal usage: `{self.name}` is mutually '
                             f'exclusive with arguments [{self.exclusives}].')

        return super(MutuallyExclusiveOption, self).\
            handle_parse_result(ctx, opts, args)


cli = create_cli(create_app=create_api)
