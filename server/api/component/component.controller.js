'use strict';

var service = require('./component.service');

class ComponentController {
    constructor() {
    }
    
    list(req, res) {
      res.json(service.componentList());
    }
    
    action(req, res) {
      res.json(service.action(req.body.component, req.body.action));
    }
}

module.exports = new ComponentController();
