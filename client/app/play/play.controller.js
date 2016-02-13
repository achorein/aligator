'use strict';

angular.module('aligatorApp')
  .controller('PlayController', function ($scope, $rootScope, $connection, AlertService, componentSrv) {
    $scope.components = [];
    $scope.console = [];

    $connection.listen(function(msg) {
      return true;
    }, function (msg) {
        $scope.console.push(msg);
        if (msg.type === 'list') {
          $scope.components = msg.data;
        }
    });

    $connection.send({call: 'list'});
  });
