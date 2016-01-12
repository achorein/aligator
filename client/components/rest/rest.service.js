'use strict';

angular.module('aligatorApp').factory('RESTSrv', ['$http', '$q', 'localStorageService', 
  function($http, $q, localStorageService){
    var self = {
        requestSync: function(service, method, params) {
            // utilisation d'une promesse pour rendre l'appel synchrone
            var deferred = $q.defer();
            self.requestAsync(service, method, params).
                success(function(data) {
                    deferred.resolve(data);
                }).
                error(function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        requestAsync: function(service, method, params) {
            var headers = {
                'content-type': 'application/json'
            };
            // injection du header d'authentification nécessaire (token)
            var token = localStorageService.get('token');
            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }
            return $http({
                method: method,
                url: '/api/' + service,
                data: params,
                headers: headers
            });
        }
    };
    return self;
  }]);