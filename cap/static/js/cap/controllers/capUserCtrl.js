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
// CAP app User Controller

var capUserCtrl = function($scope, $location, capUserClient) {

  $scope.access_apps = {};
  $scope.scopes={};

  // var keys = Object.keys($scope.scopes);
  // filtered = keys.filter(function(key) {
  //     return $scope.scopes[key]
  // });

  capUserClient.get_access_apps()
    .then(function(data) {
      $scope.access_apps = data.data;

      // angular.forEach(data.data.tokens, function(token){
      //   token.scopes = prepareScopes(token.scopes);
      // })

      angular.forEach(data.data.clients, function(client){
        client.redirect_uris = client.redirect_uris.join('\n');
      })
    })

    var prepareScopes = function(scopes) {
      var _scopes = {};
        angular.forEach(scopes, function(s){
        _scopes[s] = true;
      })

     return _scopes;
    }

  // $scope.createClient = function(client=null, name=null, description=null, website=null, redirect_uris=null, is_confidential=null){
  //   delete $scope.clients_errors;
  //   _client = client ? client : {name:name, description:description, website:website, redirect_uris:redirect_uris, is_confidential:is_confidential};

  //   var ru = _client.redirect_uris.split('\n');
  //   capUserClient.createClient(_client.name, _client.description, _client.website, ru, _client.is_confidential)
  //     .then(function(data) {
  //       $scope.access_apps.clients.push(data.data);
  //     }, function(error) {
  //       $scope.clients_errors = error.data.errors;
  //     })
  // };

  $scope.deleteToken = function(token) {
    capUserClient.actionToken(token.t_id, 'DELETE')
      .then(function(data) {
        var index = $scope.access_apps.tokens.indexOf(token);
        $scope.access_apps.tokens.splice(index, 1);
      })
  };

  // $scope.updateToken = function(token) {
  //   capUserClient.actionToken(token.t_id, 'POST', payload=token)
  //     .then(function(data) {
  //       var index = $scope.access_apps.tokens.indexOf(token);
  //       $scope.access_apps.tokens[index] = token;

  //       $scope.tokenFormAlert = {
  //         status: data.status,
  //         message: "OK"
  //       }
  //     }, function(error){
  //         $scope.tokens_errors = error.data.errors;
  //         $scope.tokenFormAlert = {
  //           status: data.status,
  //           message: "Something went wrong"
  //         }
  //     })
  // };
  $scope.deleteClient = function(client) {
    capUserClient.actionClient(client.client_id, 'DELETE')
      .then(function(data) {
        var index = $scope.access_apps.clients.indexOf(client);
        $scope.access_apps.clients.splice(index, 1);
      })
  };
};

capUserCtrl.$inject = [
  '$scope',
  '$location',
  'capUserClient'
];

angular.module('cap.controllers')
  .controller('UserController', capUserCtrl);

