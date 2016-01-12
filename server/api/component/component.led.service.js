'use strict';

// https://www.npmjs.com/package/rpi-gpio
//var gpio = require('rpi-gpio');
var gpio = {on: function(){}, setup: function(){}, read: function(){}, write: function(){}}; // mock

function ComponentLedService(){}
ComponentLedService.prototype = (function(){

    var blinks = {};

    var self = {
        init: function(component) {
            console.log('LED: channel ' +component.channel + ' setup => ' + component.name);
            gpio.setup(component.channel, gpio.DIR_OUT, function(err){
                if (err) { throw err; }
            });
        },
        on: function(component, blink) {
          if (!blink) { blinks[component.channel] = 0; }
          console.log('LED: channel ' +component.channel + ' wrote on');
          if (!blink) { component.value = 1; }
          gpio.write(component.channel, true, function(err) {
            if (err) { throw err; }
          });
        },
        off: function(component, blink) {
          if (!blink) { blinks[component.channel] = 0; }
          console.log('LED: channel ' +component.channel + ' wrote off');
          if (!blink) { component.value = 0; }
          gpio.write(component.channel, false, function(err) {
            if (err) { throw err; }
          });
        },
        blink: function(component, interval) {
            if (component.value === 'blink') { return; }
            blinks[component.channel] = interval;
            component.value = 'blink';
            self.blinkOn(component);
        },
        blinkOn: function(component) {
            if (blinks[component.channel] === 0) { return; }
            var interval = blinks[component.channel];
            console.log('LED: channel %d blink on (%d ms)', component.channel, interval);
            self.on(component, true);
            setTimeout(function() {
                self.blinkOff(component);
            }, interval);
        },
        blinkOff: function(component) {
            if (blinks[component.channel] === 0) { return; }
            var interval = blinks[component.channel];
            console.log('LED: channel %d blink off (%d ms)', component.channel, interval);
            self.off(component, true);
            setTimeout(function() {
                self.blinkOn(component);
            }, interval);
        }
    }
    return self;
})();

module.exports = new ComponentLedService();
