'use strict';

var service = require('./component.service');

function ComponentController(){}
ComponentController.prototype = (function(){
    var self = {
        list : function(req, res) {
          res.json(service.componentList());
        },
        action : function(req, res) {
          res.json(service.action(req.body.component, req.body.action));
        }
    }
    return self;
})();

module.exports = new ComponentController();
