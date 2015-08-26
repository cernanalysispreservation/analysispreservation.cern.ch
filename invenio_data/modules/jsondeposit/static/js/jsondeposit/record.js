/**
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2015 CERN.
 *
 * CERN Analysis Preservation Framework is free software; you can
 * redistribute it and/or modify it under the terms of the GNU General
 * Public License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * CERN Analysis Preservation Framework is distributed in the hope that
 * it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this software; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307,
 * USA.
 */

require(['jquery', 'base64', 'utf8'], function($, base64, utf8) {
  'use strict';

  $(function() {
    JSONEditor.defaults.options.ajax = true;
    JSONEditor.defaults.options.disable_collapse = true;
    JSONEditor.defaults.options.disable_collapse = true;
    JSONEditor.defaults.options.disable_edit_json = true;
    JSONEditor.defaults.options.disable_properties = true;
    JSONEditor.defaults.options.no_additional_properties = false;
    JSONEditor.defaults.options.iconlib = 'fontawesome4';
    JSONEditor.defaults.options.theme = 'bootstrap3';

    /* JSON blob:
     *   // secure string
     *   base64:
     *     // 0x00-0xFF string (UTF-8)
     *     utf-8:
     *       // browser UTF-16 string, other string, ...
     *       stringify:
     *         JSON object
     */
    function blob2json(blob) {
        var str = utf8.decode(base64.decode(blob)).trim();
        if (str) {
            return JSON.parse(str);
        } else {
            return {};
        }
    }

    $('.jsonrecord').each(function() {
        var element = this;
        $.getJSON($(element).data('schema'), function(schema) {
            var loading = $('.jsonrecord-loading', element)[0];
            var blob_container = $('.jsonrecord-blob', element)[0];
            var json = JSON.parse($(blob_container).text());
            var target = $('.jsonrecord-rendered', element)[0];
            var id = $(element).data('id');

            // fix $schema bug
            delete json['$schema'];

            var editor = new JSONEditor(target, {
                form_name_root: id,
                schema: schema,
            });

            editor.on('ready', function() {
                editor.disable();

                if (!$.isEmptyObject(json)) {
                    editor.setValue(json);
                }

                $(':input', target).prop('disabled', true);
                $('.select2-choice', target).unbind();
                $('.select2-container', target).unbind();
                $('.select2-container a', target).on('dragstart', function(){return false;});

                $(loading).remove();
            });
        });
    });
  });
})
