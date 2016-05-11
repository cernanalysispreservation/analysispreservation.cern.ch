define(["jquery", "alpaca","underscore", "handlebars", 'typeahead', 'bootstrap-tagsinput',], function($, alpaca, _, Handlebars){

  Alpaca.registerView({
    "id": "invenio-view",
    "parent": "web-edit",
    "horizontal": false,
    "type": "edit",
    "styles": {
      "upIcon": "fa fa-chevron-up",
      "downIcon": "fa fa-chevron-down",
      "addIcon": "fa fa-plus",
      "removeIcon": "fa fa-minus"
    },
    "templates": {
      "container": "/static/templates/container.html",
      "container-depositgroup": "/static/templates/container-depositgroup.html",
      "container-depositgroup-object": "/static/templates/container-depositgroup-object.html",
      "container-depositgroup-object-array": "/static/templates/container-depositgroup-object-array.html",
      "container-depositgroup-object-quickfill": "/static/templates/container-depositgroup-object-quickfill.html",
      "container-depositgroup-array": "/static/templates/container-depositgroup-array.html",
      "container-object-autocomplete-import": "/static/templates/container-object-autocomplete-import.html",
      "container-array-item": "/static/templates/container-array-item.html",
      "control-mlt-choice-cb": "/static/templates/control-mlt-choice-cb.html",
      "control-mlt-choice-radio": "/static/templates/control-mlt-choice-radio.html",
      "container-oneOf": "/static/templates/container-oneOf.html",
      "control-tags": "/static/templates/control-tags.html"
    }
  });

  Alpaca.registerView({
    "id": "invenio-display",
    "parent": "bootstrap-display",
    "horizontal": false,
    "type": "display",
    "styles": {
      "upIcon": "fa fa-chevron-up",
      "downIcon": "fa fa-chevron-down",
      "addIcon": "fa fa-plus",
      "removeIcon": "fa fa-minus"
    },
    "templates": {
      "container": "/static/templates/container.html",
      "container-depositgroup": "/static/templates/container-depositgroup.html",
      "container-depositgroup-object": "/static/templates/container-depositgroup-object.html",
      "container-depositgroup-object-array": "/static/templates/container-depositgroup-object-array.html",
      "container-depositgroup-object-quickfill": "/static/templates/container-depositgroup-object-quickfill-display.html",
      "container-depositgroup-array": "/static/templates/container-depositgroup-array.html",
      "container-object-autocomplete-import": "/static/templates/container-object-autocomplete-import-display.html",
      "container-array-item": "/static/templates/container-array-item-display.html",
      "control-mlt-choice-cb": "/static/templates/control-mlt-choice-cb.html",
      "control-mlt-choice-radio": "/static/templates/control-mlt-choice-radio.html",
      "container-oneOf": "/static/templates/container-oneOf.html",
      "control-tags": "/static/templates/control-tags-display.html"
    }
  });

  Handlebars.registerHelper("getIndex", function(){
    var index = this.name.split("_");
    index = parseInt(index[index.length-1]) + 1;
    return index;
  });

  Alpaca.Extend(Alpaca, {
    guessOptionsType: function(schema)
    {
        var type = null;

        if (schema && typeof(schema["enum"]) !== "undefined")
        {
            if (schema["enum"].length > 3)
            {
                type = "select";
            }
            else
            {
                type = "radio";
            }
        }
        else if (schema && typeof(schema["oneOf"]) !== "undefined")
        {
          type = "oneOf";
        }
        else
        {
            type = Alpaca.defaultSchemaFieldMapping[schema.type];
        }

        // check if it has format defined
        if (schema.format && Alpaca.defaultFormatFieldMapping[schema.format])
        {
            type = Alpaca.defaultFormatFieldMapping[schema.format];
        }

        return type;
    }
  });



  $.alpaca.Fields.DepositGroupField = $.alpaca.Fields.ObjectField.extend({
    getFieldType: function() {
      return "depositgroup";
    }
  });

  Alpaca.registerFieldClass("depositgroup", Alpaca.Fields.DepositGroupField);

  $.alpaca.Fields.DepositGroupObjectField = $.alpaca.Fields.ObjectField.extend({
    getFieldType: function() {
      return "depositgroup-object";
    }
  });

  Alpaca.registerFieldClass("depositgroup-object", Alpaca.Fields.DepositGroupObjectField);

  $.alpaca.Fields.MltChoiceCheckboxField = $.alpaca.Fields.CheckBoxField.extend({
    getFieldType: function() {
      return "mlt-choice-cb";
    }
  });

  Alpaca.registerFieldClass("mlt-choice-cb", Alpaca.Fields.MltChoiceCheckboxField);

  $.alpaca.Fields.MltChoiceRadioField = $.alpaca.Fields.RadioField.extend({
    getFieldType: function() {
      return "mlt-choice-radio";
    }
  });

  Alpaca.registerFieldClass("mlt-choice-radio", Alpaca.Fields.MltChoiceRadioField);

  $.alpaca.Fields.DepositGroupObjectArrayField = $.alpaca.Fields.ArrayField.extend({
    getFieldType: function() {
      return "depositgroup-object-array";
    }
  });

  Alpaca.registerFieldClass("depositgroup-object-array", Alpaca.Fields.DepositGroupObjectArrayField);


  $.alpaca.Fields.TagsField = $.alpaca.Fields.TextField.extend({
    getFieldType: function() {
      return "tags";
    },
    postRender: function(callback) {

        var self = this;
        window.ppppp = self;
        this.base(function() {
            if ((self.view.type !== "display") && self.control) {
                $(self.control).tagsinput();
            }

            callback();
        });
    }
  });

  Alpaca.registerFieldClass("tags", Alpaca.Fields.TagsField);

  $.alpaca.Fields.DepositGroupObjectQuickfillField = $.alpaca.Fields.ArrayField.extend({
    getFieldType: function() {
      return "depositgroup-object-quickfill";
    },
    postRender: function(callback) {
      var self = this;

      this.base (function(){
        self.updateToolbars();

        var droplist_btn;
        var droplist = self.field;
        droplist_btn = $(droplist).find(".droplist-btn");
        droplist = $(droplist).find(".droplist");
        fieldApplyTypeAhead(self, ".droplist");

        droplist_btn.click(function(){

          var list = droplist.tagsinput('items');
          if (list.length < 1){
            return false;
          }
          list = droplist.tagsinput('items');

          self.resolveItemSchemaOptions(function(itemSchema, itemOptions, circular) {
            // we only allow addition if the resolved schema isn't circularly referenced
            // or the schema is optional
            if (circular)
            {
                return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(itemSchema), self.errorCallback);
            }

            // how many children do we have currently?
            var insertionPoint = self.children.length;
            var selfList = [];
            _.each(self.children, function(li){
              if(li["options"]["ac_input_value"])
                selfList.push(li["options"]["ac_input_value"]);
            });
            var newList = _.difference(list, selfList);

            _.each(newList, function(listing){
              var extraOptions = {
                "ac_input_value": listing
              };
              var newOptions = $.extend({}, itemOptions);
              $.extend(newOptions, extraOptions);
              var itemData = Alpaca.createEmptyDataInstance(itemSchema);
              self.addItem(insertionPoint, itemSchema, newOptions, itemData, function(item) {
              });
              insertionPoint++;
            });

            return;
          });
        });
        callback();
      });
    }
  });

  Alpaca.registerFieldClass("depositgroup-object-quickfill", Alpaca.Fields.DepositGroupObjectQuickfillField);

  $.alpaca.Fields.DepositGroupArrayField = $.alpaca.Fields.ArrayField.extend({
    getFieldType: function() {
      return "depositgroup-array";
    }
  });

  Alpaca.registerFieldClass("depositgroup-array", Alpaca.Fields.DepositGroupArrayField);

  $.alpaca.Fields.ObjectAutocompleteImportField = $.alpaca.Fields.ObjectField.extend({
    getFieldType: function() {
      return "object-autocomplete-import";
    },
    postRender: function(callback) {
      var self = this;
      this.base(function() {
        var ac_input_field = "[name='"+self.name+"_ac_input']";
        ac_input_field = $(ac_input_field);
        self.applyTypeAhead();
        if (ac_input_field.length == 1)
        {
          // autocomplete
          //self.applyAutocomplete();
          // mask
          //self.applyMask();
          // typeahead
          self.applyTypeAhead(ac_input_field[0]);

          // update max length indicator
          //self.updateMaxLengthIndicator();
        }

        if (self.options && self.options.ac_input_value){
          if(self.options.typeahead.importSource) {
            var importSource = self.options.typeahead.importSource;

            if(importSource.type == "origin"){
              var url = window.location.origin+importSource.source;
            }
            else if (importSource.type == "remote"){
              var url = importSource.source;
            }
            if(url) {
              var importSourceData = importSource.data;
              var params = {};
              //_.each(importSourceData, function(param){
              params[importSourceData] = self.options.ac_input_value;
              //});
              $.getJSON(url, params, function( data ){
                var fillInData = {};
                if(self.options.typeahead.correlation){
                  var importData = recreateImportData(self.options.typeahead.correlation, data);
                  self.setValue(importData);
                }
              });
            }
          }
        }
        callback();
      });
    },
    applyTypeAhead: function() {
      var self = this;
      if (self.options.typeahead && !Alpaca.isEmpty(self.options.typeahead))
      {
        var tConfig = self.options.typeahead.config;
        if (!tConfig) {
          tConfig = {};
        }

        var tDatasets = self.options.typeahead.datasets;
        if (!tDatasets) {
          tDatasets = {};
        }

        if (!tDatasets.name) {
          tDatasets.name = self.getId();
        }

        var tEvents = self.options.typeahead.events;
        if (!tEvents) {
          tEvents = {};
        }

        // support for each datasets (local, remote, prefetch)
        if (tDatasets.type === "local" || tDatasets.type === "remote" || tDatasets.type === "prefetch")
        {
          var bloodHoundConfig = {
            datumTokenizer: function(d) {
              var tokens = "";
              for (var k in d) {
                if (d.hasOwnProperty(k) || d[k]) {
                  tokens += " " + d[k];
                }
              }
              return Bloodhound.tokenizers.whitespace(tokens);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace
          };

          if (tDatasets.type === "local" )
          {
            var local = [];

            if (typeof(tDatasets.source) === "function")
            {
              bloodHoundConfig.local = tDatasets.source;
            }
            else
            {
              // array
              for (var i = 0; i < tDatasets.source.length; i++)
              {
                var localElement = tDatasets.source[i];
                if (typeof(localElement) === "string")
                {
                  localElement = {
                    "value": localElement
                  };
                }

                local.push(localElement);
              }

              bloodHoundConfig.local = local;
            }

            if (tDatasets.local)
            {
              bloodHoundConfig.local = tDatasets.local;
            }
          }

          if (tDatasets.type === "prefetch")
          {
            bloodHoundConfig.prefetch = {
              url: tDatasets.source
            };

            if (tDatasets.filter)
            {
              bloodHoundConfig.prefetch.filter = tDatasets.filter;
            }
          }

          if (tDatasets.type === "remote")
          {
            bloodHoundConfig.remote = {
              url: tDatasets.source
            };

            if (tDatasets.filter)
            {
              bloodHoundConfig.remote.filter = tDatasets.filter;
            }

            if (tDatasets.replace)
            {
              bloodHoundConfig.remote.replace = tDatasets.replace;
            }
          }

          var engine = new Bloodhound(bloodHoundConfig);
          engine.initialize();
          tDatasets.source = engine.ttAdapter();
        }

        // compile templates
        if (tDatasets.templates)
        {
          for (var k in tDatasets.templates)
          {
            var template = tDatasets.templates[k];
            if (typeof(template) === "string")
            {
              tDatasets.templates[k] = Handlebars.compile(template);
            }
          }
        }

        // process typeahead
        var ac_input = self.field;
        ac_input = $(ac_input).find(".autocomplete-input-field");
        ac_input.typeahead(tConfig, tDatasets);
        //$(self.control).typeahead(tConfig, tDatasets);
        // listen for "autocompleted" event and set the value of the field
        ac_input.on("typeahead:autocompleted", function(event, datum) {
          self.setValue(datum.value);
          ac_input.change();
        });

        // listen for "selected" event and set the value of the field
        ac_input.on("typeahead:selected", function(event, datum) {
          //self.setValue(datum.value);
          if(self.options.typeahead.importSource) {
            var importSource = self.options.typeahead.importSource;

            if(importSource.type == "origin"){
              var url = window.location.origin+importSource.source;
            }
            else if (importSource.type == "remote"){
              var url = importSource.source;
            }
            if(url) {
              var importSourceData = importSource.data;
              var params = {};
              //_.each(importSourceData, function(param){
              params[importSourceData] = datum.value;
              //});
              $.getJSON(url, params, function( data ){
                var fillInData = {};
                if(self.options.typeahead.correlation){
                  var importData = recreateImportData(self.options.typeahead.correlation, data);
                  self.setValue(importData);
                }
              });
            }
          }

          ac_input.change();
        });

        // custom events
        if (tEvents)
        {
          if (tEvents.autocompleted) {
            $(self.control).on("typeahead:autocompleted", function(event, datum) {
              tEvents.autocompleted(event, datum);
            });
          }
          if (tEvents.selected) {
            $(self.control).on("typeahead:selected", function(event, datum) {
              tEvents.selected(event, datum);
            });
          }
        }

        // when the input value changes, change the query in typeahead this is
        // to keep the typeahead control sync'd with the actual dom value only
        // do this if the query doesn't already match
        var fi = ac_input;
        ac_input.change(function() {

          var value = $(this).val();

          var newValue = $(fi).typeahead('val');
          if (newValue !== value) {
            $(fi).typeahead('val', newValue);
          }

        });

        // some UI cleanup (we don't want typeahead/ to restyle)
        $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
        $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
      }
    },
    prepareControlModel: function(callback) {
      var self = this;

      this.base(function(model) {

        model.inputType = self.inputType;

        callback(model);
      });
    }
  });

  Alpaca.registerFieldClass("object-autocomplete-import", Alpaca.Fields.ObjectAutocompleteImportField);

  $.alpaca.Fields.Select2Field = $.alpaca.Fields.SelectField.extend({
    getFieldType: function() {
      return "select2";
    },
    afterRenderControl: function(model, callback) {
      var self = this;

      this.base(model, function() {
          if (self.options.select2 && $.fn.select2){
            $(self.getControlEl()).select2();
          }

          callback();
      });
    }
  });

  Alpaca.registerFieldClass("select2", Alpaca.Fields.Select2Field);

  $.alpaca.Fields.TextField2 = $.alpaca.Fields.TextField.extend({
    applyTypeAhead: function() {
      var self = this;
      if (self.options.typeahead && !Alpaca.isEmpty(self.options.typeahead))
      {
        var tConfig = self.options.typeahead.config;
        if (!tConfig) {
          tConfig = {};
        }

        var tDatasets = self.options.typeahead.datasets;
        if (!tDatasets) {
          tDatasets = {};
        }

        if (!tDatasets.name) {
          tDatasets.name = self.getId();
        }

        var tEvents = self.options.typeahead.events;
        if (!tEvents) {
          tEvents = {};
        }

        // support for each datasets (local, remote, prefetch)
        if (tDatasets.type === "local" || tDatasets.type === "remote" || tDatasets.type === "prefetch")
        {
          var bloodHoundConfig = {
            datumTokenizer: function(d) {
              var tokens = "";
              for (var k in d) {
                if (d.hasOwnProperty(k) || d[k]) {
                  tokens += " " + d[k];
                }
              }
              return Bloodhound.tokenizers.whitespace(tokens);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace
          };

          if (tDatasets.type === "local" )
          {
            var local = [];

            if (typeof(tDatasets.source) === "function")
            {
              bloodHoundConfig.local = tDatasets.source;
            }
            else
            {
              // array
              for (var i = 0; i < tDatasets.source.length; i++)
              {
                var localElement = tDatasets.source[i];
                if (typeof(localElement) === "string")
                {
                  localElement = {
                    "value": localElement
                  };
                }

                local.push(localElement);
              }

              bloodHoundConfig.local = local;
            }

            if (tDatasets.local)
            {
              bloodHoundConfig.local = tDatasets.local;
            }
          }

          if (tDatasets.type === "prefetch")
          {
            bloodHoundConfig.prefetch = {
              url: tDatasets.source
            };

            if (tDatasets.filter)
            {
              bloodHoundConfig.prefetch.filter = tDatasets.filter;
            }
          }

          if (tDatasets.type === "remote")
          {
            bloodHoundConfig.remote = {
              url: tDatasets.source
            };

            if (tDatasets.filter)
            {
              bloodHoundConfig.remote.filter = tDatasets.filter;
            }

            if (tDatasets.replace)
            {
              bloodHoundConfig.remote.replace = tDatasets.replace;
            }
          }

          var engine = new Bloodhound(bloodHoundConfig);
          engine.initialize();
          tDatasets.source = engine.ttAdapter();
        }

        // compile templates
        if (tDatasets.templates)
        {
          for (var k in tDatasets.templates)
          {
            var template = tDatasets.templates[k];
            if (typeof(template) === "string")
            {
              tDatasets.templates[k] = Handlebars.compile(template);
            }
          }
        }

        // process typeahead
        var ac_input = self.field;
        ac_input = $(ac_input).find("input.alpaca-control");
        ac_input.typeahead(tConfig, tDatasets);
        //$(self.control).typeahead(tConfig, tDatasets);
        // listen for "autocompleted" event and set the value of the field
        ac_input.on("typeahead:autocompleted", function(event, datum) {
          self.setValue(datum.value);
          ac_input.change();
        });

        // listen for "selected" event and set the value of the field
        ac_input.on("typeahead:selected", function(event, datum) {
          self.setValue(datum.value);
          ac_input.change();

          if(self.options.typeahead.importSource) {
            var importSource = self.options.typeahead.importSource;

            if(importSource.type == "origin"){
              var url = window.location.origin+importSource.source;
            }
            else if (importSource.type == "remote"){
              var url = importSource.source;
            }
            if(url) {
              var importSourceData = importSource.data;
              var params = {};

              params[importSourceData] = datum.value;
              var _topField;
              var _importRootPathData;
              $.getJSON(url, params, function( data ){
                var fillInData = {};
                if(self.options.typeahead.correlation){
                  var importRootPathData;
                  if (self.options.typeahead.correlation["#"]){
                    importRootPathData = recreateImportData(self.options.typeahead.correlation["#"], data);
                  }
                  else {
                    var importData = recreateImportData(_.omit(self.options.typeahead.correlation), data);
                    self.setValue(importData);
                  }

                  var topField = self;
                  var fieldChain = [topField];
                  while (topField.parent)
                  {
                      topField = topField.parent;
                      fieldChain.push(topField);
                  }

                  var tmp_json = topField.getValue();

                  function deepFind(obj, path) {
                    var paths = path.split('/')
                      , current = obj
                      , i;

                    for (i = 0; i < paths.length; ++i) {
                      if (current[paths[i]] == undefined) {
                        return undefined;
                      } else {
                        current = current[paths[i]];
                      }
                    }
                    return current;
                  }

                  var setImportedValues = function(object, data, pwd){
                    var tmp_data = {};
                    var tmp_pwd = pwd;
                    _.each(object, function(value, key){
                      if (Alpaca.isString(value)) {
                        var path;
                        if(pwd.length > 0)
                          path = pwd.join("/").concat("/"+key);
                        else
                          path = key;

                        var field = topField.getControlByPath(path);
                        console.log("setva::", deepFind(importRootPathData, path));
                        field.setValue(deepFind(importRootPathData, path));

                        return;
                      }
                      else if (Alpaca.isObject(value)){
                        setImportedValues(value, data, pwd.concat([key]));
                      }
                    });

                    return;
                  };

                  setImportedValues(self.options.typeahead.correlation["#"], importRootPathData, []);
                }
              });
            }
          }
        });

        // custom events
        if (tEvents)
        {
          if (tEvents.autocompleted) {
            $(self.control).on("typeahead:autocompleted", function(event, datum) {
              tEvents.autocompleted(event, datum);
            });
          }
          if (tEvents.selected) {
            $(self.control).on("typeahead:selected", function(event, datum) {
              tEvents.selected(event, datum);
            });
          }
        }

        // when the input value changes, change the query in typeahead this is
        // to keep the typeahead control sync'd with the actual dom value only
        // do this if the query doesn't already match
        var fi = ac_input;
        ac_input.change(function() {
          var value = $(this).val();

          var newValue = $(fi).typeahead('val');
          if (newValue !== value) {
            $(fi).typeahead('val', newValue);
          }

        });

        // some UI cleanup (we don't want typeahead/ to restyle)
        $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
        $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
      }
    }
  });

  Alpaca.registerFieldClass("text", Alpaca.Fields.TextField2);


  var recreateImportData = function(object, data){
    var tmp_data = {};
    _.each(object, function(value, key){
      if (Alpaca.isString(value)) {
        tmp_data[key] = data[value];
      }
      else if (Alpaca.isObject(value)){
        tmp_data[key] = recreateImportData(value, data);
      }
    });

    return tmp_data;
  };

  var fieldApplyTypeAhead = function(selfItem, inputField) {
    var self = selfItem;

    if (typeof inputField == 'undefined'){
      return false;
    }
    if (self.options.typeahead && !Alpaca.isEmpty(self.options.typeahead)){
      var tConfig = self.options.typeahead.config;
      if (!tConfig) {
        tConfig = {};
      }

      var tDatasets = self.options.typeahead.datasets;
      if (!tDatasets) {
        tDatasets = {};
      }

      if (!tDatasets.name) {
        tDatasets.name = self.getId();
      }

      var tEvents = self.options.typeahead.events;
      if (!tEvents) {
        tEvents = {};
      }

      // support for each datasets (local, remote, prefetch)
      if (tDatasets.type === "local" || tDatasets.type === "remote" || tDatasets.type === "prefetch"){

        var bloodHoundConfig = {
          datumTokenizer: function(d) {
            var tokens = "";
            for (var k in d) {
              if (d.hasOwnProperty(k) || d[k]) {
                tokens += " " + d[k];
              }
            }
            return Bloodhound.tokenizers.whitespace(tokens);
          },
          queryTokenizer: Bloodhound.tokenizers.whitespace
        };

        if (tDatasets.type === "local" ){
          var local = [];

          if (typeof(tDatasets.source) === "function") {
            bloodHoundConfig.local = tDatasets.source;
          }
          else {
            // array
            for (var i = 0; i < tDatasets.source.length; i++) {
              var localElement = tDatasets.source[i];
              if (typeof(localElement) === "string") {
                localElement = {
                  "value": localElement
                };
              }

              local.push(localElement);
            }

            bloodHoundConfig.local = local;
          }

          if (tDatasets.local) {
            bloodHoundConfig.local = tDatasets.local;
          }
        }

        if (tDatasets.type === "prefetch") {
          bloodHoundConfig.prefetch = {
            url: tDatasets.source
          };

          if (tDatasets.filter) {
            bloodHoundConfig.prefetch.filter = tDatasets.filter;
          }
        }

        if (tDatasets.type === "remote") {
          bloodHoundConfig.remote = {
            url: tDatasets.source
          };

          if (tDatasets.filter) {
            bloodHoundConfig.remote.filter = tDatasets.filter;
          }

          if (tDatasets.replace) {
            bloodHoundConfig.remote.replace = tDatasets.replace;
          }
        }

        var engine = new Bloodhound(bloodHoundConfig);
        engine.initialize();
        tDatasets.source = engine.ttAdapter();
      }

      // compile templates
      if (tDatasets.templates) {
        for (var k in tDatasets.templates) {
          var template = tDatasets.templates[k];
          if (typeof(template) === "string") {
            tDatasets.templates[k] = Handlebars.compile(template);
          }
        }
      }

      // process typeahead
      var ac_input = self.field;
      ac_input = $(ac_input).find(inputField);
      ac_input.tagsinput({
        "typeaheadjs": [
          tConfig,
          tDatasets
        ]
      });
      //$(self.control).typeahead(tConfig, tDatasets);
      // listen for "autocompleted" event and set the value of the field

      // custom events
      if (tEvents)
      {
        if (tEvents.autocompleted) {
          $(self.control).on("typeahead:autocompleted", function(event, datum) {
            tEvents.autocompleted(event, datum);
          });
        }
        if (tEvents.selected) {
          $(self.control).on("typeahead:selected", function(event, datum) {
            tEvents.selected(event, datum);
          });
        }
      }

      // some UI cleanup (we don't want typeahead/ to restyle)
      $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
      $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
    }
  };

  $.alpaca.Fields.oneOfField = $.alpaca.Fields.ObjectField.extend({
    getFieldType: function() {
      return "oneOf";
    },
    afterRenderContainer: function(model, callback) {
      var self = this;

      self.oneOfSelectOnChange();

      this.base(model, function() {

          // Generates wizard if requested
          if (self.isTopLevel())
          {
              if (self.view)
              {
                  self.wizardConfigs = self.view.getWizard();
                  if (typeof(self.wizardConfigs) != "undefined")
                  {
                      if (!self.wizardConfigs || self.wizardConfigs === true)
                      {
                          self.wizardConfigs = {};
                      }
                  }

                  var layoutTemplateDescriptor = self.view.getLayout().templateDescriptor;
                  if (self.wizardConfigs && Alpaca.isObject(self.wizardConfigs))
                  {
                      if (!layoutTemplateDescriptor || self.wizardConfigs.bindings)
                      {
                          // run the automatic wizard
                          self.autoWizard();
                      }
                      else
                      {
                          // manual wizard based on layout
                          self.wizard();
                      }
                  }
              }
          }

          callback();
      });
    },
    oneOfSelectOnChange: function() {
      var self = this;

      if(this.view.type === "display") {
        return;
      }

      if(this.schema.readonly) {
        return;
      }

      var selectEl = $(self.domEl[0]).find(".oneof-select")[0];
      $(selectEl).change(function() {
        var selectedId = $(selectEl).val();
        var selectedTitle = $("option:selected", selectEl).text();
        if (self.selectedId !== selectedId) {
          self.selectedId = selectedId;
        }

        self.refresh();
      });
    },
    prepareContainerModel: function(callback){
      var self = this;

      var itemSchema = {};
      var tmpSchema = self.schema;
      if (self.schema && self.schema.oneOf){
        if (Alpaca.isArray(self.schema.oneOf)) {
          itemSchema = _.findWhere(self.schema.oneOf, {"id": self.selectedId});
          if (Alpaca.isEmpty(itemSchema)) {
            tmpSchema = self.schema;
          }
          else {
            // self["schema"]["oneOf"] = self.schema.oneOf;
            // delete self.schema.oneOf;
            tmpSchema = _.extend(self.schema,itemSchema);
          }
        }
      }

      var model = {
          "id": this.getId(),
          "name": this.name,
          "schema": tmpSchema,
          "options": this.options,
          "view": this.view
      };

      // load items into array and store on model for future use
      self.createItems(function(items) {
        if (!items)
        {
            items = [];
        }

        // legacy support: assume containerItemEl = fieldEl
        for (var i = 0; i < items.length; i++)
        {
            if (!items[i].containerItemEl) {
                items[i].containerItemEl = items[i].getFieldEl();
            }
        }

        model.items = items;

        callback(model);
      });
    },
    applyCreatedItems: function(model, callback) {
        var self = this;

        var layoutBindings = null;
        if (self.isTopLevel() && self.view.getLayout())
        {
            layoutBindings = self.view.getLayout().bindings;

            // if layout and bindings not provided, assume a default strategy
            if (!layoutBindings && self.view.getLayout().templateDescriptor && model.items.length > 0)
            {
                layoutBindings = {};

                for (var i = 0; i < model.items.length; i++)
                {
                    var name = model.items[i].name;

                    layoutBindings[name] = "[data-alpaca-layout-binding='" + name + "']";
                }
            }

        }

        if (model.items.length > 0) {
            $(self.container).addClass("alpaca-container-has-items");
            $(self.container).attr("data-alpaca-container-item-count", model.items.length);
        }
        else {
            $(self.container).removeClass("alpaca-container-has-items");
            $(self.container).removeAttr("data-alpaca-container-item-count");
        }

        for (var i = 0; i < model.items.length; i++) {
            var item = model.items[i];

            // find the insertion point
            var insertionPoint = $(self.container).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM + "[" + Alpaca.MARKER_DATA_CONTAINER_FIELD_ITEM_KEY + "='" + item.name + "']");
            if (!layoutBindings) {
                var holder = $(insertionPoint).parent();

                $(insertionPoint).replaceWith(item.containerItemEl);

                // reset domEl to allow for refresh
                item.domEl = holder;
            }
            else {
                // use a layout
                var bindingId = layoutBindings[item.name];
                if (bindingId) {
                    var holder = $(bindingId, self.field);
                    if (holder.length == 0) {
                        // legacy support, fallback to ID based
                        try {
                            holder = $('#' + bindingId, self.field);
                        } catch (e) { }
                    }
                    if (holder.length > 0) {
                        // create a wrapper (which will serve as the domEl)
                        item.domEl = $("<div></div>");
                        $(item.domEl).addClass("alpaca-layout-binding-holder");
                        $(item.domEl).attr("alpaca-layout-binding-field-name", item.name);
                        holder.append(item.domEl);
                        item.domEl.append(item.containerItemEl);
                    }
                }

                // remove insertion point
                $(insertionPoint).remove();
            }

            $(item.containerItemEl).addClass("alpaca-container-item");

            if (i === 0) {
                $(item.containerItemEl).addClass("alpaca-container-item-first");
            }

            if (i + 1 === model.items.length) {
                $(item.containerItemEl).addClass("alpaca-container-item-last");
            }

            $(item.containerItemEl).attr("data-alpaca-container-item-index", i);
            $(item.containerItemEl).attr("data-alpaca-container-item-name", item.name);
            $(item.containerItemEl).attr("data-alpaca-container-item-parent-field-id", self.getId());

            // register the child
            self.registerChild(item, i);
        }

        if (self.options.collapsible) {
            // CALLBACK: "collapsible"
            self.fireCallback("collapsible");
        }

        self.triggerUpdate();
        callback();
    },
    setValue: function(data) {
        if (!data) {
            data = {};
        }

        // if not an object by this point, we don't handle it
        if (!Alpaca.isObject(data)) {
            return;
        }

        var currentSchemaTypeField = "schema_type";
        if( this.options && this.options.schemaTypeField ) {
          currentSchemaTypeField = this.options.schemaTypeField;
        }

        if (Alpaca.isArray(this.schema.oneOf)) {
          if (data[currentSchemaTypeField]) {
            this.selectedId = data[currentSchemaTypeField];
            this.refresh();
          }
        }


        // sort existing fields by property id
        var existingFieldsByPropertyId = {};
        for (var fieldId in this.childrenById) {
          var propertyId = this.childrenById[fieldId].propertyId;
          existingFieldsByPropertyId[propertyId] = this.childrenById[fieldId];
        }

        // new data mapped by property id
        var newDataByPropertyId = {};
        for (var k in data) {
          if (data.hasOwnProperty(k)) {
              newDataByPropertyId[k] = data[k];
          }
        }

        // walk through new property ids
        // if a field exists, set value onto it and remove from newDataByPropertyId and existingFieldsByPropertyId
        // if a field doesn't exist, let it remain in list
        for (var propertyId in newDataByPropertyId) {
          var field = existingFieldsByPropertyId[propertyId];
          if (field) {
              field.setValue(newDataByPropertyId[propertyId]);

              delete existingFieldsByPropertyId[propertyId];
              delete newDataByPropertyId[propertyId];
          }
        }

        // anything left in existingFieldsByPropertyId describes data that is missing, null or empty
        // we null out those values
        for (var propertyId in existingFieldsByPropertyId) {
          var field = existingFieldsByPropertyId[propertyId];
          field.setValue(null);
        }

        // anything left in newDataByPropertyId is new stuff that we need to add
        // the object field doesn't support this since it runs against a schema
        // so we drop this off
    },
    refresh: function(callback) {
      var self = this;

      // store back data
      var _data = self.data = self.getValue();

      // remember this stuff
      var oldDomEl = self.domEl;
      var oldField = self.field;
      //var oldControl = self.control;
      //var oldContainer = self.container;
      //var oldForm = self.form;

      // insert marker element before current field to mark where we'll render
      var markerEl = $("<div></div>");
      $(oldField).before(markerEl);

      // temp domEl
      self.domEl = $("<div style='display: none'></div>");
      // clear this stuff out
      self.field = undefined;
      self.control = undefined;
      self.container = undefined;
      self.form = undefined;

      // disable all buttons on our current field
      // we do this because repeated clicks could cause trouble while the field is in some half-state
      // during refresh
      $(oldField).find("button").prop("disabled", true);

      // mark that we are initializing
      this.initializing = true;

      // re-setup the field
      self.setup();

      // render
      self._render(function() {

          // move ahead of marker
          $(markerEl).before(self.field);

          // reset the domEl
          self.domEl = oldDomEl;

          // copy classes from oldField onto field
          var oldClasses = $(oldField).attr("class");
          if (oldClasses) {
              $.each(oldClasses.split(" "), function(i, v) {
                  if (v && !v.indexOf("alpaca-") === 0) {
                      $(self.field).addClass(v);
                  }
              });
          }

          // hide the old field
          $(oldField).hide();

          // remove marker
          $(markerEl).remove();

          // mark that we're refreshed
          self.refreshed = true;

          // this is apparently needed for objects and arrays
          if (typeof(_data) !== "undefined")
          {
              if (Alpaca.isObject(_data) || Alpaca.isArray(_data))
              {
                  self.setValue(_data);
              }
          }

          // fire the "ready" event
          Alpaca.fireReady(self);

          if (callback)
          {
              callback();
          }

          // afterwards...

          // now clean up old field elements
          // the trick here is that we want to make sure we don't trigger the bound "destroyed" event handler
          // for the old dom el.
          //
          // the reason is that we have oldForm -> Field (with oldDomEl)
          //                        and form -> Field (with domEl)
          //
          // cleaning up "oldDomEl" causes "Field" to cleanup which causes "oldForm" to cleanup
          // which causes "Field" to cleanup which causes "domEl" to clean up (and also "form")
          //
          // here we just want to remove the dom elements for "oldDomEl" and "oldForm" without triggering
          // the special destroyer event
          //
          // appears that we can do this with a second argument...?
          //
          $(oldField).remove();
      });
    },
  });

  Alpaca.registerFieldClass("oneOf", Alpaca.Fields.oneOfField);

  return {};
});
