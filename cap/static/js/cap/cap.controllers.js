
///////////////////////////////////////////
///////////////////////////////////////////
// CAP app Controller

var capCtrl = function ($rootScope, $scope, $location, capLocalClient) {
  $scope.$location = $location;

  $scope.hello = 'CERN Analysis Preservation experiments';
  $scope.notification = 'Welcome to CERN Analysis Preservation experiments';
  $scope.init = function(){
    get_user();

    $scope.events = [];
    $scope.options = {
      containersToPush: [],
      direction: 'ltr',
      // onExpandMenuStart: function() {
      //   $scope.events.push('Started expanding...');
      // },
      // onExpandMenuEnd: function() {
      //   $scope.events.push('Expanding ended!');
      // },
      // onCollapseMenuStart: function() {
      //   $scope.events.push('Started collapsing...');
      // },
      // onCollapseMenuEnd: function() {
      //   $scope.events.push('Collapsing ended!');
      // },
      // onGroupItemClick: function(event, item) {
      //   $scope.events.push('Group Item ' + item.name + ' clicked!');
      // },
      // onItemClick: function(event, item) {
      //   $scope.events.push('Item ' + item.name + ' clicked!');
      // }//,
      // onTitleItemClick: function(event, menu) {
      //   $scope.events.push('Title item ' + menu.title + ' clicked!');
      // },
      // onBackItemClick: function() {
      //   return $scope.events.push('Back item on ' + menu.title + ' menu level clicked!');
      // }
    };
  };

  var get_user = function(){
    capLocalClient.get_user()
      .then(function(response){

        $scope.user = response.data || {};
        $scope.exp = response.data["current_experiment"];

        if($scope.exp !== ""){
          $scope.menu = {
            'title': $scope.exp,
            'id': 'menuId',
            'icon': 'fa fa-bars',
            'items': []
          };
          get_experiment_menu();
        }
        else {

        }
      }, function(error) {
        $scope.error = error;
      });
     };

  var get_experiment_menu = function(){
      capLocalClient.get_experiment_menu()
      .then(function(response) {
        var _menu = [{
          'name': 'Home',
          'link': 'home',
          'icon': 'fa fa-home'
        }];
        $scope.menu.items = _menu.concat(response.data);
      }, function(error) {
        $scope.error = "ERROR";
      });
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
};

// Inject depedencies
capCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$location',
  'capLocalClient'
];

angular.module('cap.app')
  .controller('capCtrl', capCtrl);
