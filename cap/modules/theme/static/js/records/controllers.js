define([], function() {
  var controllers = angular.module('cap.records.controllers', [])
    .controller('recordsController', [
      '$scope',
      'capLocalClient',
       function($scope, capLocalClient) {
        $scope.hello = 'CAP Records';
        $scope.notification = 'Welcome to CAP Records';
        $scope.get_records= function(limit) {
            capLocalClient.get_records()
            .then(function(response) {
              $scope.records = response;
            }, function(error) {
              $scope.hello = "ERROR";
            }, function(update){
              $scope.notification = $scope.notification + '<br />' + update;
            });
        };
      }]);
  return controllers;
});