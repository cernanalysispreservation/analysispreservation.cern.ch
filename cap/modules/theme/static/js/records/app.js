define([
    'angular',
    'angular-filter',
    'js/records/services',
    'js/records/controllers'
  ], function (angular) {
  var app = angular.module('cap.records', [
    'cap.records.services',
    'cap.records.controllers',
    'angular.filter',
  ]);
  return app;
});