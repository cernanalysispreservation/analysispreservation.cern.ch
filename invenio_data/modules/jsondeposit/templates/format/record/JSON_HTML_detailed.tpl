{#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2015 CERN.
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

{% extends "format/record/Default_HTML_detailed.tpl" %}

{% block details %}
   <script src='http://localhost:8080/jsoneditor.js'></script>
    <div class="jsonrecord" data-id="{{ record._id }}" data-schema="{{ record.get('$schema') }}">
      <div class="jsonrecord-loading well well-lg"><i class="fa fa-spinner fa-spin"></i> {{ _('Loading') }}</div>
      <div id="jsonrecord-{{ record._id }}-rendered" class="jsonrecord-rendered"></div>
      <textarea id="{{ record._id }}" class="jsonrecord-blob" name="{{ record._id }}">{{ record | tojson | safe }}</textarea>
    </div>
    <div class="panel panel-default jsonrecord-metadata">
      <div class="panel-heading">
        <h3 class="panel-title">{{ _('Metadata') }}</h3>
      </div>
      <div class="row panel-body">
        <div class="col-md-2">{{ _('ID') }}:</div>
        <div class="col-md-10">{{ record._id }}</div>
        <div class="col-md-2">{{ _('Schema') }}:</div>
        <div class="col-md-10"><a href="{{ url_for('schema.index') }}#{{ record.get('$schema') }}">{{ record.get('$schema') }}</a></div>
        <div class="col-md-2">{{ _('Created') }}:</div>
        <div class="col-md-10">{{ record.creation_date }}</div>
        <div class="col-md-2">{{ _('Modified') }}:</div>
        <div class="col-md-10">{{ record.modification_date }}</div>
      </div>
    </div>
{% endblock %}
