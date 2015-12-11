define([], function() {
  var services = angular.module('cap.records.services', [])
    .service('capLocalClient', ['$http', '$q', function($http, $q) {
      return {
        get_records: function(limit) {
          var deferred = $q.defer();
          deferred.notify('started');
          $http({
            method: 'GET',
            url: '/records',
            params: {
              size: limit || 20,
            }
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
  return services;
});