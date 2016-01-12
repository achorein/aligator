'use strict';

angular.module('aligatorApp', [
  'aligatorApp.constants',
  'angular-loading-bar',
  'LocalStorageModule',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
