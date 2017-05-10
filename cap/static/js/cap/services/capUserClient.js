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


var oAuth2ServerURI = '/api/applications';

var capUserClient = function($http, $q) {
	return {
    get_user: function() {
      var deferred = $q.defer();
      deferred.notify('started');
      var url = '/api/me';
      $http({
        method: 'GET',
        url: url
      })
      .then(function(response) {
        deferred.notify('finished');
        deferred.resolve(response);
      }, function (error) {
        deferred.notify('error');
        deferred.reject(error);
      });
      return deferred.promise;
    },
    get_experiment_menu: function(limit) {
      var deferred = $q.defer();
      deferred.notify('started');
      var url = '/api/menu';
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
    get_access_apps: function() {
      var deferred = $q.defer();
      deferred.notify('started');
      var url = oAuth2ServerURI;
      $http({
        method: 'GET',
        url: url
      }).then(function(response) {
          deferred.notify('finished');
          deferred.resolve(response);
        }, function (error) {
          deferred.notify('error');
          deferred.reject(error);
      });
      return deferred.promise;
    },
    createToken: function(name, scopes) {
      var deferred = $q.defer();
      deferred.notify('started');
      var url = oAuth2ServerURI+"/tokens/new/";
      $http({
        method: 'POST',
        url: url,
        data: {
          name: name,
          scopes: scopes
        }
      }).then(function(response) {
          deferred.notify('finished');
          deferred.resolve(response);
        }, function (error) {
          deferred.notify('error');
          deferred.reject(error);
      });
      return deferred.promise;
    },
    createClient: function(name, description, website, redirect_uris, is_confidential) {
      var deferred = $q.defer();
      deferred.notify('started');
      var url = oAuth2ServerURI+"/clients/new/";
      $http({
        method: 'POST',
        url: url,
        data: {
          name: name,
          description: description,
          website: website,
          redirect_uris: redirect_uris,
          is_confidential: is_confidential
        }
      }).then(function(response) {
          deferred.notify('finished');
          deferred.resolve(response);
        }, function (error) {
          deferred.notify('error');
          deferred.reject(error);
      });
      return deferred.promise;
    },
    revokeToken: function(token_id) {
      var deferred = $q.defer();
      deferred.notify('started');
      var url = oAuth2ServerURI+"/tokens/"+token_id+"/revoke";
      $http({
        method: 'GET',
        url: url
      }).then(function(response) {
          deferred.notify('finished');
          deferred.resolve(response);
        }, function (error) {
          deferred.notify('error');
          deferred.reject(error);
      });
      return deferred.promise;
    },
    actionToken: function(token_id, action, payload=null) {
      var url = oAuth2ServerURI+"/tokens/"+token_id+"/";
      var req = {
        method: action,
        url: url,
      };
      if (payload)
        req["data"] = {name: payload.name, scopes: payload.scopes};

      var deferred = $q.defer();
      deferred.notify('started');
      $http(req).then(function(response) {
          deferred.notify('finished');
          deferred.resolve(response);
        }, function (error) {
          deferred.notify('error');
          deferred.reject(error);
      });
      return deferred.promise;
    },
    actionClient: function(client_id, action, payload=null) {
      var url = oAuth2ServerURI+"/clients/"+client_id+"/";
      var req = {
        method: action,
        url: url,
      };
      if (payload) {
        req["data"] = {
          name: payload.name,
          description: payload.description,
          website: payload.website,
          redirect_uris: payload.redirect_uris,
          is_confidential: payload.is_confidential
        };
      }

      var deferred = $q.defer();
      deferred.notify('started');
      $http(req).then(function(response) {
          deferred.notify('finished');
          deferred.resolve(response);
        }, function (error) {
          deferred.notify('error');
          deferred.reject(error);
      });
      return deferred.promise;
    }
  }
};

capUserClient.$inject = [
  '$http',
  '$q'
];

angular.module('cap.services')
  .service('capUserClient', capUserClient);


