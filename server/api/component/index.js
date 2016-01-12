'use strict';

var express = require('express');
var controller = require('./component.controller');

var router = express.Router();

router.get('/list', controller.list);
router.post('/action', controller.action);

module.exports = router;
