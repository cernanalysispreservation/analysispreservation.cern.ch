{#
## This file is part of Invenio.
## Copyright (C) 2014 CERN.
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
