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

var capFormAssociateRecords = function( $scope, $interpolate , $http, $uibModal, capRecordsClient) {
  var $ctrl = this;

  $ctrl.open = function (type) {
    //TOFIX apply the <cap-results> directive in the template
    capRecordsClient.get_deposits(100, 'draft')
      .then(function(response){
        $ctrl.type = type;
        $ctrl.items = response.data.hits.hits;

        var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: "/static/templates/cap/deposit/relateRecordsModal.html",
          controller: 'ModalInstanceCtrl',
          controllerAs: '$ctrl',
          resolve: {
            items: function () {
              return $ctrl.items;
            },
            type: function() {
              return $ctrl.type;
            }
          } 
      });

      modalInstance.result.then(function (selectedItem) {      
        $ctrl.selected = selectedItem;
      });
    });
  };
};

angular.module('cap.controllers').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, type) {
  var $ctrl = this;
  $ctrl.items = items;
  $ctrl.type = type;
  
  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item.metadata._deposit.id);
  };
});

capFormAssociateRecords.$inject = [
  '$scope',
  '$interpolate',
  '$http',
  '$uibModal',
  'capRecordsClient'
];

angular.module('cap.controllers')
  .controller('formAssociateRecords', capFormAssociateRecords);