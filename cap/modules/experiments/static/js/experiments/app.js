define([
    'angular',
    'js/experiments/services',
    'js/experiments/controllers'
  ], function (angular) {
  var app = angular.module('cap.experiments', [
    'cap.experiments.services',
    'cap.experiments.controllers',
  ]);
  return app;
});