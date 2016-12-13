/*
 * This file is part of CERN Analysis Preservation Framework.
 * Copyright (C) 2016 CERN.
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
 * @ngdoc directive
 * @name capProgressBar
 * @description
 *    Progress bar directive handler
 * @namespace capLoading
 * @example
 *    Usage:
 *     <cap-progress-bar
 *      progress="progress"
 *      type="type"
 *      form="depositionForm"
 *      el="recordsVM.invenioRecordsSchema">
 *     </cap-progress-bar>
 *
 */
var app = angular.module("cap.directives", ['capRecords']);

app.directive('capProgressBar', function() {
  return {
    restrict: 'E',
    scope: {
      form: '=',
      el: '=',
      progress: '=',
      type: '='
    },
    link: function(scope, element, attrs, vm) {
      var req = {};
      var current_key = '';


      // TODO Fix depositionForm to contain categories
      scope.$watch('form.$error', function(newValue, oldValue) {
        // Get the required fields
        if (scope.el) {
          angular.forEach(scope.el.properties, function(value, key) {
            if (key.indexOf("_") !== 0) {
              scope.progress[key] = 0;
              scope.type[key] = '';
              if (value.name !== "_deposit" && value.required !== undefined) {
                req[key] = value.required;
              }
            }
          });
        }
        
        // Not available when no required fields
        angular.forEach(scope.progress, function(value, key){
          if (!(key in req)){
            scope.progress[key] = 'N/A';
            scope.type[key] = 'disabled';
          }
        });
        

        // Calculate percentage for every element
        if (oldValue !== newValue) {
          angular.forEach(scope.form, function(value, key) {
            if ((key.indexOf('$') !== 0) && value.$dirty) {
              angular.forEach(req, function(v, k) {
                if (v.indexOf(key) > -1) {
                  current_key = k;
                }
              });
              if (req[current_key].indexOf(key) > -1) {
                calculatePercentage(req, current_key, value);
              }
            }
          });
        }

        if (scope.form.$valid) {
          angular.forEach(req, function(value, key) {
            scope.progress[key] = 100;
            scope.type[key] = 'success';
          });
        }

        function calculatePercentage(req, current_key, value) {
          if (req[current_key].length == 1) {
            if (value.$invalid) {
              scope.progress[current_key] = 0;
              scope.type[current_key] = '';
            } else {
              scope.progress[current_key] = 100;
              scope.type[current_key] = 'success';
            }
          } else {
            if (value.$valid) {
              scope.progress[current_key] += parseInt(100 / req[current_key].length);
              if (scope.progress[current_key] >= 98 && scope.progress[current_key] <= 102) {
                scope.progress[current_key] = 100;
              }
            }
            if (scope.progress[current_key] == 100) {
              scope.type[current_key] = 'success';
            } else if (scope.progress[current_key] > 0) {
              scope.type[current_key] = 'warning';
            }
          }
        }
      }, true);
    }
  }
});