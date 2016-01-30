'use strict';

var service = require('./component.service');

class ComponentController {
    constructor() {
    }
    
    list(req, res) {
      res.json(service.componentList());
    }
    
    action(req, res) {
      res.json(service.action(req.body.id, req.body.action, req.body.value));
    }
}

module.exports = new ComponentController();
