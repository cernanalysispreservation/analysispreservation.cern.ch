# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2014, 2015 CERN.
#
# CERN Analysis Preservation Framework is free software: you can
# redistribute it and/or modify it under the terms of the GNU General
# Public License as published by the Free Software Foundation, either
# version 3 of the License, or (at your option) any later version.
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

from wtforms import RadioField
from wtforms.widgets import RadioInput, HTMLString
from invenio.modules.deposit.field_base import WebDepositField

__all__ = ['DataYearField']


ACCESS_RIGHTS_CHOICES = [
    ('2010', '2010'),
    ('2012', '2012'),
]


class InlineListWidget(object):
    """
    Renders a list of fields as a inline list.

    This is used for fields which encapsulate many inner fields as subfields.
    The widget will try to iterate the field to get access to the subfields and
    call them to render them.

    If `prefix_label` is set, the subfield's label is printed before the field,
    otherwise afterwards. The latter is useful for iterating radios or
    checkboxes.
    """
    def __init__(self, prefix_label=True, inline=True):
        self.prefix_label = prefix_label
        self.inline = " inline" if inline else ""

    def __call__(self, field, **kwargs):
        kwargs.setdefault('id', field.id)
        html = []
        for subfield in field:
            if self.prefix_label:
                html.append(u'<label class="%s%s">%s&nbsp;%s</label>' % (subfield.widget.input_type, self.inline, subfield.label.text, subfield()))
            else:
                html.append(u'<label class="%s%s">%s&nbsp;%s</label>' % (subfield.widget.input_type, self.inline, subfield(), subfield.label.text))
        return HTMLString(u''.join(html))


class DataYearField(WebDepositField, RadioField):
    widget = InlineListWidget(prefix_label=False, inline=False)

    def __init__(self, **kwargs):
        defaults = dict(
            choices=ACCESS_RIGHTS_CHOICES,

        )
        defaults.update(kwargs)
        super(DataYearField, self).__init__(**defaults)
