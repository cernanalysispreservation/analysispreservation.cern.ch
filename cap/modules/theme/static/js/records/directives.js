define([], function() {
    var directives = angular.module('cap.records.directives', [])
        .directive('resultItem', function() {
            return {
                scope: {
                    content: '='
                },
                controller: ['$scope', function($scope) {
                    $scope.getTemplateUrl = function() {
                        if (angular.isArray($scope.content)) {
                            return '/static/html/result_array.html';
                        } else if (typeof $scope.content === 'object'){
                            return '/static/html/result_object.html';
                        } else {
                            return '/static/html/result_value.html';
                        }
                    }
                }],
                template: '<ng-include src="getTemplateUrl()" />'
            };
        });
    return directives;
});
