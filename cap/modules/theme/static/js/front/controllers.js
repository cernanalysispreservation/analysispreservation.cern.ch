define(['angular'], function(angular) {
  var controllers = angular.module('cap.front.controllers', [])
    .controller('homeController', [
      '$scope', function($scope) {
          $scope.hello = 'Welcome to CERN Analysis Preservation portal';
          $scope.time = new Date();
          $scope.updateTime = function() {
            $scope.time = new Date();
          };
      }
    ]);
    // .controller('recordsController', [
    //   '$scope', function($scope) {
    //     $scope.title = "Those are the latest records";
    //     $scope.records = ['banana', 'apple'];
    //   }
    // ]);
  return controllers;
});