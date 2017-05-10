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
 * @name capClientForm
 * @description
 *    Returns oAuth client form
 * @namespace capClientForm
 * @example
 *    Usage:
 *   <cap-client-form
 *     client="client"
 *     clients="clients"
 *     actions="[
 *       {
 *           'name': 'Save',
 *           'icon': 'fa-check',
 *           'action': 'updateClient',
 *           'class': 'btn-primary',
 *           'close': true
 *       }
 *     ]"
 *   />
 */
angular.module('cap.app').component('capClientForm', {
    // isolated scope binding
    bindings: {
        client: '<',
        clients: '<',
        actions: '<'
    },
    templateUrl: '/static/templates/cap/profile/components/ClientForm.html',
    link: function($scope) {
      $scope.clients_errors = [];
      $scope.clientsFormAlert = [];


    },
    controller: ClientFormController
});


ClientFormController.$inject = [
    '$scope',
    'capUserClient'
];

function ClientFormController($scope, capUserClient) {
    $scope.formAction = function(action) {
        switch (action) {
            case 'updateClient':
                updateClient($scope.$ctrl.client);
                break;
            case 'deleteClient':
                deleteClient($scope.$ctrl.client);
                break;
            case 'createClient':
                createClient($scope.$ctrl.client);
                break;
        }
    }

    var createClient = function(client = null) {
        delete $scope.clients_errors;
        _client = client ? client : {
            name: name,
            description: description,
            website: website,
            redirect_uris: redirect_uris,
            is_confidential: is_confidential
        };

        var ru = [];
        if (_client && _client.redirect_uris)
          ru = _client.redirect_uris.split('\n');
        capUserClient.createClient(_client.name, _client.description, _client.website, ru, _client.is_confidential)
            .then(function(data) {
                $scope.$ctrl.clients.push(data.data);
                $scope.clientFormAlert = {
                    status: data.status,
                    message: "OK"
                };
            }, function(error) {
                $scope.clients_errors = error.data.errors;
                $scope.clientFormAlert = {
                    status: error.status,
                    message: "Something went wrong"
                };
            })
    };


    var updateClient = function(client) {
        if (client && client.redirect_uris)
          client.redirect_uris = client.redirect_uris.split('\n');
        capUserClient.actionClient(client.client_id, 'POST', payload = client)
            .then(function(data) {
                $scope.clientFormAlert = {
                    status: data.status,
                    message: "OK"
                }
            }, function(error) {
                $scope.clients_errors = error.data.errors;
                $scope.clientFormAlert = {
                    status: error.status,
                    message: "Something went wrong"
                }
            })
    };

    var deleteClient = function(client) {
        capUserClient.actionClient(client.client_id, 'DELETE')
            .then(function(data) {
                var index = $scope.$ctrl.clients.indexOf(client);
                $scope.$ctrl.clients.splice(index, 1);
                $scope.clients_errors = error.data.errors;
            }, function(error) {
                $scope.clients_errors = error.data.errors;
                $scope.clientFormAlert = {
                    status: error.status,
                    message: "Something went wrong"
                }
            })
    };

}
