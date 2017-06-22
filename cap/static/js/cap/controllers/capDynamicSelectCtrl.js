/* -*- coding: utf-8 -*-
 *
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2017 CERN.
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
// CAP Form Dynamic Select from model Controller
//
//  Example for definition form
//  ** pathToArray CAN'T BE A NESTED ARRAY
//
// {
//   "key": "ntuple_userdst_production[].input_dataset",
//   "placeholder": "Please select an input dataset from the previous step",
//   "type": "cap:dynamicSelect",
//   "pathToArray": ["stripping_turbo_selection"],
//   "keyToObserve": "name"
// }
//

var capDynamicSelectCtrl = function( $scope, $interpolate , $http) {
  var $ctrl = this;
  var _key;

  $ctrl.initDynamicSelect = function(model, pathToObserve, key){
    _path = pathToObserve;
    $ctrl._model = model;
    _key = key;

    angular.forEach(pathToObserve, function(path_key) {
      if ($ctrl._model && $ctrl._model[path_key])
        $ctrl._model = $ctrl._model[path_key];
    })
  };

  $ctrl.getTitleMapItem = function(elm){
    return {"value": elm[_key], "name": elm[_key]};
  }
};

capDynamicSelectCtrl.$inject = [
  '$scope',
  '$interpolate',
  '$http',
];

angular.module('cap.controllers')
  .controller('capDynamicSelectCtrl', capDynamicSelectCtrl);