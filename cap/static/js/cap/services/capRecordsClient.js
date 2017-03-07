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

var capRecordsClient = function($http, $q) {
	return {
      get_record: function(pid_value) {
        var deferred = $q.defer();
        deferred.notify('started');
        var url = '/api/records/'+pid_value;
        $http({
          method: 'GET',
          url: url,
        }).then(function(response) {
            deferred.notify('finished');
            deferred.resolve(response.data);
          }, function (response) {
            deferred.notify('error');
            deferred.reject(response);
        });
        return deferred.promise;
      },
      get_deposit: function(pid_value) {
        var deferred = $q.defer();
        deferred.notify('started');
        var url = '/api/deposits/'+pid_value;
        $http({
          method: 'GET',
          url: url,
        }).then(function(response) {
            deferred.notify('finished');
            deferred.resolve(response.data);
          }, function (response) {
            deferred.notify('error');
            deferred.reject(response);
        });
        return deferred.promise;
      },
      get_new_deposit: function(deposit_group) {
        var deferred = $q.defer();
        deferred.notify('started');
        var url = '/app/deposit/'+deposit_group+'/new';
        $http({
          method: 'GET',
          url: url,
        }).then(function(response) {
            deferred.notify('finished');
            deferred.resolve(response.data);
          }, function (response) {
            deferred.notify('error');
            deferred.reject(response);
        });
        return deferred.promise;
      },
      get_experiment_records: function(limit, page) {
        var deferred = $q.defer();
        deferred.notify('started');
        var url = '/api/records/';
        $http({
          method: 'GET',
          url: url,
          params: {
            size: limit || 20,
            page: page || 1
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
      get_deposits: function(limit, status, page) {
        var deferred = $q.defer();
        deferred.notify('started');
        var url = '/api/deposits/';
        var params = {
          size: limit || 20,
          page: page || 1
        };
        if (status) params["status"] = status;
        $http({
          method: 'GET',
          url: url,
          params: params
        }).then(function(response) {
            deferred.notify('finished');
            deferred.resolve(response);
          }, function (response) {
            deferred.notify('error');
            deferred.reject(response);
        });
        return deferred.promise;
      },
      get_schema: function(url) {
        var deferred = $q.defer();
        deferred.notify('started');
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
      get_schema_form: function(url) {
        var deferred = $q.defer();
        deferred.notify('started');
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
  }
};

capRecordsClient.$inject = [
  '$http',
  '$q'
];

angular.module('cap.services')
  .service('capRecordsClient', capRecordsClient);


