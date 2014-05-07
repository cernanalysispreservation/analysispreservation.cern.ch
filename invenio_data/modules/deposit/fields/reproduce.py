# -*- coding: utf-8 -*-
##
## This file is part of Invenio.
## Copyright (C) 2012, 2013 CERN.
##
## Invenio is free software; you can redistribute it and/or
## modify it under the terms of the GNU General Public License as
## published by the Free Software Foundation; either version 2 of the
## License, or (at your option) any later version.
##
## Invenio is distributed in the hope that it will be useful, but
## WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
## General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with Invenio; if not, write to the Free Software Foundation, Inc.,
## 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.

from wtforms import SelectField
from wtforms.widgets import Select
from invenio.modules.deposit.field_base import WebDepositField
from ..field_widgets import ColumnInput

__all__ = ['ReproduceField']

def upload_processor(form, field, submit=False, fields=None):
    # ALICE
    if field.export_key == 'alice.aod_reproduce':
        if field.data == 'readme' or field.data == 'makefile':
            form.aod_reproduce_upload.flags.hidden = True
            form.aod_reproduce_upload.flags.disabled = True
        elif field.data == 'other':
            form.aod_reproduce_upload.flags.hidden = False
            form.aod_reproduce_upload.flags.disabled = False
    elif field.export_key == 'alice.custom_reproduce':
        if field.data == 'readme' or field.data == 'makefile':
            form.custom_reproduce_upload.flags.hidden = True
            form.custom_reproduce_upload.flags.disabled = True
        elif field.data == 'other':
            form.custom_reproduce_upload.flags.hidden = False
            form.custom_reproduce_upload.flags.disabled = False
    elif field.export_key == 'alice.end_reproduce':
        if field.data == 'readme' or field.data == 'makefile':
            form.end_reproduce_upload.flags.hidden = True
            form.end_reproduce_upload.flags.disabled = True
        elif field.data == 'other':
            form.end_reproduce_upload.flags.hidden = False
            form.end_reproduce_upload.flags.disabled = False
    # CMS
    elif field.export_key == 'cms.pre_reproduce':
        if field.data == 'readme' or field.data == 'makefile':
            form.pre_reproduce_upload.flags.hidden = True
            form.pre_reproduce_upload.flags.disabled = True
        elif field.data == 'other':
            form.pre_reproduce_upload.flags.hidden = False
            form.pre_reproduce_upload.flags.disabled = False
    elif field.export_key == 'cms.custom_reproduce':
        if field.data == 'readme' or field.data == 'makefile':
            form.custom_reproduce_upload.flags.hidden = True
            form.custom_reproduce_upload.flags.disabled = True
        elif field.data == 'other':
            form.custom_reproduce_upload.flags.hidden = False
            form.custom_reproduce_upload.flags.disabled = False
    elif field.export_key == 'cms.enduser_reproduce':
        if field.data == 'readme' or field.data == 'makefile':
            form.enduser_reproduce_upload.flags.hidden = True
            form.enduser_reproduce_upload.flags.disabled = True
        elif field.data == 'other':
            form.enduser_reproduce_upload.flags.hidden = False
            form.enduser_reproduce_upload.flags.disabled = False
    # LHCb
    elif field.export_key == 'lhcb.reproduce':
        if field.data == 'readme' or field.data == 'makefile':
            form.reproduce_upload.flags.hidden = True
            form.reproduce_upload.flags.disabled = True
        elif field.data == 'other':
            form.reproduce_upload.flags.hidden = False
            form.reproduce_upload.flags.disabled = False
        


class ReproduceField(WebDepositField, SelectField):
    def __init__(self, **kwargs):
        defaults = dict(icon='flag',
            widget_classes="form-control",
            choices = [('readme', ("See README")),
                   ('makefile', ("See Makefile")),
                   ('other', ("Other (please upload)"))],
            default='readme',
            processors=[
                upload_processor,
            ]
        )
        defaults.update(kwargs)
        super(ReproduceField, self).__init__(**defaults)