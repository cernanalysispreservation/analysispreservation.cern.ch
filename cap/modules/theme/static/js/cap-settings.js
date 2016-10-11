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

require.config({
  baseUrl: "/static/",
  paths: {
    angular: "node_modules/angular/angular",
    jquery: "node_modules/jquery/jquery",
    bootstrap: "node_modules/bootstrap/dist/js/bootstrap",
    select2: "node_modules/select2/dist/js/select2.min",
    underscore: "node_modules/underscore/underscore-min",
    bloodhound: "node_modules/typeahead.js/dist/bloodhound",
    'bootstrap3-typeahead': "node_modules/bootstrap-3-typeahead/bootstrap3-typeahead",
    handlebars: "node_modules/handlebars/dist/handlebars.amd.min",
    moment: "node_modules/moment/min/moment.min",
    alpaca: "node_modules/alpaca/dist/alpaca/bootstrap/alpaca",
    "invenio-alpaca": "js/invenio-alpaca",
    "module-getter": "js/module-getter",
    "ref-parser": "node_modules/json-schema-ref-parser/dist/ref-parser",
    "json-patch": "node_modules/fast-json-patch/dist/json-patch-duplex.min",
    "angular-filter": "node_modules/angular-filter/dist/angular-filter",
    "jsoneditor": "node_modules/jsoneditor/dist/jsoneditor.min",
    "bootstrap-tokenfield": "node_modules/bootstrap-tokenfield/dist/bootstrap-tokenfield.min"
  },
  shim: {
    'jquery': {
      exports: "jquery"
    },
    bootstrap: {
      deps: ["jquery"]
    },
    angular: {
      exports: "angular"
    },
    "ref-parser": {
      deps: ["jquery"]
    }
  }
});
