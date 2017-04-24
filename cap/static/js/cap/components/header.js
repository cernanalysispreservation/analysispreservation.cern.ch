angular.module('cap.app').component('capHeader', {
    // isolated scope binding
    bindings: {
        user: '<',
        menuToggle: '<',
        currentState: '<'
    },
    templateUrl:'/static/templates/cap/components/capHeader.html',

    // The controller that handles our component logic
    controller: function ($scope) {
    }
});