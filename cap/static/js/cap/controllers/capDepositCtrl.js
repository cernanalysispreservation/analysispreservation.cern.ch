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

var capDepositCtrl = function($scope, $location, $http, deposit, contentBarTabs, capRecordsClient) {
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

    $scope.isFormRendered = false;
  };

  $scope.modelChanged = function(value, key){
    $scope.depositNavModel = $scope.depositNavModel.setIn(key.key, value);
    $scope.recordsVM.removeValidationMessage(value,key)
  };

  $scope.$on('sf-render-finished', function(event){
    if ($scope.recordsVM && $scope.recordsVM.invenioRecordsModel && $scope.recordsVM.invenioRecordsForm) {
      $scope.depositNavModel = Immutable.fromJS($scope.recordsVM.invenioRecordsModel);
      $scope.depositNavForm = $scope.recordsVM.invenioRecordsForm;
      $scope.isFormRendered = true;

      var now = new Date();
      $scope.recordsVM.invenioRecordsModel.general_title =
        $scope.recordsVM.invenioRecordsModel.general_title ?
        $scope.recordsVM.invenioRecordsModel.general_title :
        "Created " + now.toLocaleString();
    }
  });

}

capDepositCtrl.$inject = [
  '$scope',
  '$location',
  '$http',
  'deposit',
  'contentBarTabs',
  'capRecordsClient'
];


angular.module('cap.controllers')
  .controller('DepositController', capDepositCtrl);

