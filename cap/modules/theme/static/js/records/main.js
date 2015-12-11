require([
    'js/records/app',
  ], function(app) {
      // Initialize the app
      angular.element(document).ready(function() {
        angular.bootstrap(document.getElementById("cap-records"), ['cap.records']);
      });

      // Emit info
      console.info('Hello from CAP records.');
});