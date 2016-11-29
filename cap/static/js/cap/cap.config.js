///////////////////////////////////////////
///////////////////////////////////////////
//  CAP app configuration

function capExperimentsConfiguration($stateProvider, $urlRouterProvider ,$locationProvider, $urlMatcherFactoryProvider) {

  $urlMatcherFactoryProvider.strictMode(false);

  $stateProvider
    .state({
      name: 'home',
      url: '/',
      template : "<h1>Main</h1><p>Click on the links to change this content</p>"
      // templateUrl: 'main.html'
    })
    .state({
      name: 'working_groups',
      url: '/WG',
      template: '<h1>WORKING GROUPS (overview)</h1>',
      // templateUrl: 'records.index.html',
      controller: 'WGController'
    })
    .state({
      name: 'working_group_item',
      url: '/WG/{wg_name}',
      template: '<h1>WORKING GROUPS :: {{wg_name}}</h1>',
      // templateUrl: 'records.index.html',
      controller: 'WGController'
    })
    .state({
      name: 'experiments',
      url: '/experiments',
      templateUrl: '/static/templates/cap/experiments.html',
      // templateUrl: 'records.index.html',
      controller: 'WGController'
    })
    .state({
      name: 'publications',
      url: '/publications',
      templateUrl: '/app/records',
      controller: 'RecordController',
    })
    .state({
      name: 'records',
      url: '/records/{recid}',
      templateUrl: function($stateParams) {
        return '/app/records/'+$stateParams.recid;
      },
      // template: '{{_html}}',
      controller: 'RecordController',
      // resolve: capDepositCtrl.resolve
    })
    .state({
      name: 'deposit',
      url: '/deposit?status',
      templateUrl: function($stateParams) {
        return '/app/deposit?status='+$stateParams.status;
      },
      controller: 'DepositController',
    })
    .state({
      name: 'deposit_item',
      url: '/deposit/{depid:int}',
      templateUrl: function($stateParams) {
        return '/app/deposit/'+$stateParams.depid;
      },
      // template: '{{_html}}',
      controller: 'DepositController',
      // resolve: capDepositCtrl.resolve
    })
    .state({
      name: 'deposit_new_lhcb',
      url: '/deposit/new/lhcb',
      templateUrl: '/app/deposit/lhcb/new',
      controller: 'DepositController',
    })
    .state({
      name: 'deposit_new_cms',
      url: '/deposit/new/cms-analysis',
      templateUrl: '/app/deposit/cms-analysis/new',
      controller: 'DepositController',
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
    '$urlMatcherFactoryProvider'
];

angular.module('cap.app')
  .config(capExperimentsConfiguration);
