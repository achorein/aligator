'use strict';

angular.module('aligatorApp')
  .controller('MainController', function ($scope, $rootScope, AlertService, componentSrv) {
  	$scope.infos = [];

    componentSrv.list().then(function(data){
       $scope.infos = data;
    }).catch(function(error){
       AlertService.error(error);
    });

    $scope.action = function(info, action) {
       componentSrv.action(info, action).then(function(data){
          info.value = data.value;
       }).catch(function(error){
          AlertService.error(error + ' => ' + info);
       });
    };
  });
