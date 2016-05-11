define(['underscore'], function(_) {
  var controllers = angular.module('cap.records.controllers', [])
    .controller('recordsController', [
      '$scope',
      'capLocalClient',
       function($scope, capLocalClient) {
        $scope.hello = 'Public Records';
        $scope.notification = 'Records';
        $scope.new = [];
        $scope.isEmptyObject = function(obj) {
          return angular.equals({}, obj);
        };
        $scope.mergeObjects = function(obj1, obj2) {
          return angular.extend(obj1, obj2);
        };
        $scope.get_records = function(limit) {
          capLocalClient.get_records()
          .then(function(response) {
            $scope.records = response;
          }, function(error) {
            $scope.hello = "ERROR";
          }, function(update){
            $scope.notification = $scope.notification + '<br />' + update;
          });
        };
        $scope.get_record_files = function() {
          // capLocalClient.get_record_permissions(recid )
          // .then(function(response) {
          //   $scope.permissions =
          //   $scope.upd_permissions = response.data.permissions;
          // }, function(error) {
          //   $scope.hello = "ERROR";
          // }, function(update){
          //   $scope.notification = $scope.notification + '<br />' + update;
          // });

          var demo_files = {
            "*": [
              {
                "filename": "data1.raw",
                "status": "success",
                "field": ""
              },
              {
                "filename": "data2.raw",
                "status": "warning",
                "field": ""
              },
              {
                "filename": "data3.raw",
                "status": "error",
                "field": ""
              }
            ],
            "1": [
              {
                "filename": "file1.file",
                "status": "success",
                "field": ""
              },
              {
                "filename": "file2.file",
                "status": "success",
                "field": ""
              }
            ],
            "2": [
              {
                "filename": "file1222.file",
                "status": "success",
                "field": ""
              },
              {
                "filename": "file2.file",
                "status": "success",
                "field": ""
              },
              {
                "filename": "file3.file",
                "status": "success",
                "field": ""
              },
              {
                "filename": "document.pdf",
                "status": "error",
                "field": ""
              },
              {
                "filename": "large_file.raw",
                "status": "warning",
                "field": ""
              },
            ]
          };

          if ( $scope.pid_value && demo_files[$scope.pid_value]) {
            $scope.files = demo_files[$scope.pid_value];
          }
          else {
            $scope.files = demo_files["*"];
          }
        };
        $scope.get_record_permissions = function(recid) {
          capLocalClient.get_record_permissions(recid )
          .then(function(response) {
            $scope.permissions =
            $scope.upd_permissions = response.data.permissions;
          }, function(error) {
            $scope.hello = "ERROR";
          }, function(update){
            $scope.notification = $scope.notification + '<br />' + update;
          });
        };
        $scope.changePrivacy = function(pid_value){
          capLocalClient.change_record_privacy(pid_value)
          .then(function(response) {
            $scope.privacy = response;
          }, function(error) {
            $scope.hello = "ERROR";
          }, function(update){
            $scope.notification = $scope.notification + '<br />' + update;
          });
        };
        $scope.add_permissions = function(recid, data){
          // Cleaning "garbage" entries from newly added users, where
          // "op" is "remove"
          var new_data;
          _.each($scope.new, function(new_entry){
            if(data[new_entry]){
              data[new_entry] = _.filter(data[new_entry], function(action){
                return action["op"] !== "remove";
              });
            }
          });

          capLocalClient.set_record_permissions(recid, data)
          .then(function(response) {
            $scope.new = [];
          }, function(error) {
            $scope.hello = "ERROR";
          }, function(update){
            $scope.notification = $scope.notification + '<br />' + update;
          });
        };
        $scope.add_permission = function(email){
          // if (!validateEmail(email)){
          //   alert("Input provided must be a valid email or user role");
          //   return false;
          // }

          var add =
          [
            {
              "op": "add",
              "action": "records-read",
              "user" : {
                "email": email
              }
            },
            {
              "op": "add",
              "action" : "records-index",
              "user" : {
                "email" : email
              }
            }
          ];
          $scope.permissions = $scope.permissions.concat(add);
          $scope.new.push(email);
          $scope.query = "";
        };
        $scope.toggle_permission_action = function(email, action){
          var user_action = _.find($scope.permissions, function(p){
            return ( p["action"] == action && p["user"]["email"] == email);
          });

          if(user_action) {
            if (user_action["op"]){
              if ($scope.new.indexOf(email) !== -1 && user_action["op"] == "remove")
                user_action["op"] = "add";
              else if ($scope.new.indexOf(email) !== -1 && user_action["op"] == "add")
                user_action["op"] = "remove";
              else
                delete user_action["op"];
            }
            else {
              user_action["op"] = "remove";
            }
          }
          else {
            var operation = {
              "action": action,
              "user" : {
                "email": email
              },
              "op": "add"
            };
            $scope.permissions = $scope.permissions.concat(operation);
          }
        };
        $scope.add_permission_action = function(email, action){
          var found = _.find($scope.permissions, function(p){
            if( p["actions"] == action && p["user"]["email"] == email)
              return true;
            else
              return false;
          });
          var operation = {
            "action": action,
            "user" : {
              "email": email
            }
          };
          if(found) {
            operation["op"] = "remove";
          }
          else {

          }
        };


        var validateEmail = function(email) {
          var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
        };
      }]);
  return controllers;
});