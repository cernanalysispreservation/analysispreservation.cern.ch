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


/**
 * @ngdoc component
 * @name capTokenForm
 * @description
 *    Returns page header
 * @namespace capTokenForm
 * @example
 *  Usage:
 *   <cap-token-form
 *     token="token"
 *     tokens="tokens"
 *     scope-choices="sc"
 *     actions="[
 *       {
 *           'name': 'Save',
 *           'icon': 'fa-check',
 *           'action': 'updateToken',
 *           'class': 'btn-primary',
 *           'close': true
 *       }
 *     ]"
 *   />
 */
angular.module('cap.app').component('capTokenForm', {
    bindings: {
        token: '<',
        tokens: '<',
        scopeChoices: '<',
        actions: '<'
    },
    templateUrl: '/static/templates/cap/profile/components/tokenForm.html',

    // The controller that handles our component logic
    link: function($scope) {
        $scope.tokens_errors = [];
        $scope.tokenFormAlert = [];
    },
    controller: TokenFormController
});


TokenFormController.$inject = [
	'$scope',
	'capUserClient'
];

function TokenFormController($scope, capUserClient) {
	$ctrl = this;

    $scope.formAction = function(action) {
        switch (action) {
            case 'updateToken':
                updateToken($scope.$ctrl._t);
                break;
            case 'deleteToken':
                deleteToken($scope.$ctrl._t);
                break;
            case 'createToken':
                createToken($scope.$ctrl._t);
                break;
        }
    }

    var prepareScopes = function(scopes) {
	  var _scopes = {};
	  angular.forEach(scopes, function(s){
	    _scopes[s] = true;
	  })

	 return _scopes;
    }
    $scope.$ctrl._t =  angular.copy($scope.$ctrl.token);
    $scope.$ctrl._t.scopes = prepareScopes($scope.$ctrl._t.scopes);

    var createToken = function(token = null) {
        if (token || (name && scopes)) {
            _token = token ? token : {
                name: name,
                scopes: scopes
            };
            delete $scope.tokens_errors;
            var filtered = [];
            var keys = Object.keys(_token.scopes);
            filtered = keys.filter(function(key) {
                return _token.scopes[key]
            });

            capUserClient.createToken(_token.name, filtered)
                .then(function(data) {

                    var new_token = {
                        t_id: data.data.t_id,
                        name: data.data.name,
                        access_token: data.data.access_token
                    };
                    $scope.$ctrl.tokens.push(new_token);
	                $scope.tokenFormAlert = {
	                    status: data.status,
	                    message: "OK"
	                }
                }, function(error) {
                    $scope.tokens_errors = error.data.errors;
	                $scope.tokenFormAlert = {
	                    status: error.status,
	                    message: "Something went wrong"
	                }
                })
        }
    };


    var deleteToken = function(token) {
        capUserClient.actionToken(token.t_id, 'DELETE')
            .then(function(data) {
                var index = $scope.$ctrl.tokens.indexOf(token);
                $scope.access_apps.tokens.splice(index, 1);
            })
    };

    var updateToken = function(token) {
        var keys = Object.keys(token.scopes);
        filtered = keys.filter(function(key) {
            return token.scopes[key]
        });

        token.scopes = filtered;
        capUserClient.actionToken(token.t_id, 'POST', payload = token)
            .then(function(data) {
                var index = $scope.$ctrl.tokens.indexOf(token);
                $scope.$ctrl.tokens[index] = token;
                $scope.tokenFormAlert = {
                    status: data.status,
                    message: "OK"
                }
            }, function(error) {
                $scope.tokens_errors = error.data.errors;
                $scope.tokenFormAlert = {
                    status: error.status,
                    message: "Something went wrong"
                }
            })
    };
}
