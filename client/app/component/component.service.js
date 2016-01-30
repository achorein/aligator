'use strict';

angular.module('aligatorApp')
  .service('componentSrv', function (RESTSrv) {
    return {
      list: function(params) {
        return RESTSrv.requestSync('component/list', 'GET', params);
      },
      action: function(id, action, value) {
        var payload = {
          id: id,
          action: action,
          value: value
        };
        return RESTSrv.requestSync('component/action', 'POST', payload);
      }
    };
  });
