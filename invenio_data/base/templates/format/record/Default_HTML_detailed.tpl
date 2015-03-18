{#
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
#}

{% extends "format/record/Default_HTML_detailed_base.tpl" %}


{% block header %}

    <h3> {{ record.get('data_title') }} </h3>
    {% if record.get('collections.primary')[0] == 'LHCb' %}
        <h5> {{ record.get('analysis_name') }} </h5>
    {% endif %}

{% endblock %}

{% block details %}

    <div>
        {{ record.get('accelerator') }}: {{ record.get('experiment') }}
    </div>
    <div>
        {{ record.get('data_authors')|join('; ') }}
    </div>

{% endblock %}

{% block abstract %}

    <small>
    {{ record.get('data_abstract')}}
    </small>
    <br />

{% endblock %}

{% block data %}
        <br />
        {% if record.get('collections.primary')[0] == 'LHCb' %}
            {% include "format/record/lhcb_record.tpl" %}
        {% elif record.get('collections.primary')[0] == 'CMS' %}
            {% include "format/record/cms_record.tpl" %}
        {% elif record.get('collections.primary')[0] == 'ALICE' %}
            {% include "format/record/alice_record.tpl" %}
        {% endif %}

            <tr style="padding: 7px;">
                <td><h4> Publication </h4></td>
            </tr>

            <tr style="padding: 7px;">
                <td style="padding: 7px; text-align: right; font-weight:bold;"> Journal Title </td>
                <td style="padding: 7px;"> {{ record.get('journal_title') }} </td>
            </tr>

            <tr style="padding: 7px;">
                <td style="padding: 7px; text-align: right; font-weight:bold;"> Journal Year </td>
                <td style="padding: 7px;"> {{ record.get('journal_year') }} </td>
            </tr>

            <tr style="padding: 7px;">
                <td style="padding: 7px; text-align: right; font-weight:bold;"> Journal Volume </td>
                <td style="padding: 7px;"> {{ record.get('journal_volume') }} </td>
            </tr>

            <tr style="padding: 7px;">
                <td style="padding: 7px; text-align: right; font-weight:bold;"> Journal Page </td>
                <td style="padding: 7px;"> {{ record.get('journal_page') }} </td>
            </tr>

            <tr style="padding: 7px;">
                <td style="padding: 7px; text-align: right; font-weight:bold;"> arXiv ID </td>
                <td style="padding: 7px;"> {{ record.get('arxiv_id') }} </td>
            </tr>

        </table>
        </div>

{% endblock %}
