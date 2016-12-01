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
      url: '/',
      views: {
        '': {
          templateUrl : '/templates/app',
          controller: 'capCtrl'
        }
      }
    })
    .state({
      name: 'app.working_groups',
      url: 'WG',
      views: {
        'content': {
          template: '<h1>WORKING GROUPS (overview)</h1>',
          controller: 'WGController',
        },
        'header': {},
        'sidebar': {},
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.working_group_item',
      url: 'WG/{wg_name}',
      views: {
        'content': {
          template: '<h1>WORKING GROUPS :: {{wg_name}}</h1>',
          controller: 'WGController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.experiments',
      url: 'experiments',
      views: {
        'content': {
          templateUrl: '/static/templates/cap/experiments.html',
          controller: 'WGController',
        },
        'sidebar': {
          template: "<span></span>"
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.publications',
      url: 'publications',
      views: {
        'content': {
          templateUrl: '/app/records',
          controller: 'RecordController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.records',
      url: 'records/{recid}',
      views: {
        'content': {
          templateUrl: function($stateParams) {
            return '/app/records/'+$stateParams.recid;
          },
          controller: 'RecordController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit',
      url: 'deposit?status',
      views: {
        'content': {
          templateUrl: function($stateParams) {
            return '/app/deposit?status='+$stateParams.status;
          },
          controller: 'DepositController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_item',
      url: 'deposit/{depid:int}',
      views: {
        'content': {
          templateUrl: function($stateParams) {
            return '/app/deposit/'+$stateParams.depid;
          },
          controller: 'DepositController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_new_lhcb',
      url: 'deposit/new/lhcb',
      views: {
        'content': {
          templateUrl: '/app/deposit/lhcb/new',
          controller: 'DepositController',
        }
      },
      data: {
        requireLogin: true
      }
    })
    .state({
      name: 'app.deposit_new_cms',
      url: 'deposit/new/cms-analysis',
      views: {
        'content': {
          templateUrl: '/app/deposit/cms-analysis/new',
          controller: 'DepositController',
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
