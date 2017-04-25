/*
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2017 CERN.
 *
 * CERN Analysis Preservation Framework is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * CERN Analysis Preservation Framework is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CERN Analysis Preservation Framework; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */


/**
 * @ngdoc factory
 * @name httpInterceptor
 * @namespace httpInterceptor
 * @description
 *    Handles error pages
 *
 */
angular.module("cap.factories")
  .factory('httpInterceptor', ['$q','$location', '$injector',function ($q, $location, $injector) {
    return {
      'response': function(response) {
          if (response.status === 403) {
              $injector.get('$state').transitionTo('app.403', null, {
                location: false
              });
              return $q.reject(response);
          } else if (response.status === 500) {
            $injector.get('$state').transitionTo('app.500', null, {
              location: false
            });
            return $q.reject(response);
          }
          return response || $q.when(response);
      },

      'responseError': function(rejection) {

          if (rejection.status === 403) {
            $injector.get('$state').transitionTo('app.403', null, {
              location: false
            });
            return $q.reject(rejection);
          } else if (rejection.status === 500) {
            $injector.get('$state').transitionTo('app.500', null, {
              location: false
            });
            return $q.reject(rejection);
          }
          return $q.reject(rejection);
      }
    };
  }
])