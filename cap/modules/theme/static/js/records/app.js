define([
    'angular',
    'js/records/services',
    'js/records/controllers'
  ], function (angular) {
  var app = angular.module('cap.records', [
    'cap.records.services',
    'cap.records.controllers',
  ]);
  return app;
});