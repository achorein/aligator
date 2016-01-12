'use strict';

angular.module('aligatorApp')
  .service('componentSrv', function (RESTSrv) {
    return {
      list: function(params) {
        return RESTSrv.requestSync('component/list', 'GET', params);
      },
      action: function(params, action) {
        var payload = {
          component: params,
          action: action
        };
        return RESTSrv.requestSync('component/action', 'POST', payload);
      }
    };
  });
