
///////////////////////////////////////////
///////////////////////////////////////////
// CAP app Controller

var capCtrl = function ($rootScope, $scope, $window, $location, capRecordsClient, capUserClient, $state, hotkeys, screenSize) {
  $scope.$location = $location;
  $scope.current_state_params = $state.params;
  $scope.errors = [];

  $scope.init = function(){
    // Request user info to get application needed user metadata
    initAppWithUser();

    screenSize.rules = {
      large: '(min-width: 1400px)',
      small: '(max-width: 1400px)'
    };

    $scope.menuToggle = function() {
      $scope.menuContainerOpen = !$scope.menuContainerOpen;
    };

    if (screenSize.is('large')){
      $scope.menuContainerOpen = true;
      $scope.menuContainerAutoclose = 'disabled';
    }
    else {
      $scope.menuContainerOpen = false;
      $scope.menuContainerAutoclose = 'outsideClick';
    }

    $scope.menuContainerOpen = screenSize.on( 'large', function(match){
        $scope.menuContainerOpen = match;
        if (match) {
          $scope.menuContainerAutoclose = 'disabled';
        }
        else{
          $scope.menuContainerAutoclose = 'outsideClick';
        }
        $scope.$apply();
    });



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
      onItemClick: function(event, item) {
        if(screenSize.is('small')) {
          $scope.menuContainerOpen = false;
        }
      }//,
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

  var initAppWithUser = function(){

    // $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    //   $scope.currentState = toState.name;

    //   var requireLogin = false;

    //   if (toState.data && toState.data.requireLogin) {
    //     requireLogin = toState.data.requireLogin;
    //   }

    //   if (requireLogin && !$rootScope.currentUser) {
    //     event.preventDefault();
    //     // redirect me to login page

    //     // TO FIX when login popup/modal is ready
    //     $state.go("welcome");
    //   }
    // });

    capUserClient.get_user()
      .then(function(response){
        var user = response.data;

        assignCurrentUser(user);

        // Browser pointing at homepage [user NOT LOGGEDIN]
        // Take him to welcome page
        if(user['collaborations'].length == 0) {
          $state.go('app.experiments');
        }
        // Browser pointing at welcome [user LOGGEDIN]
        // Take him to home/app page
        if ($state.current.name === 'welcome'){
          $state.go('app.index');
        }

        initCapGlobalShortcuts(hotkeys, $scope, $state);
        // If user current_experiment isn't set,
        // set the first one of the list
        $scope.exp = user["current_experiment"];

        if($scope.exp !== ""){
          $scope.menu = {
            'title': $scope.exp,
            'id': 'menuId',
            'icon': 'fa fa-bars',
            'items': []
          };
          get_experiment_menu();
        }
      }, function(error) {
        $scope.errors.push(error);
        $state.go("welcome");
      });
     };

  var get_experiment_menu = function(){
      capUserClient.get_experiment_menu()
        .then(function(response) {

          var _menu = [{
            'name': 'Home',
            'link': 'app.index',
            'icon': 'fa fa-home'
          }];
          $scope.menu.items = _menu.concat(response.data);
        }, function(error) {
          $scope.error = "ERROR";
        });
  };

  $scope.get_experiment_records= function(){
    capRecordsClient.get_experiment_records(exp = $scope.exp, limit=30)
      .then(function(response) {
        $scope.experiments = response;
      }, function(error) {
        $scope.error = "ERROR";
      }, function(update){
        $scope.notification = $scope.notification + '<br />' + update;
      });
  };

  $scope.updateContent= function(arraySize, index){
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
  'capRecordsClient',
  'capUserClient',
  '$state',
  'hotkeys',
  'screenSize'
];

angular.module('cap.app')
  .controller('capCtrl', capCtrl);
