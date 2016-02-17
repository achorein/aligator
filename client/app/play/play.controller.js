'use strict';

angular.module('aligatorApp')
  .controller('PlayController', function ($scope, $rootScope, $connection) {
    $scope.mood = 'gray';
    $scope.lights = { color: 'gray', id: -1 };
    $scope.rangefront = -1;
    $scope.rangeback = -1;
    $scope.coords = {x: 0, y: 0};

    $scope.console = [];

    $scope.updateComponent = function(component) {
        console.log('update ' + JSON.stringify(component));
        /* LED */
        if(component.type === 'led') {
          if (component.info === '#ffffff') { // white
            $scope.lights.id = component.id;
            if (component.value === 1) {
              $scope.lights.color = '#ffff00';
            } else {
              $scope.lights.color = 'gray';
            }
          } else if (component.info === '#ff0000') { // red
            if (component.value === 1) {
              $scope.mood = component.info;
            }
          } else if (component.info === '#00ff00') { // green
            if (component.value === 1) {
              $scope.mood = component.info;
            }
          } else if (component.info === '#ffff00') { // yellow
            if (component.value === 1) {
              $scope.mood = component.info;
            }
          }
        }
        /* RANGE */
        else if(component.type === 'range') {
          if (component.name.indexOf('front') !== -1) {
            $scope.rangefront = component.value;
          } else if (component.name.indexOf('back') !== -1) {
            $scope.rangeback = component.value;
          }
        }
    }

    // Listen for web socket update
    $connection.listen(function(msg) {
      return msg.type === 'list';
    }, function (msg) {
        console.log(msg);
        $scope.console.push(msg);
        msg.data.forEach(function(component){
          $scope.updateComponent(component);
        });
    });

    // Listen for web socket update
    $connection.listen(function(msg) {
      return msg.type === 'component';
    }, function (msg) {
        console.log(msg);
        $scope.console.push(msg);
        $scope.updateComponent(msg.data);
    });

    $scope.action = function(id, action, value) {
       var msg = {
          proc: 'action', 
          data: {
            id: id, 
            action: action, 
            value: value
          }
       };
       $scope.console.push({date: new Date(), type:'send', data: msg});
       $connection.send(msg);
    };

    $scope.joystickMove = function() {
      //console.log('joystickMove ! ' + JSON.stringify($scope.coords));
    };

    // Request via websocket to get component list
    $connection.send({proc: 'list'});
  });
