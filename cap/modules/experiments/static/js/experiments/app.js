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
// CAP app Deposit Controller

var capDepositCtrl = function($scope, $location,  capLocalClient, deposit, contentBarTabs) {
  var location_url = $location.protocol() + "://" + $location.host() + ":" + $location.port();

  $scope.name = 'DepositController';
  $scope.deposit = deposit;
  $scope.pid_value = deposit.id;
  $scope.contentBarTabs = contentBarTabs;
  $scope.mi = deposit.meta_info;

  if (deposit.meta_info.schema.indexOf(location_url) > -1) {
    $scope.location_url = "";
  }
  else {
    $scope.location_url = location_url;
  }

  $scope.initDeposit = function() {
    $scope.progress = {};
    $scope.type = {};
    $scope.req = {};
    $scope.current_key = '';
    $scope.depositionForm = {};
  };

  $scope.$on('sf-render-finished', function(event){
    console.log("formm::", $scope.depositionForm);

    watchAndUpdate({}, {});

    $scope.$watch('depositionForm.$error', function(newValue, oldValue) {
      watchAndUpdate(newValue, oldValue);
    }, 'true');
    // console.log("formm::", $scope['depositionForm'+$scope.deposit_id]);
  });

  var watchAndUpdate =  function(newValue, oldValue) {
    // console.log("EE::");
    if (newValue && oldValue) {

      if ($scope.recordsVM.invenioRecordsSchema) {

        var props = $scope.recordsVM.invenioRecordsSchema.properties;
        angular.forEach(props, function(value, key) {
          if (key.indexOf("_") !== 0) {
            $scope.progress[key] = 0;
            $scope.type[key] = '';
            if (value.name !== "_deposit" && value.required !== undefined) {
              $scope.req[key] = value.required;
            }
          }
        });
      }

      angular.forEach($scope.progress, function(value, key){
        if (!(key in $scope.req)){
          $scope.progress[key] = 'N/A';
          $scope.type[key] = 'disabled';
        }
      });

      // Calculate percentage for every element
      if (oldValue !== newValue) {
        angular.forEach($scope.depositionForm, function(value, key) {
          if ((key.indexOf('$') !== 0) && value.$dirty) {
            angular.forEach($scope.req, function(v, k) {
              if (v.indexOf(key) > -1) {
                current_key = k;
              }
            });
            if ($scope.req[current_key].indexOf(key) > -1) {
              calculatePercentage($scope.req, current_key, value);
            }
          }
        });
      }

      if ($scope.depositionForm.$valid) {
        angular.forEach($scope.req, function(value, key) {
          $scope.progress[key] = 100;
          $scope.type[key] = 'success';
        });
      }

      function calculatePercentage(req, current_key, value) {
        if ($scope.req[current_key].length == 1) {
          if (value.$invalid) {
            $scope.progress[current_key] = 0;
            $scope.type[current_key] = '';
          } else {
            $scope.progress[current_key] = 100;
            $scope.type[current_key] = 'success';
          }
        } else {
          if (value.$valid) {
            $scope.progress[current_key] += parseInt(100 / req[current_key].length);
            if ($scope.progress[current_key] >= 98 && $scope.progress[current_key] <= 102) {
              $scope.progress[current_key] = 100;
            }
          }
          if ($scope.progress[current_key] == 100) {
            $scope.type[current_key] = 'success';
          } else if ($scope.progress[current_key] > 0) {
            $scope.type[current_key] = 'warning';
          }
        }
      };
    }
  };
};

capDepositCtrl.$inject = [
  '$scope',
  '$location',
  'capLocalClient',
  'deposit',
  'contentBarTabs'
];

angular.module('cap.app')
  .controller('DepositController', capDepositCtrl);



///////////////////////////////////////////
///////////////////////////////////////////
// CAP app WG Controller

var capWGCtrl = function($scope, $location, $stateParams, capLocalClient) {
  $scope.name = 'WGController';

  $scope.wg_name = $stateParams.wg_name;
};

capWGCtrl.$inject = [
  '$scope',
  '$location',
  '$stateParams',
  'capLocalClient'
];

angular.module('cap.app')
  .controller('WGController', capWGCtrl);



///////////////////////////////////////////
///////////////////////////////////////////
// CAP app Records Controller

var capRecordCtrl = function($scope, $location, capLocalClient, record, contentBarTabs) {
  $scope.name = 'RecordController';

  $scope.record = record;
  $scope.contentBarTabs = contentBarTabs;
};

capRecordCtrl.$inject = [
  '$scope',
  '$location',
  'capLocalClient',
  'record',
  'contentBarTabs'
];

angular.module('cap.app')
  .controller('RecordController', capRecordCtrl);




///////////////////////////////////////////
///////////////////////////////////////////
// CAP app Records Controller

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
              resp = response.data.results[0];
              angular.forEach(mapping["s"], function(key){
                  console.log("m_f_::", key);
                    resp = resp[key];
              });
            }
            else{
              // [TOFIX] for now gets only first result
              if (response.data.results[0])
                resp = response.data.results[0][mapping["s"]];
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

angular.module('cap.app')
  .controller('formAutofillCtrl', capFormAutofillCtrl);