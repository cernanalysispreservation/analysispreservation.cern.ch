///////////////////////////////////////////
///////////////////////////////////////////
//  CAP app configuration

function capExperimentsConfiguration($routeProvider, $locationProvider) {
  $routeProvider
    .when('/',{
      template : "<h1>Main</h1><p>Click on the links to change this content</p>"
      // templateUrl: 'main.html'
    })
    .when('/deposit/', {
      templateUrl: '/app/deposit',
      controller: 'DepositController',
    })
    .when('/deposit/:depid/', {
      templateUrl: function(params) {
        return '/app/deposit/'+params.depid;
      },
      // template: '{{_html}}',
      controller: 'DepositController',
      // resolve: capDepositCtrl.resolve
    })
    .when('/publications/', {
      templateUrl: '/app/records',
      controller: 'RecordController',
    })
    .when('/records/:recid/', {
      templateUrl: function(params) {
        return '/app/records/'+params.recid;
      },
      // template: '{{_html}}',
      controller: 'RecordController',
      // resolve: capDepositCtrl.resolve
    })
    .when('/deposit/new/lhcb/', {
      templateUrl: '/app/deposit/lhcb/new',
      controller: 'DepositController',
    })
    .when('/deposit/new/cms-analysis/', {
      templateUrl: '/app/deposit/cms-analysis/new',
      controller: 'DepositController',
    })
    .when('/WG/', {
      template: '<h1>WORKING GROUPS (overview)</h1>',
      // templateUrl: 'records.index.html',
      controller: 'WGController'
    })
    .when('/WG/:wg_name', {
      template: '<h1>WORKING GROUPS :: {{params.wg_name}}</h1>',
      // templateUrl: 'records.index.html',
      controller: 'WGController'
    })
    .when('/experiments', {
      templateUrl: '/static/templates/cap/experiments.html',
      // templateUrl: 'records.index.html',
      controller: 'WGController'
    });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
    // rewriteLinks: false
  });
}

// Inject the necessary angular services
capExperimentsConfiguration.$inject = [
    '$routeProvider',
    '$locationProvider'
];

angular.module('cap.app')
  .config(capExperimentsConfiguration);
