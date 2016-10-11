/* -*- coding: utf-8 -*-
 *
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2016 CERN.
 *
 * CERN Analysis Preservation Framework is free software; you can redistribute
 * it and/or modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * CERN Analysis Preservation Framework is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CERN Analysis Preservation Framework; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
 * MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */



require(['jquery', 'select2', 'underscore' ,'handlebars', 'moment','ref-parser' , 'invenio-alpaca','module-getter', 'jsoneditor','bloodhound', 'json-patch'], function($, _select2, _, Handlebars, moment, $RefParser,invenio_alpaca, module_getter, JSONEditor, Bloodhound) {

  function loadScript(url, callback){

      var script = document.createElement("script");
      script.type = "text/javascript";

      if (script.readyState){  //IE
          script.onreadystatechange = function(){
              if (script.readyState == "loaded" ||
                      script.readyState == "complete"){
                  script.onreadystatechange = null;
                  callback();
              }
          };
      } else {  //Others
          script.onload = function(){
              callback();
          };
      }

      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
  }

  var optionsName = {};
  var schemaName = {};
  var element = document.getElementById("record-form");
  if (element && element.dataset.schema){
    schemaName = element.dataset.schema;
    optionsName = element.dataset.options;
  }

  var editor_container = document.getElementById("record-editor");
  var editor = new JSONEditor(editor_container, {});
  editor.set(recordData);

  loadScript(optionsName, function(){
    var schemaOptions = window.schemaOptions;
    schemaOptions["form"] = {};
    schemaOptions["form"]["buttons"] = {};
    schemaOptions["form"]["buttons"] = {
      // "submit": {
      //   "title": "Submit",
      //   "click": function(){
      //     alert("Submiting record - record_version will be saved");
      //   }
      // },
      "save": {
        "title": "Save",
        "click": function(){
          var newData = this.getValue();
          var patch = jsonpatch.compare(recordData, newData);
          patch = JSON.stringify(patch);
          var url = location.pathname.replace('edit','update');
          var recordPost = $.post(
            url,
            patch,
            function(){
              $(".record-rendered-loading").show();
            },
            'json'
          );

          recordPost.success(function(){
            $("#record-modal .modal-body").html("Saved record!!!");
            $("#record-modal").modal('show');
            $("#record-modal button[data-dismiss='modal']").click(function(){
              $(".record-rendered-loading").hide();
            });
          });

          recordPost.error(function(response){
            var message = "<strong>There was an error in your form.</br>Please check again..</strong></br>";
            message += "<hr>";
            message += "Probable errors in the form:</br>";
            message += "<p class='text-danger'>- "+response.responseJSON.message+"</p>";

            $("#record-modal .modal-body").html(message);
            $("#record-modal").modal('show');
            $("#record-modal button[data-dismiss='modal']").click(function(){
              $(".record-rendered-loading").hide();
            });
            // $('#record-menu a[href="#json"]').tab("show");
          });
        }
      },
      "serialize": {
        "title": "Update JSON tab",
        "click": function(){
          var value = this.getValue();
          editor.set(value);
        }
      }
    };

    $('#record-form').each(function(){
      var element = this;
      // var schemaName = "/static/jsonschemas/"+$(element).data("schema");
      // var optionsName = schemaName.replace("schema.json", "options.js");
      var target = $('.record-rendered', element)[0];
      var loading = $('.record-loading', element)[0];
      // if (!(schemaOptions)) schemaOptions = {};
      $RefParser.bundle(schemaName, function(e, schema){
        // Print schema in console
        schemaOptions["hideInitValidationError"] = true;
        Alpaca(target, {
          "data": recordData,
          "schema": schema,
          "view":"invenio-view",
          "options": schemaOptions,
          // "options": optionsName,
          "postRender": function(control){
            $(loading).remove();
            updateScrollspy();
            if (typeof schemaPostRender == 'function')
              schemaPostRender(control);
          }
        });
      });
    });
  });


  // Update scrollpspy with populated schema form
  // *******************************************
  var updateScrollspy = function(){
    var scrollspy = $(".scrollspy-target > ul > li:first-child");
    var list_item = "";
    var depositgroups = $(".alpaca-field-depositgroup,.alpaca-field-depositgroup-array");

    _.each(depositgroups, function (dg) {
      var id = $(dg).data('alpaca-field-name');
      var title = $(dg).find(".panel .panel-heading .alpaca-container-label").text();
      $(dg).attr('id', id);

      list_item = list_item.concat("<li role='presentation'><a href='#"+id+"'><i class='fa fa-dot-circle-o fa-fw'></i>"+title+"</a></li>");
    });

    scrollspy.after(list_item);
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this).scrollspy('refresh');
    });
  };
});
