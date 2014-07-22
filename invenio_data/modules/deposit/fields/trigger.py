# -*- coding: utf-8 -*-
#
## This file is part of ZENODO.
## Copyright (C) 2012, 2013 CERN.
##
## ZENODO is free software: you can redistribute it and/or modify
## it under the terms of the GNU General Public License as published by
## the Free Software Foundation, either version 3 of the License, or
## (at your option) any later version.
##
## ZENODO is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
## GNU General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with ZENODO. If not, see <http://www.gnu.org/licenses/>.
##
## In applying this licence, CERN does not waive the privileges and immunities
## granted to it by virtue of its status as an Intergovernmental Organization
## or submit itself to any jurisdiction.

from wtforms import RadioField
from wtforms.widgets import RadioInput, HTMLString
from invenio.modules.deposit.field_base import WebDepositField

__all__ = ['TriggerField']


TRIGGERS = [
    ('L0', 'L0'),
    ('HTL1', 'HTL1'),
    ('HTL2', 'HTL2')
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


class TriggerField(WebDepositField, RadioField):
    widget = InlineListWidget(prefix_label=False, inline=False)

    def __init__(self, **kwargs):
        defaults = dict(
            choices=TRIGGERS,

        )
        defaults.update(kwargs)
        super(TriggerField, self).__init__(**defaults)