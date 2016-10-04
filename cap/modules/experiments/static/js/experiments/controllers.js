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


define([], function() {
  var controllers = angular.module('cap.experiments.controllers', []);

  controllers.controller('experimentsController', [
    '$scope',
    'capLocalClient',
     function($scope, capLocalClient) {
      $scope.hello = 'CERN Analysis Preservation experiments';
      $scope.notification = 'Welcome to CERN Analysis Preservation experiments';
      $scope.init = function(exp){
        $scope.exp = exp;
        $scope.menu = {
          'title': $scope.exp,
          'id': 'menuId',
          'icon': 'fa fa-bars',
          'items': []
        };
        get_experiment_menu();
        $scope.events = [];
        $scope.options = {
          containersToPush: [$('#experiment-land')],
          direction: 'ltr'//,
          // onExpandMenuStart: function() {
          //   $scope.events.push('Started expanding...');
          // },
          // onExpandMenuEnd: function() {
          //   $scope.events.push('Expanding ended!');
          // },
          // onCollapseMenuStart: function() {
          //   $scope.events.push('Started collapsing...');
          // },
          // onCollapseMenuEnd: function() {
          //   $scope.events.push('Collapsing ended!');
          // },
          // onGroupItemClick: function(event, item) {
          //   $scope.events.push('Group Item ' + item.name + ' clicked!');
          // },
          // onItemClick: function(event, item) {
          //   $scope.events.push('Item ' + item.name + ' clicked!');
          // },
          // onTitleItemClick: function(event, menu) {
          //   $scope.events.push('Title item ' + menu.title + ' clicked!');
          // },
          // onBackItemClick: function() {
          //   return $scope.events.push('Back item on ' + menu.title + ' menu level clicked!');
          // }
        };
      };
      var get_experiment_menu= function(){
          capLocalClient.get_experiment_menu()
          .then(function(response) {
            $scope.menu.items = response.data;
          }, function(error) {
            $scope.hello = "ERROR";
          }, function(update){
            $scope.notification = $scope.notification + '<br />' + update;
          });
      };
      $scope.get_experiment_records= function(){
          capLocalClient.get_experiment_records(exp = $scope.exp, limit=30)
          .then(function(response) {
            $scope.experiments = response;
          }, function(error) {
            $scope.hello = "ERROR";
          }, function(update){
            $scope.notification = $scope.notification + '<br />' + update;
          });
      };
    }]
  );

  return controllers;
});
