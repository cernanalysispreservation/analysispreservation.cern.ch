# -*- coding: utf-8 -*-
##
## This file is part of Invenio.
## Copyright (C) 2013, 2014 CERN.
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

from wtforms import TextField
from invenio.modules.deposit.field_base import WebDepositField

__all__ = ['McBkPathField']


def autofill(form, field, submit=False, fields=None):
    """ Autofills reconstruction & stripping SW  versions"""

    mc_bk_path = field.data.lower()

    if 'stripping' in mc_bk_path:
        form.mc_stripping_sw.version.data = \
            str(mc_bk_path.split('stripping', 1)[1][:2])
    else:
        form.stripping_sw.version.data = None

    if 'reco' in mc_bk_path:
        length = len(str(mc_bk_path.split('reco', 1)[1]).split('/', 1)[0])
        form.mc_reconstruction_sw.version.data =\
            str(mc_bk_path.split('reco', 1)[1][:length])


class McBkPathField(WebDepositField, TextField):
    def __init__(self, **kwargs):
        defaults = dict(
            icon='fa fa-link fa-fw',
            export_key='mcbkpath',
            widget_classes="form-control",
            processors=[autofill]
        )
        defaults.update(kwargs)
        super(McBkPathField, self).__init__(**defaults)
