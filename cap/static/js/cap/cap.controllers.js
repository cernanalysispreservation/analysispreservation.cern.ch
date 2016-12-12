
///////////////////////////////////////////
///////////////////////////////////////////
// CAP app Controller

var capCtrl = function ($rootScope, $scope, $window, $location, capLocalClient, $state) {
  $scope.$location = $location;
  //Variables for search filter fields 
  //TODO(Move to appropriate controller)
  $scope.query = {};
  $scope.queryBy = '$';

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

  var assignCurrentUser = function(user) {
    $rootScope.currentUser = user;
  };

  var get_user = function(){
    capLocalClient.get_user()
      .then(function(response){

        var user = response.data || false;

        assignCurrentUser(user);


        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
          console.log(toState);
          var requireLogin = false;

          if (toState.data && toState.data.requireLogin) {
            requireLogin = toState.data.requireLogin;
          }

          if (requireLogin && !$rootScope.currentUser) {
            event.preventDefault();
            // redirect me to login page

            var pathname = $window.location.pathname;
            $window.location.href = '/app/login?next='+pathname;
          }
        });

        // Browser pointing at homepage [user NOT LOGGEDIN]
        // Take him to welcome page
        if ($state.current.name === '' && !user){
          $state.go('welcome');
        }
        // Browser pointing at welcome [user LOGGEDIN]
        // Take him to home/app page
        else if ($state.current.name === 'welcome' && user){
          $state.go('app');
        }

        // If user current_experiment isn't set, take user
        // to experiments page
        if (user){
          if (user['current_experiment'] === ""){
            $state.go('app.experiments');
          }
          else {
            $scope.exp = user["current_experiment"];
          }

          if($scope.exp !== ""){
            $scope.menu = {
              'title': $scope.exp,
              'id': 'menuId',
              'icon': 'fa fa-bars',
              'items': []
            };
            get_experiment_menu();
          }
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
            'link': 'app',
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

  $scope.updateContent= function(index, arraySize){
    console.log("index");
    console.log(index);
    $(function() {
      for(var i=0; i<arraySize; i++) {
        if(index !== i) {
          $(document.forms[1].childNodes[i]).hide();
        } else {
          $(document.forms[1].childNodes[i]).show();
        }
      }
    });
  };
};

// Inject depedencies
capCtrl.$inject = [
  '$rootScope',
  '$scope',
  '$window',
  '$location',
  'capLocalClient',
  '$state'
];

angular.module('cap.app')
  .controller('capCtrl', capCtrl);
