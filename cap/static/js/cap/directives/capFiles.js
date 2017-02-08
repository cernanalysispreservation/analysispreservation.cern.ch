angular.module('cap.directives').directive('capFiles', ['capRecordsClient', function(capRecordsClient) {
  return {
    restrict: 'E',
    templateUrl: '/static/templates/cap/uploaded_files.html',
    scope: {
      links: '='
    },
    link: function(scope, element, attrs) {
      capRecordsClient.get_files(scope.links.bucket.split('/').pop())
      .then(function(response) {
        scope.files_results = response;
      }, function(error) {
        scope.error = error;
      });  
    }
  }
}])