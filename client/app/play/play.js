'use strict';

angular.module('aligatorApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('play', {
        url: '/',
        templateUrl: 'app/play/play.html',
        controller: 'PlayController',
        controllerAs: 'play'
      });
  });
