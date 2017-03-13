// Setup Records
angular.module('capRecords', [
  'schemaForm',
  'invenioRecords.factories',
  'invenioRecords.services',
  'invenioRecords.controllers',
  'invenioRecords.directives'
]);

// Setup Search
angular.module('capSearch', [
  'invenioSearch.services',
  'invenioSearch.controllers',
  'invenioSearch.directives'
]);


angular.module('cap.services', []);
angular.module('cap.controllers', []);
angular.module('cap.directives', []);
angular.module('cap.factories', []);

// Setup Everyhting
angular.module('cap.app', [
  'matchMedia',
  'capSearch',
  'capRecords',
  'invenioFiles',
  'ui.router',
  'cap.services',
  'cap.controllers',
  'cap.directives',
  'cap.factories',
  'cap.pushmenu',
  'angular-loading-bar',
  'ui.bootstrap',
  'angular.filter',
  'cfp.hotkeys'
]);