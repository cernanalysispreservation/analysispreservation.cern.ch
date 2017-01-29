///////////////////////////////////////////
///////////////////////////////////////////
//  CAP app configuration

function capExperimentsConfiguration($stateProvider, $urlRouterProvider ,$locationProvider, $urlMatcherFactoryProvider, $httpProvider) {

  $urlMatcherFactoryProvider.strictMode(false);

  // TOFIX: for intercepting incoming responses when user
  // is LOGGEDOUT and API returns '401'
  $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
    var $http, $state;

    // this trick must be done so that we don't receive
    // `Uncaught Error: [$injector:cdep] Circular dependency found`
    $timeout(function () {
      $http = $injector.get('$http');
      $state = $injector.get('$state');
    });

    return {
      responseError: function (rejection) {
        if (rejection.status !== 401) {
          return rejection;
        }

        $window.location.href = '/app/login?next='+pathname;

      }
    };
  });


  $stateProvider
    .state({
      name: 'welcome',
      url: '/welcome',
      templateUrl : '/static/templates/cap/welcome.html'
    })
    .state({
      name: 'app',
      url: '',
      abstract: true,
      views: {
        '': {
          templateUrl : '/templates/app',
          controller: 'capCtrl'
        }
      }
    })
    .state({
      name: 'app.index',
      url: '/',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/experiment_intro.html'
        }
      }
    })
    .state({
      name: 'app.search',
      url: '/search',
      views: {
        'content': {
          templateUrl: '/app/search'
        }
      }
    })
    .state({
      name: 'app.working_groups',
      url: '/WG',
      views: {
        'content': {
          template: '<div class="container cap-content"><h1>WORKING GROUPS (overview)</h1></div>',
          controller: 'WGController',
        },
        'header': {}
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.working_group_item',
      url: '/WG/{wg_name}',
      views: {
        'content': {
          template: '<div class="container cap-container"><h1>WORKING GROUPS :: {{wg_name}}</h1></div>',
          controller: 'WGController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.experiments',
      url: '/experiments',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/experiments.html',
          controller: 'WGController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.publications',
      url: '/publications',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/shared_records.html',
          controller: 'capCtrl'
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.records',
      // TOFIX check for integers
      url: '/records/{recid}',
      abstract: true,
      views: {
        'content': {
          templateUrl: '/static/templates/cap/content_with_bar.html',
          controller: 'RecordController',
        }
      },
      resolve: {
        record: function(capLocalClient, $stateParams){
          return capLocalClient
                  .get_record($stateParams.recid);
        },
        contentBarTabs: function($stateParams){
          return [{
            "title": "Overview",
            "link": "app.records.overview({recid:"+$stateParams.recid+"})"
            },{
            "title": "Files",
            "link": "app.records.files({recid:"+$stateParams.recid+"})"
            },{
            "title": "Visualisation",
            "link": "app.records.visual({recid:"+$stateParams.recid+"})"
            }];
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.records.overview',
      // TOFIX check for integers
      url: '',
      views: {
        'contentMain': {
          controller: 'RecordController',
          templateUrl: '/static/templates/cap/records/record_detail.html'
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.records.files',
      url: '/files',
      views: {
        'contentMain': {
          templateUrl: "/static/templates/cap/records/files_list.html",
          controller: 'RecordController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.records.visual',
      url: '/visual',
      views: {
        'contentMain': {
          template: '<div class="container cap-content"><h2>Visualisation page</h2></div>',
          controller: 'RecordController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.records.settings',
      url: '/settings',
      views: {
        'contentMain': {
          template: '<div class="container cap-content"><h2>Settings</h2></div>',
          controller: 'RecordController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit',
      url: '/deposit?status',
      views: {
        'content': {
          templateUrl: function($stateParams) {
            return '/app/deposit?status='+$stateParams.status;
          },
          // controller: 'DepositController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_item',
      url: '/deposit/{depid:int}',
      abstract: true,
      views: {
        'content': {
          templateUrl: '/static/templates/cap/content_with_bar.html',
          controller: 'DepositController',
        }
      },
      resolve: {
        deposit: function(capLocalClient, $stateParams){
          return capLocalClient
                  .get_deposit($stateParams.depid);
        },
        contentBarTabs: function($stateParams){
          return [{
            "title": "Overview",
            "link": "app.deposit_item.overview({depid:"+$stateParams.depid+"})"
            },{
            "title": "Files",
            "link": "app.deposit_item.files({depid:"+$stateParams.depid+"})"
            },{
            "title": "Settings",
            "link": "app.deposit_item.settings({depid:"+$stateParams.depid+"})"
          }];
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_item.overview',
      url: '',
      views: {
        'contentMain': {
          templateUrl: "/static/templates/cap/deposit/edit.html",
          controller: 'DepositController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_item.files',
      url: '/files',
      views: {
        'contentMain': {
          templateUrl: "/static/templates/cap/deposit/files_list.html",
          controller: 'DepositController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_item.settings',
      url: '/settings',
      views: {
        'contentMain': {
          template: '<div class="container cap-content"><h2>Settings</h2></div>',
          controller: 'DepositController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.select_deposit_new',
      url: '/deposit/create_new',
      onEnter: ['$state','$stateParams', '$uibModal', function($state, $stateParams, $uibModal) {
          $uibModal.open({
            templateUrl: "/static/templates/cap/deposit/createNewDepositModal.html",
            controller: ['$scope', function($scope) {
              $scope.$on('modal.closing', function (event, toState, toParams) {
                // [TOFIX] needs to transition to previous state, than 'Home'
                $state.go('app.index');
              });
            }],
          });
        }
      ],
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_new',
      url: '/deposit/new/{deposit_group}',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/deposit/edit.html',
          controller: 'DepositController',
        }
      },
      resolve: {
        deposit: function(capLocalClient, $stateParams){
          return capLocalClient
                  .get_new_deposit($stateParams.deposit_group);
        },
        contentBarTabs: function($stateParams){
          return "";
        }
      },
      data: {
        requireLogin: true
      }
    });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
    // rewriteLinks: false
  });

}

// Inject the necessary angular services
capExperimentsConfiguration.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$urlMatcherFactoryProvider',
    '$httpProvider'
];

angular.module('cap.app')
  .config(capExperimentsConfiguration);
