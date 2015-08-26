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

{% extends "format/record/Default_HTML_brief.tpl" %}


{% block record_header %}
  <a href="{{ url_for('record.metadata', recid=record['recid']) }}">{{ _('Record') }} #{{record._id}}</a>
{% endblock %}

{% block record_info %}
  <div class="jsonfingerprint-metacontainer">
    <div class="jsonfingerprint-container" data-toggle="popover" data-trigger="hover" data-delay="200" data-html="true" title="{{ _('Fingerprint') }}" data-content="{{ _('Shows a visual fingerprint of the record.')}}<br />{{ _('Makes it easier to compare the similarity of multiple documents.') }}">
      <i class="fa fa-th fa-fw"></i> <canvas class="jsonfingerprint" data-blob="recordbrief-{{ record._id }}"></canvas><br />
    </div>
  </div>
  <i class="fa fa-cube fa-fw"></i>  <a href="{{ url_for('schema.index') }}#{{ record.get('$schema') }}">{{ record.get('$schema') }}</a>
{% endblock %}

{% block fulltext_snippets %}
  <a href="{{ url_for('record.metadata', recid=record['recid']) }}" class="jsonrecord-brieflink">
    <div class="jsonrecord-briefarea"></div>
    <div class="jsonrecord jsonrecord-brief" data-id="recordbrief-{{ record._id }}" data-schema="{{ record.get('$schema') }}">
      <div class="jsonrecord-loading well well-lg"><i class="fa fa-spinner fa-spin"></i> {{ _('Loading') }}</div>
      <div id="jsonrecord-{{ record._id }}-rendered" class="jsonrecord-rendered"></div>
      <textarea id="recordbrief-{{ record._id }}" class="jsonrecord-blob">{{ record | tojson | safe }}</textarea>
    </div>
  </a>
{% endblock %}
