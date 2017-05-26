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

/**
 * @ngdoc directive
 * @name capDepositNav
 * @description
 *    Returns deposit's anvigation
 * @namespace capResults
 * @example
 *    Usage:
 *     <cap-deposit-nav form='form' model='model'>
 */
angular.module('cap.directives')
    .directive('capDepositNav', function() {
        return {
            restrit: 'E',
            templateUrl: '/static/templates/cap/deposit/components/depositNav.html',
            scope: {
                form: '=',
                model: '=',
                currentNavItem: '=',
                switchNavItem: '=',
            },
            link: function(scope, element, attrs) {
                scope.$watch('currentNavItem', function(newNav, oldNav) {
                    scope.form[oldNav].collapsed = true;
                    scope.form[newNav].collapsed = false;
                });
                angular.forEach(
                    scope.form,
                    function(item){
                        item.collapsed = true;
                });
                scope.form[scope.currentNavItem].collapsed = false;
            }
        }
    })

angular.module('cap.directives')
    .directive('capDepositNavItem', function() {
        return {
            restrict: 'E',
            templateUrl: '/static/templates/cap/deposit/components/capDepositNavItem.html',
            scope: {
                form: '=',
                collapsed: '=',
                progress: '=',
                model: '=',
                ii: '<',
                switchNavItem: '='
            },
            link: function(scope, element, attrs) {
            }
        }
    })

angular.module('cap.directives')
    .directive('capDepositNavArrayItem', function() {
        return {
            restrict: 'E',
            templateUrl: '/static/templates/cap/deposit/components/capDepositNavArrayItem.html',
            scope: {
                form: '=',
                collapsed: '=',
                progress: '=',
                model: '='
            },
            link: function(scope, element, attrs) {
                scope.level = scope.form.key.length;
            }
        }
    })


angular.module('cap.directives')
    .directive('capDepositNavObject', function() {
        return {
            restrict: 'E',
            templateUrl: '/static/templates/cap/deposit/components/capDepositNavObject.html',
            scope: {
                form: '=',
                collapsed: '=',
                progress: '=',
                model: '=',
                switchNavItem: '=',
                ii: '<'
            },
            link: function(scope, element, attrs) {
                scope.level = scope.form.key.length;
            }
        }
    })

angular.module('cap.directives')
    .directive('capDepositNavArray', function() {
        return {
            restrict: 'E',
            templateUrl: '/static/templates/cap/deposit/components/capDepositNavArray.html',
            scope: {
                form: '=',
                collapsed: '=',
                progress: '=',
                model: '=',
                switchNavItem: '=',
                ii: '<'
            },
            link: function(scope, element, attrs) {
                scope.level = scope.form.key.length;
            }
        }
    })

angular.module('cap.directives')
    .directive('capDepositNavDefault', function() {
        return {
            restrict: 'E',
            templateUrl: '/static/templates/cap/deposit/components/capDepositNavDefault.html',
            scope: {
                form: '=',
                collapsed: '=',
                progress: '=',
                model: '='
            },
            link: function(scope, element, attrs) {
                scope.level = scope.form.key.length;
            }
        }
    })