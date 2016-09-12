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
  var services = angular.module('cap.records.services', [])
    .service('capLocalClient', ['$http', '$q', function($http, $q) {
      return {
        get_records: function(limit) {
          var deferred = $q.defer();
          deferred.notify('started');
          $http({
            method: 'GET',
            url: '/records',
            params: {
              size: limit || 20,
            }
          }).then(function(response) {
              deferred.notify('finished');
              deferred.resolve(response);
            }, function (response) {
              deferred.notify('error');
              deferred.reject(response);
          });
          return deferred.promise;
        },
        get_record_permissions: function(pid_value){
          var deferred = $q.defer();
          deferred.notify('started');
          $http({
            method: 'GET',
            url: '/records/'+pid_value+'/permissions',
            params: {}
          }).then(function(response) {
              deferred.notify('finished');
              deferred.resolve(response);
            }, function (response) {
              deferred.notify('error');
              deferred.reject(response);
          });
          return deferred.promise;
        },
        set_record_permissions: function(pid_value, permissions){
          var deferred = $q.defer();
          deferred.notify('started');
          $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(permissions),
            url: '/records/'+pid_value+'/permissions/update',
          }).then(function(response) {
              deferred.notify('finished');
              deferred.resolve(response);
            }, function (response) {
              deferred.notify('error');
              deferred.reject(response);
          });
          return deferred.promise;
        },
        change_record_privacy: function(pid_value){
          var deferred = $q.defer();
          deferred.notify('started');
          $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(permissions),
            url: '/records/'+pid_value+'/permissions/privacy/change',
          }).then(function(response) {
              deferred.notify('finished');
              deferred.resolve(response);
            }, function (response) {
              deferred.notify('error');
              deferred.reject(response);
          });
          return deferred.promise;
        }
      };
    }]);
  return services;
});
