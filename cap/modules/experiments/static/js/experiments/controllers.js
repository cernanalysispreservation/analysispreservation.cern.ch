define([], function() {
  var controllers = angular.module('cap.experiments.controllers', [])
    .controller('experimentsController', [
      '$scope',
      'capLocalClient',
       function($scope, capLocalClient) {
        $scope.hello = 'CERN Analysis Preservation experiments';
        $scope.notification = 'Welcome to CERN Analysis Preservation experiments';
        $scope.init = function(exp){
          $scope.exp = exp;
        };
        $scope.get_experiment_records= function(){
            capLocalClient.get_experiment_records(exp = $scope.exp, limit=30)
            .then(function(response) {
              $scope.experiments = response;
            }, function(error) {
              $scope.hello = "ERROR";
            }, function(update){
              $scope.notification = $scope.notification + '<br />' + update;
            });
        };
      }]);
  return controllers;
});