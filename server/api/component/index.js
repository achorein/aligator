'use strict';

module.exports = (wss) => {
    var express = require('express');
    var controller = require('./component.controller')(wss);

    var router = express.Router();

    router.get('/list', controller.list);
    router.post('/action', controller.action);
    return router;
};