angular.module('cap.app').component('capContentBar', {
    // isolated scope binding
    bindings: {
        tabs: '<'
    },

    templateUrl:'/static/templates/cap/components/capContentBar.html',

    // The controller that handles our component logic
    controller: function ($scope) {
        $scope.tabs = this.tabs;
    }
});