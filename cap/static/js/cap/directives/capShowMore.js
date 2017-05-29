angular.module('cap.directives')
    .directive('showMore', function() {
      return {
            restrict: 'A',
            transclude: true,
            template: [
                '<div class="show-more-container"><ng-transclude></ng-transclude></div>',
                '<a href="#" class="show-more-expand">more</a>',
                '<a href="#" class="show-more-collapse">less</a>',
            ].join(''),
            link: function(scope, element, attrs, controller) {
                var maxHeight = 20;
                var initialized = null;
                var containerDom = element.children()[0];
                var $showMore = angular.element(element.children()[1]);
                var $showLess = angular.element(element.children()[2]);

                scope.$watch(function () {
                    // Watch for any change in the innerHTML. The container may start off empty or small,
                    // and then grow as data is added.
                    return containerDom.innerHTML;
                }, function () {
                    if (null !== initialized) {
                        // This collapse has already been initialized.
                        return;
                    }

                    if (containerDom.clientHeight <= maxHeight) {
                        // Don't initialize collapse unless the content container is too tall.
                        return;
                    }

                    $showMore.on('click', function () {
                        element.removeClass('show-more-collapsed');
                        element.addClass('show-more-expanded');
                        containerDom.style.height = null;
                    });

                    $showLess.on('click', function () {
                        element.removeClass('show-more-expanded');
                        element.addClass('show-more-collapsed');
                        containerDom.style.height = maxHeight + 'px';
                    });

                    initialized = true;
                    $showLess.triggerHandler('click');
                });
            },
      };
    });