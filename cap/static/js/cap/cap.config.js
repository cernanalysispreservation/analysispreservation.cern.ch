///////////////////////////////////////////
///////////////////////////////////////////
//  CAP app configuration

function capExperimentsConfiguration($stateProvider, $urlRouterProvider ,$locationProvider, $urlMatcherFactoryProvider, $httpProvider) {

  $urlMatcherFactoryProvider.strictMode(false);
  $httpProvider.interceptors.push('httpInterceptor');
  // TOFIX: for intercepting incoming responses when user
  // is LOGGEDOUT and API returns '401'
  // $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
  //   var $http, $state;

  //   // this trick must be done so that we don't receive
  //   // `Uncaught Error: [$injector:cdep] Circular dependency found`
  //   $timeout(function () {
  //     $http = $injector.get('$http');
  //     $state = $injector.get('$state');
  //   });

  //   return {
  //     responseError: function (rejection) {
  //       if (rejection.status !== 401) {
  //         return rejection;
  //       }

  //       console.log("rejected:::;");
  //       $state.go('welcome');
  //       // $window.location.href = '/app/login?next='+pathname;

  //     }
  //   };
  // });

  $urlRouterProvider.otherwise(function($injector) {
    // Render 404 page when url doesn't exist
    var $state = $injector.get('$state');

    $state.go('app.404', null, {
      location: false
    });

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
          templateUrl : '/static/templates/cap/app.html',
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
          templateUrl: '/static/templates/cap/search/search_page.html'
        }
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
      name: 'app.shared',
      url: '/shared',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/shared_records.html'
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
        record: function(capRecordsClient, $stateParams){
          return capRecordsClient
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
      url: '/deposit/{status:(?:draft|published)}',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/deposit/results.html',
          controller: 'capCtrl',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_list',
      url: '/deposit',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/deposit/results.html',
          controller: 'capCtrl',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_item',
      url: '/deposit/{depid}',
      abstract: true,
      views: {
        'content': {
          templateUrl: '/static/templates/cap/content_with_bar.html',
          // controller: 'DepositController'
        }
      },
      resolve: {
        deposit: function(capRecordsClient, $stateParams){
          var _deposit = capRecordsClient
                  .get_deposit($stateParams.depid);

          return _deposit;
        },
        contentBarTabs: function($stateParams){
          return {
            "left": {
              "tabs": [
                {
                "title": "Overview",
                "link": "app.deposit_item.overview({depid:'"+$stateParams.depid+"'})"
                },{
                "title": "Files",
                "link": "app.deposit_item.files({depid:'"+$stateParams.depid+"'})"
                },{
                "title": "Settings",
                "link": "app.deposit_item.settings({depid:'"+$stateParams.depid+"'})"
                }
              ]
            },
            "right": {}
          };
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
          controller: 'DepositFilesController'
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
          templateUrl: '/static/templates/cap/deposit/settings.html',
          controller: 'DepositSettingsController',
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
      abstract: true,
      views: {
        'content': {
          templateUrl: '/static/templates/cap/content_with_bar.html',
          // controller: 'DepositController'
        }
      },
      resolve: {
        deposit: function(capRecordsClient, $stateParams){
          return capRecordsClient
                  .get_new_deposit($stateParams.deposit_group);
        },
        contentBarTabs: function($stateParams){
          return {};
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_new.index',
      url: '',
      views: {
        'contentMain': {
          templateUrl: '/static/templates/cap/deposit/edit.html',
          controller: 'DepositController',
        }
      }
    })
    .state({
      name: 'app.404',
      url: '/404',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/404.html'
        }
      }
    })
    .state({
      name: 'app.403',
      url: '/403',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/403.html'
        }
      }
    })
    .state({
      name: 'app.500',
      url: '/500',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/500.html'
        }
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
