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
        },
        get_record_permissions: function(pid_value){
          var deferred = $q.defer();
          deferred.notify('started');
          $http({
            method: 'GET',
            url: '/records/'+pid_value+'/permissions',
            params: {}
          }).then(function(response) {
              deferred.notify('finished');
              deferred.resolve(response);
            }, function (response) {
              deferred.notify('error');
              deferred.reject(response);
          });
          return deferred.promise;
        },
        set_record_permissions: function(pid_value, permissions){
          var deferred = $q.defer();
          deferred.notify('started');
          $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(permissions),
            url: '/records/'+pid_value+'/permissions/update',
          }).then(function(response) {
              deferred.notify('finished');
              deferred.resolve(response);
            }, function (response) {
              deferred.notify('error');
              deferred.reject(response);
          });
          return deferred.promise;
        },
        change_record_privacy: function(pid_value){
          var deferred = $q.defer();
          deferred.notify('started');
          $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(permissions),
            url: '/records/'+pid_value+'/permissions/privacy/change',
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