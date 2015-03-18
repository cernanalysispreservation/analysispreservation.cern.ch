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

from wtforms import SelectField
from invenio.modules.deposit.field_base import WebDepositField

__all__ = ['ReproduceField']


def upload_processor(form, field, submit=False, fields=None):
    # ALICE
    if field.export_key == 'aod_reproduce':
        if field.data == 'See README' or field.data == 'See Makefile':
            form.aod_reproduce_upload.flags.hidden = True
            form.aod_reproduce_upload.flags.disabled = True
        elif field.data == 'Other (please upload)':
            form.aod_reproduce_upload.flags.hidden = False
            form.aod_reproduce_upload.flags.disabled = False
    elif field.export_key == 'custom_reproduce':
        if field.data == 'See README' or field.data == 'See Makefile':
            form.custom_reproduce_upload.flags.hidden = True
            form.custom_reproduce_upload.flags.disabled = True
        elif field.data == 'Other (please upload)':
            form.custom_reproduce_upload.flags.hidden = False
            form.custom_reproduce_upload.flags.disabled = False
    elif field.export_key == 'end_reproduce':
        if field.data == 'See README' or field.data == 'See Makefile':
            form.end_reproduce_upload.flags.hidden = True
            form.end_reproduce_upload.flags.disabled = True
        elif field.data == 'Other (please upload)':
            form.end_reproduce_upload.flags.hidden = False
            form.end_reproduce_upload.flags.disabled = False
    # CMS
    elif field.export_key == 'pre_reproduce':
        if field.data == 'See README' or field.data == 'See Makefile':
            form.pre_reproduce_upload.flags.hidden = True
            form.pre_reproduce_upload.flags.disabled = True
        elif field.data == 'Other (please upload)':
            form.pre_reproduce_upload.flags.hidden = False
            form.pre_reproduce_upload.flags.disabled = False
    elif field.export_key == 'custom_reproduce':
        if field.data == 'See README' or field.data == 'See Makefile':
            form.custom_reproduce_upload.flags.hidden = True
            form.custom_reproduce_upload.flags.disabled = True
        elif field.data == 'Other (please upload)':
            form.custom_reproduce_upload.flags.hidden = False
            form.custom_reproduce_upload.flags.disabled = False
    elif field.export_key == 'end_reproduce':
        if field.data == 'See README' or field.data == 'See Makefile':
            form.enduser_reproduce_upload.flags.hidden = True
            form.enduser_reproduce_upload.flags.disabled = True
        elif field.data == 'Other (please upload)':
            form.enduser_reproduce_upload.flags.hidden = False
            form.enduser_reproduce_upload.flags.disabled = False
    # LHCb
    elif field.export_key == 'reproduce':
        if field.data == 'See README' or field.data == 'See Makefile':
            form.reproduce_upload.flags.hidden = True
            form.reproduce_upload.flags.disabled = True
        elif field.data == 'Other (please upload)':
            form.reproduce_upload.flags.hidden = False
            form.reproduce_upload.flags.disabled = False



class ReproduceField(WebDepositField, SelectField):
    def __init__(self, **kwargs):
        defaults = dict(icon='flag',
            widget_classes="form-control",
            choices = [('See README', ("See README")),
                   ('See Makefile', ("See Makefile")),
                   ('Other (please upload)', ("Other (please upload)"))],
            default='See README',
            processors=[
                upload_processor,
            ]
        )
        defaults.update(kwargs)
        super(ReproduceField, self).__init__(**defaults)
