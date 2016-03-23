require([
    'angular',
    'jquery',
    'node_modules/invenio-search-js/src/invenio-search-js/invenioSearch.module.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'js/records/directives',
    'js/records/filters'
    ], function(angular, jquery, invenioSearch, bootstrap, directives, filters) {
    angular.element(document).ready(function() {
        angular.bootstrap(
            document.getElementById('invenio-search'), ['invenioSearch',
            'cap.records.directives', 'cap.records.filters']
        );
    })
});
