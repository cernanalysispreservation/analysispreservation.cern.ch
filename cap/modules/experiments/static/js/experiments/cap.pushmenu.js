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


define([
  'angular-animate',
  'js/experiments/cap.pushmenu.components'
  ], function() {
    var pushmenu = angular.module('cap.pushmenu', [
      'cap.pushmenu.components']);

  pushmenu.directive('capPushMenu', [
    'capOptions', 'capUtils', function(capOptions, capUtils) {
      return {
        scope: {
          menu: '=',
          options: '=',
        },
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
          var options, width;
          $scope.options = options = angular.extend(capOptions, $scope.options);
          $scope.level = 0;
          $scope.visible = true;
          width = options.menuWidth || 164;
          $scope.$watch("menu", function(){
            var _width = width + options.overlapWidth+1;
            var _element = $element.find('nav');
            $(_element).width(_width);
          });
          this.GetBaseWidth = function() {
            return width;
          };
          this.GetOptions = function() {
            return options;
          };
        }],
        templateUrl: '/static/templates/experiments/pushmenu/MainMenu.html',
        restrict: 'E',
        replace: true
      };
    }
  ]);

  pushmenu.directive('capSubmenu', [
    '$animate', 'capUtils', function($animate, capUtils) {
      return {
        scope: {
          menu: '=',
          level: '=',
          visible: '='
        },
        link: function(scope, element, attr, ctrl) {
          var collapse, marginCollapsed, onOpen, options;
          scope.options = options = ctrl.GetOptions();
          scope.childrenLevel = scope.level + 1;
          onOpen = function() {
            console.log('onopen');
            $(element).width(ctrl.GetBaseWidth());
            if (!scope.collapsed) {
              scope.inactive = false;
            }
            scope.$emit('submenuOpened', scope.level);
          };
          if (scope.level === 0) {
            scope.collasped = false;
            marginCollapsed = - ctrl.GetBaseWidth();
            if (options.collapsed) {
              scope.collapsed = true;
              scope.inactive = true;
              element.css({
                marginLeft: marginCollapsed
              });
            }
            collapse = function() {
              var animatePromise;
              scope.collapsed = !scope.collapsed;
              scope.inactive = scope.collapsed;
              if (scope.collapsed) {
                options.onCollapseMenuStart();
                $(element).css("margin-left", marginCollapsed);
              } else {
                options.onExpandMenuStart();
                $(element).css("margin-left", "0");
              }
              animatePromise = $animate.addClass(element, 'slide', {
                fromMargin: scope.collapsed ? 0 : marginCollapsed,
                toMargin: scope.collapsed ? marginCollapsed : 0
              });
              animatePromise.then(function() {
                scope.$apply(function() {
                  if (scope.collapsed) {
                    return options.onCollapseMenuEnd();
                  } else {
                    return options.onExpandMenuEnd();
                  }
                });
                return;
              });
              if(scope.level === 0)
                capUtils.PushContainers(options.containersToPush, scope.collapsed ? marginCollapsed+options.overlapWidth : options.overlapWidth);
            };
          }
          scope.openMenu = function(event, menu) {
            capUtils.StopEventPropagation(event);
            scope.$broadcast('menuOpened', scope.level);
            options.onTitleItemClick(event, menu);
            if (scope.level === 0 && !scope.inactive || scope.collapsed) {
              collapse();
            } else {
              onOpen();
            }
          };
          scope.onSubmenuClicked = function(item, $event) {
            if (item.menu) {
              if(item.visible && !scope.collapsed)
                item.visible = false;
              else
                item.visible = true;
              scope.inactive = true;
              options.onGroupItemClick($event, item);
            } else {
              options.onItemClick($event, item);
            }
          };
          scope.toggleMenu = function(event, menu) {
            if(menu.visible){
              scope.goBack(event, menu);
            }
            else {
              scope.openMenu(event, menu);
            }
          };
          scope.goBack = function(event, menu) {
            options.onBackItemClick(event, menu);
            scope.visible = false;
            return scope.$emit('submenuClosed', scope.level);
          };
          scope.$watch('visible', (function(_this) {
            return function(visible) {
              var animatePromise;
              if (visible) {
                if (scope.level > 0) {
                  options.onExpandMenuStart();
                  animatePromise = $animate.addClass(element, 'slide', {
                    fromMargin: -256,
                    toMargin: 0
                  });
                  animatePromise.then(function() {
                    scope.$apply(function() {
                      options.onExpandMenuEnd();
                    });
                  });
                }
                onOpen();
              }
            };
          })(this));
          scope.$on('submenuOpened', (function(_this) {
            return function(event, level) {
              var correction, correctionWidth;
              correction = level - scope.level;
              correctionWidth = options.overlapWidth;
              $(element).width(ctrl.GetBaseWidth() + correctionWidth);
              if (scope.level === 0) {
                capUtils.PushContainers(options.containersToPush, correctionWidth);
              }
            };
          })(this));
          scope.$on('submenuClosed', (function(_this) {
            return function(event, level) {
              if (level - scope.level === 1) {
                onOpen();
                capUtils.StopEventPropagation(event);
              }
            };
          })(this));
          scope.$on('menuOpened', (function(_this) {
            return function(event, level) {
              if (scope.level - level > 0) {
                scope.visible = false;
              }
            };
          })(this));
        },
        templateUrl: '/static/templates/experiments/pushmenu/SubMenu.html',
        require: '^capPushMenu',
        restrict: 'EA',
        replace: true
      };
    }
  ]);

  pushmenu.factory('capUtils', function() {
    var DepthOf, PushContainers, StopEventPropagation;
    StopEventPropagation = function(e) {
      if (e.stopPropagation && e.preventDefault) {
        e.stopPropagation();
        e.preventDefault();
      } else {
        e.cancelBubble = true;
        e.returnValue = false;
      }
    };
    DepthOf = function(menu) {
      var depth, item, maxDepth, _i, _len, _ref;
      maxDepth = 0;
      if (menu.items) {
        _ref = menu.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.menu) {
            depth = DepthOf(item.menu) + 1;
          }
          if (depth > maxDepth) {
            maxDepth = depth;
          }
        }
      }
      return maxDepth;
    };
    PushContainers = function(containersToPush, absoluteDistance) {
      if (!containersToPush) {
        return;
      }

      return $.each(containersToPush, function() {
        return $(this).stop().animate({
          marginLeft: absoluteDistance
        });
      });
    };
    return {
      StopEventPropagation: StopEventPropagation,
      DepthOf: DepthOf,
      PushContainers: PushContainers
    };
  });

  pushmenu.animation('.slide', function() {
    return {
      addClass: function(element, className, onAnimationCompleted, options) {
        element.removeClass('slide');
        element.css({
          marginLeft: options.fromMargin + 'px'
        });
        element.animate({
          marginLeft: options.toMargin + 'px'
        }, onAnimationCompleted);
      }
    };
  });

  pushmenu.value('capOptions', {
    containersToPush: null,
    wrapperClass: 'multilevelpushmenu_wrapper',
    menuInactiveClass: 'multilevelpushmenu_inactive',
    menuWidth: 0,
    menuHeight: 0,
    collapsed: false,
    fullCollapse: true,
    direction: 'ltr',
    backText: 'Back',
    backItemClass: 'backItemClass',
    backItemIcon: 'fa fa-angle-right',
    groupIcon: 'fa fa-angle-right',
    mode: 'overlap',
    overlapWidth: 55,
    preventItemClick: true,
    preventGroupItemClick: true,
    swipe: 'both',
    onCollapseMenuStart: function() {},
    onCollapseMenuEnd: function() {},
    onExpandMenuStart: function() {},
    onExpandMenuEnd: function() {},
    onGroupItemClick: function() {},
    onItemClick: function() {},
    onTitleItemClick: function() {},
    onBackItemClick: function() {},
    onMenuReady: function() {}
  });

  return pushmenu;
});
