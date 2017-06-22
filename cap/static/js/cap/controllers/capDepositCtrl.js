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
    $scope.progress = {};
    $scope.type = {};
    $scope.req = {};
    $scope.current_key = '';
    $scope.depositionForm = {};
    $scope.forms = [];
    $scope.depositNavModel = {};
    $scope.depositNavForm = [];
    $scope.displayNav = true;
    $scope.currentNavItem = 0;
    $scope.isFormRendered = false;
  };

  $scope.$on('fieldAutofilled', function(event, val, key) {
      $scope.modelChanged(val, key);
  });
    // another controller or even directive

  $scope.modelChanged = function(value, key){
    // [TOFIX] Right now array model values are represented as objects
    // with key "0", "1", "2", ...
    $scope.depositNavModel = $scope.depositNavModel.setIn(key.key, value);
    $scope.recordsVM.removeValidationMessage(value,key)
  };

  // Deposit Navigation Actions
  var scrollToTop = function() {
    $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
  }

  $scope.nextNavItem = function() {
    if ($scope.currentNavItem+1 < $scope.depositNavForm.length) {
      $scope.currentNavItem++;
      scrollToTop();
    }
  }
  $scope.prevNavItem = function() {
    if ($scope.currentNavItem > 0) {
      $scope.currentNavItem--;
      scrollToTop();
    }
  }
  $scope.switchNavItem = function(index){
    $scope.currentNavItem = index;
    scrollToTop();
  }
  $scope.toggleSidebar = function(){  $scope.displayNav = !$scope.displayNav; }

  $scope.$on('sf-render-finished', function(event){
    if ($scope.recordsVM && $scope.recordsVM.invenioRecordsModel && $scope.recordsVM.invenioRecordsForm) {
      $scope.depositNavModel = Immutable.fromJS($scope.recordsVM.invenioRecordsModel);
      $scope.depositNavForm = $scope.recordsVM.invenioRecordsForm;
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

