require([
    'js/records/app',
  ], function(app) {
      // Initialize the app
      angular.element(document).ready(function() {
        angular.bootstrap(document.getElementById("cap-records"), ['cap.records']);
        angular.bootstrap(document.getElementById("record-permissions"), ['cap.records']);
        angular.bootstrap(document.getElementById("record-files"), ['cap.records']);
      });

      // Emit info
      console.info('Hello from CERN Analysis Preservation records');
});