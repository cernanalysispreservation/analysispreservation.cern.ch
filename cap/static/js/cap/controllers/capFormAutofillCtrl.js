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

///////////////////////////////////////////
///////////////////////////////////////////
// CAP app Form Autofill Controller

var capFormAutofillCtrl = function( $scope, $interpolate , $http){
  $scope.getData = function(ref, val, model, form) {
    var _params = {};
    _params[ref.paramKey] = val;
    return $http.get(ref.url, {
      params: _params
    }).then(function(response){
      return response.data.results.map(function(item){
        if (ref["displayKey"]){
          var _item = item;
          angular.forEach(ref["displayKey"], function(key){
            _item = _item[key];
          });
          return _item
        }
        else{
          return item;
        }
      });
    });
  };


  // Needs to be specified with the following options to function
  //
  // "type": "cap:formAutofill",
  // "isAsync": "true",
  // "ref": {
  //   "url": "//maps.googleapis.com/maps/api/geocode/json",
  //   "paramKey": "address",
  //   "displayKey": ["formatted_address"],
  //   "map": [
  //     {
  //       "s": "place_id",
  //       "t": ["basic_info", "abstract"]
  //     },
  //     {
  //       "s": ["geometry", "location_type"],
  //       "t": ["#", "conclusion"]
  //     },
  //     {
  //       "s": ["geometry", "location", "lat"],
  //       "t": ["#", "software", "name"]
  //     }
  //   ]
  // }
  $scope.onSelect = function(_item, _model, _label, model, form) {
    var ref = form.ref;
    var _params = {};
    _params[ref.paramKey] = _item;

    $http.get(ref.url, {
      params: _params
    }).then(function(response){
      if( ref && ref.map){
        angular.forEach(ref.map, function(mapping){
          var model_ref = model;
          var resp = {};

          if (mapping["s"]){
            if (angular.isArray(mapping["s"])){
              resp = response.data;
              angular.forEach(mapping["s"], function(key){
                    resp = resp[key];
              });
            }
            else{
              // [TOFIX] for now gets only first result
              if (response.data)
                resp = response.data[mapping["s"]];
            }
          }

          if (mapping["t"]){
            if (mapping["t"][0] === "#"){
              _mapping = form.key.slice(0,-1);
              _mapping = _mapping.concat((mapping["t"]).slice(1));
            }
            else{
              _mapping = mapping["t"];
            }

            var m_length = _mapping.length;
            angular.forEach(_mapping, function(key, index){
              if (model_ref[key]){
                model_ref = model_ref[key];
              }
              else if(index+1 !== m_length){
                model_ref = model_ref[key] = {};
              }
              else if(index+1 === m_length){
                model_ref = model_ref[key] = resp;
              }
            });
          }
        });
      };
    });
  };
};

capFormAutofillCtrl.$inject = [
  '$scope',
  '$interpolate',
  '$http'
];

angular.module('cap.controllers')
  .controller('formAutofillCtrl', capFormAutofillCtrl);