'use strict';

angular.module('aligatorApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/dashboard',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      });
  });
