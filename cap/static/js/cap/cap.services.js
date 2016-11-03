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


var services = angular.module('cap.services', [])
  .service('capLocalClient', ['$http', '$q', function($http, $q) {
    return {
      get_experiment_records: function(limit) {
        var deferred = $q.defer();
        deferred.notify('started');
        var url = '/api/records/';
        $http({
          method: 'GET',
          url: url,
          params: {
            size: limit || 20,
            page: 1
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
      get_experiment_menu: function(limit) {
        var deferred = $q.defer();
        deferred.notify('started');
        var url = '/app/experiment/'+'CMS'+'/menu';
        $http({
          method: 'GET',
          url: url
        }).then(function(response) {
            deferred.notify('finished');
            deferred.resolve(response);
          }, function (response) {
            deferred.notify('error');
            deferred.reject(response);
        });
        return deferred.promise;
      },
      get_deposit_index: function(limit) {
        var deferred = $q.defer();
        deferred.notify('started');
        var url = '/deposit';
        $http({
          method: 'GET',
          url: url
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

