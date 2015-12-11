require([
    'js/experiments/app',
  ], function(app) {
      // Initialize the app
      angular.element(document).ready(function() {
        angular.bootstrap(document.getElementById("cap-experiments"), ['cap.experiments']);
      });

      // Emit info
      console.info('Hello from experiments!');
});