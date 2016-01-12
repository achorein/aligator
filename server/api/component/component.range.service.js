'use strict';

// https://github.com/clebert/r-pi-usonic
//var usonic = require('r-pi-usonic');
var usonic = {sensor: function(){ return function(){return -42;};}}; // mock

function ComponentRangeService(){}
ComponentRangeService.prototype = (function(){

    var ranges = {};

    var getId = function(component) {
        return component.channel[0]+'-'+component.channel[1];
    }

    var monitor = function(component) {
        setTimeout(function() {
            var lastValue = ranges[getId(component)].value;
            self.value(component);
            if (lastValue !== ranges[getId(component)].value) {
                ranges[getId(component)].callback(ranges[getId(component)].value);
            }
            monitor(component);
        }, ranges[getId(component)].interval);
    }

    var self = {
        init: function(component) {
            console.log('RANGE: channel ' + getId(component) + ' setup => ' + component.name);
            var sensor = usonic.sensor(component.channel[0], component.channel[1], 1000);
            ranges[getId(component)] = {
                sensor: sensor,
                callback: null,
                interval: 1000,
                value: -1
            }
        },
        monitor: function(component, callback, interval) {
            console.log('RANGE: channel ' + getId(component) + ' monitor');
            ranges[getId(component)].callback = callback;
            if (interval) {
                ranges[getId(component)].interval = interval
            }
            monitor(component);
        },
        value: function(component) {
            console.log('RANGE: channel ' + getId(component) + ' read value');
            var value = ranges[getId(component)].sensor();
            ranges[getId(component)].value = value;
            component.value = value;
            return value;
        }
    }
    return self;
})();

module.exports = new ComponentRangeService();
