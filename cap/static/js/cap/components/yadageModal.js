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
// CAP app Form Select from modal Controller

var yadageModal = function($scope, $interpolate , $http, $uibModal, capRecordsClient) {
  var $ctrl = this;

  $ctrl.openModal = function (opts, workflows, inputs) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: "/static/templates/cap/records/components/yadageModal.html",
      controller: 'yadageModalInstanceCtrl',
      controllerAs: '$ctrl',
      windowClass: 'yadage-modal',
      resolve: {
        name: function() { return opts.name},
        workflows: function() { return workflows },
        inputs: function() { return inputs }
      }
    });
  };
};

angular.module('cap.controllers')
  .controller(
    'yadageModalInstanceCtrl',
    function ($scope, $uibModalInstance, capRecordsClient, name,  workflows, inputs){//, params, header, body) {
      var $ctrl = this;

      $ctrl.workflows = workflows;
      $ctrl.inputs = inputs;
      $ctrl.name = name;

      $ctrl.run = function() {
        var data_payload = {
          "inputURL": "",
          "toplevel": "",
          "workflow": workflows[$ctrl.selectedWorkflow].workflow,
          "outputs": $ctrl.output,
          "wflowname": "fromcap",
          "preset_pars":  inputs[$ctrl.selectedInput].files
        }

        var payload = {
          at: $ctrl.at_to_use,
          data: data_payload
        };

        capRecordsClient.runYadageWorkflow(payload)
          .then(
            function(res){
              $ctrl.yadageResp = res.data;
            },
            function(err){
              $ctrl.yadageErr = err.data;
            }
          )
      }

      $ctrl.closeModal = function () {
        $uibModalInstance.close();
      };
    });

yadageModal.$inject = [
  '$scope',
  '$interpolate',
  '$http',
  '$uibModal',
  'capRecordsClient'
];

angular.module('cap.controllers')
  .controller('yadageModalCtrl', yadageModal);