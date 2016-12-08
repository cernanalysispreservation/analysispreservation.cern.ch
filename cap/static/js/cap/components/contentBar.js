angular.module('cap.app').component('capContentBar', {
    // isolated scope binding
    bindings: {
        tabs: '<'
    },

    templateUrl:'/static/templates/cap/components/capContentBar.html',

    // The controller that handles our component logic
    controller: function ($scope) {
        $scope.tabs = [{
            "title": "Overview",
            "link": "app.records.overview({recid:6})"
            },{
            "title": "Files",
            "link": "app.records.files({recid:6})"
            },{
            "title": "Visualisation",
            "link": "app.records.visual({recid:6})"
            },{
            "title": "Settings",
            "link": "app.records.overview({recid:6})"
            }];
    }
});