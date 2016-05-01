'use strict';

angular.module('aligatorApp')
  .controller('MainController', function ($scope, $rootScope, AlertService, componentSrv) {
    $scope.infos = [];
    $scope.songs = [
      'beethovens-fifth',
      'claxon',
      'do-re-mi',
      'doorbell',
      'funeral-march-short',
      'jingle-bells-short',
      'jingle-bells',
      'mario-fanfare',
      'mario-intro',
      'never-gonna-give-you-up',
      'nyan-intro',
      'nyan-melody',
      'pew-pew-pew',
      'starwars-theme',
      'tetris-theme',
      'wedding-march'
    ];
    $scope.speed = 100;
    $scope.angle = 90;

    componentSrv.list().then(function(data){
       $scope.infos = data;
    }).catch(function(error){
       AlertService.error(error);
    });

    $scope.action = function(info, action, value) {
       componentSrv.action(info.id, action, value).then(function(data){
          info.value = data.value;
       }).catch(function(error){
          AlertService.error(error + ' => ' + JSON.stringify(info));
       });
    };
  });
