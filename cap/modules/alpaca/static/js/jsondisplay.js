/*
 * This file is part of Invenio.
 * Copyright (C) 2015 CERN.
 *
 * Invenio is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Invenio is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License
 * along with Invenio; if not, write to the Free Software
 * Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 */


require(['jquery', 'select2', 'underscore' ,'handlebars', 'moment','ref-parser' , 'invenio-alpaca','module-getter' ,'bloodhound', 'typeahead'], function($, _select2, _, Handlebars, moment, $RefParser,invenio_alpaca, module_getter, Bloodhound) {

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
  var element = document.getElementById("record-fields");
  if (element && element.dataset.schema){
    schemaName = element.dataset.schema;
    optionsName = element.dataset.options;
  }

  loadScript(optionsName, function(){
    var schemaOptions = window.schemaOptions;

    $('#record-fields').each(function() {
      var element = this;
      // var schemaName = "/static/jsonschemas/"+$(element).data("schema");
      // var optionsName = schemaName.replace("schema.json", "options.js");
      var target = $('.record-rendered', element)[0];
      var loading = $('.record-loading', element)[0];
      if (!(schemaOptions)) schemaOptions = {};
      $RefParser.bundle(schemaName, function(e, schema){
        $(target).alpaca({
          "schema": schema,
          "view":"bootstrap-display",
          "options": schemaOptions,
          "data": recordData,
          "postRender": function(){
            $(loading).remove();
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
