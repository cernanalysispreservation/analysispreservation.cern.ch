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

var capModal = function($scope, $interpolate , $http, $uibModal, capUserClient) {
  var $ctrl = this;

  $ctrl.openModal = function (params, header, body) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: "/static/templates/cap/profile/components/tokenModal.html",
      controller: 'capModalInstanceCtrl',
      controllerAs: '$ctrl',
      windowClass: 'cap-modal',
      resolve: {
        actions: function() {},
        params: function () {
          return params;
        },
        header: function(){
          return header ? header : '';
        },
        body: function(){
          if (body.indexOf(['client', 'token']))
            return body;
        }
      }
    });
  };
};

angular.module('cap.controllers')
  .controller(
    'capModalInstanceCtrl',
    function ($scope, $uibModalInstance, params, header, body) {
      var $ctrl = this;

      var _actions = {
        'updateToken' : {
          'name': 'Save',
          'icon': 'fa-check',
          'action': 'updateToken',
          'class': 'btn-primary',
          'close': true
        },
        'createToken' : {
          'name': 'Create',
          'icon': 'fa-check',
          'action': 'createToken',
          'class': 'btn-primary',
          'close': true
        },
        'updateClient' : {
          'name': 'Save',
          'icon': 'fa-check',
          'action': 'updateClient',
          'class': 'btn-primary',
          'close': true
        },
        'createClient' : {
          'name': 'Save',
          'icon': 'fa-check',
          'action': 'createClient',
          'class': 'btn-primary',
          'close': true
        }
      };
      var _a = [];
      if (params.actions) {
        angular.forEach(params.actions, function(action){
          if (action in _actions) {
            _a.push(_actions[action])
          }
        })
      }

      params.actions = _a;

      $ctrl.params = params;
      $ctrl.header = header;
      $ctrl.body = body;

      $ctrl.closeModal = function () {
        $uibModalInstance.close();
      };
    });

capModal.$inject = [
  '$scope',
  '$interpolate',
  '$http',
  '$uibModal',
  'capUserClient'
];

angular.module('cap.controllers')
  .controller('capModalCtrl', capModal);