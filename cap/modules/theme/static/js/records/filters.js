define([], function() {
    var filters = angular.module('cap.records.filters', [])
        .filter('propertyFormatter', function () {
            return function (input) {
                return input.charAt(0).toUpperCase() +
                        input.replace(/_/g, ' ').slice(1);
            };
        });
    return filters;
});
