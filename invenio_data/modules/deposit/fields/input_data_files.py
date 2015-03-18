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

from wtforms import RadioField
from wtforms.widgets import RadioInput, HTMLString
from invenio.modules.deposit.field_base import WebDepositField

__all__ = ['InputDataFilesField']


CHOICES = [
    ('AOD Primary Data Sets', 'AOD Primary Data Sets'),
    ('Taken from output of previous analysis step', 'Taken from output of previous analysis step'),
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


class IconRadioInput(RadioInput):
    """
    Render a single radio button with icon.

    This widget is most commonly used in conjunction with ListWidget or some
    other listing, as singular radio buttons are not very useful.
    """
    input_type = 'radio'

    def __init__(self, icons={}, **kwargs):
        self.choices_icons = icons
        super(IconRadioInput, self).__init__(**kwargs)

    def __call__(self, field, **kwargs):
        if field.checked:
            kwargs['checked'] = u'checked'

        html = super(IconRadioInput, self).__call__(field, **kwargs)
        icon = self.choices_icons.get(field._value(), '')
        if icon:
            html = '%s&nbsp;<i class="%s"></i>' % (html, icon)
        return html


class InputDataFilesField(WebDepositField, RadioField):
    widget = InlineListWidget(prefix_label=False, inline=False)

    def __init__(self, **kwargs):
        defaults = dict(
            label='Input Data Files',
            choices=CHOICES,
            default='Taken from output of previous analysis step',
        )
        defaults.update(kwargs)
        super(InputDataFilesField, self).__init__(**defaults)
