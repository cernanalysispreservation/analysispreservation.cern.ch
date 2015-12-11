define([], function() {
  var services = angular.module('cap.experiments.services', [])
    .service('capLocalClient', ['$http', '$q', function($http, $q) {
      return {
        get_experiment_records: function(exp,limit) {
          var deferred = $q.defer();
          deferred.notify('started');
          var url = '/records';
          if (exp)
            url = '/records/collection/'+exp;
          $http({
            method: 'GET',
            url: url,
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