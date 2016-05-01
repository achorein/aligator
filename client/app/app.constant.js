(function(angular, undefined) {
'use strict';

angular.module('aligatorApp.constants', [])

.constant('appConfig', {backendHost:'172.21.1.91',backendPort:9000,userRoles:['guest','user','admin']})

;
})(angular);