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

var capDepositCtrl = function($scope, $state, $location, $document, $http, deposit, contentBarTabs, capRecordsClient) {
  $scope.msg = {};

  // handles the callback from the received event
  var handleCallback = function (msg) {
      $scope.$apply(function () {
          $scope.msg = JSON.parse(msg.data)
          if($scope.msg.state == 'STARTED') {
            $scope.isFinished = false;
          } else if($scope.msg.state == 'SUCCESS') {
            $scope.isFinished = true;
          } else if($scope.msg.state == 'FAILURE') {
            $scope.error = $scope.msg.meta.exc_message.message;
          }
      });
  }

  if(deposit.metadata._deposit.id) {
    var source = new EventSource('/api/deposits/'+deposit.metadata._deposit.id+'/sse');    
    source.addEventListener('file_download', handleCallback, false);
  }
  
  $scope.$on(
    'invenio.records.action.success', function(event) {
      var depid = $scope.recordsVM.invenioRecordsEndpoints['self'].split('/').pop();
      $state.go('app.deposit_item.overview', {depid: depid});
    }
  );
  $scope.deposit = deposit;
  $scope.pid_value = deposit.id;
  $scope.contentBarTabs = contentBarTabs;
  $scope.mi = deposit.meta_info;

  $scope.initDeposit = function() {
    $scope.displayNav = true;
    $scope.currentNavItem = 0;
    $scope.isFormRendered = false;
  };


  $scope.$on('sf-render-finished', function(event, val, key) {
    angular.forEach($scope.recordsVM.invenioRecordsForm, function(item, key){
      if (key != 0) item.collapsed = true;
    })
  });

  $scope.$on('fieldAutofilled', function(event, val, key) {
      $scope.modelChanged(val, key);
  });

  // Deposit Navigation for sidebar & forms
  $scope.isEmptyEl = function(el) {
    return !(el === undefined || el === null || Object.keys(el).length === 0);
  }

  $scope.omitNgDirt = function(el){
    if (angular.isString(el)){
      return (el.substring(0, 7) == "object:")
    }
    return false;
  }

  $scope.getRequiredLength = function (req_fields, el){
    var count = 0;
    if (req_fields && el && req_fields.length > 0) {
      angular.forEach(req_fields, function(field){
        if (el[field] && $scope.isEmptyEl(el[field])) count++;
      });
    }
    return count;
  }

  $scope.getLength = function (el){
    if (angular.isObject(el)){
      var count=0;
      Object.keys(el).forEach(function(item){
        if (!_.isEmpty(el[item])) count ++;
      })
      return count;
    }
    else if (angular.isArray(el)) {

      return el.length;
    }
  }

  var scrollToTop = function() {
    $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
  }

  $scope.nextNavItem = function() {
    if ($scope.currentNavItem+1 < $scope.recordsVM.invenioRecordsForm.length) {
      $scope.recordsVM.invenioRecordsForm[$scope.currentNavItem].collapsed = true;
      $scope.recordsVM.invenioRecordsForm[$scope.currentNavItem+1].collapsed = false;
      $scope.currentNavItem++;
      scrollToTop();
    }
  }
  $scope.prevNavItem = function() {
    if ($scope.currentNavItem > 0) {
      $scope.recordsVM.invenioRecordsForm[$scope.currentNavItem].collapsed = true;
      $scope.recordsVM.invenioRecordsForm[$scope.currentNavItem-1].collapsed = false;
      $scope.currentNavItem--;
      scrollToTop();
    }
  }
  $scope.switchNavItem = function(index){
    $scope.recordsVM.invenioRecordsForm[$scope.currentNavItem].collapsed = true;
    $scope.recordsVM.invenioRecordsForm[index].collapsed = false;
    $scope.currentNavItem = index;
    scrollToTop();
  }
  $scope.toggleSidebar = function(){  $scope.displayNav = !$scope.displayNav; }

  $scope.getModelValue = function(path){
    var current = $scope.recordsVM.invenioRecordsModel, i;

    for (i = 0; i < path.length; ++i) {
      if (current[path[i]] == undefined) {
        return undefined;
      } else {
        current = current[path[i]];
      }
    }
    return current;
  };

  $scope.getArrayModelValue = function(path, key_index){
    var current = $scope.recordsVM.invenioRecordsModel, i;

    var _path = angular.copy(path);
    var pathIndex = _path.indexOf("");

    if (pathIndex != -1){
      _path[pathIndex] = key_index;
      for (i = 0; i < _path.length; ++i) {
        if (current[_path[i]] == undefined) {
          return undefined;
        } else {
          current = current[_path[i]];
        }
      }
      return current;
    }
    return undefined;
  };

  $scope.$on('sf-render-finished', function(event){
    if ($scope.recordsVM && $scope.recordsVM.invenioRecordsModel && $scope.recordsVM.invenioRecordsForm) {
      $scope.isFormRendered = true;

      var title_prefix;
      if ($scope.recordsVM.invenioRecordsSchema && $scope.recordsVM.invenioRecordsSchema.title) {
        title_prefix = $scope.recordsVM.invenioRecordsSchema.title;
      }
      var now = new Date();
      $scope.recordsVM.invenioRecordsModel.general_title =
        $scope.recordsVM.invenioRecordsModel.general_title ?
        $scope.recordsVM.invenioRecordsModel.general_title :
        title_prefix + " " + now.toLocaleString();
    }
  });
}

capDepositCtrl.$inject = [
  '$scope',
  '$state',
  '$location',
  '$document',
  '$http',
  'deposit',
  'contentBarTabs',
  'capRecordsClient'
];


angular.module('cap.controllers')
  .controller('DepositController', capDepositCtrl);

