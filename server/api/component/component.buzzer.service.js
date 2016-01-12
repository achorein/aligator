'use strict';

// https://www.npmjs.com/package/rpi-gpio
//var gpio = require('rpi-gpio');
var gpio = {on: function(){}, setup: function(){}, read: function(){}, write: function(){}}; // mock

function ComponentBuzzerService(){}
ComponentBuzzerService.prototype = (function(){

    var alarms = {};

    var self = {
        init: function(component) {
            console.log('BUZZER: channel ' +component.channel + ' setup => ' + component.name);
            gpio.setup(component.channel, gpio.DIR_OUT, function(err){
                if (err) { throw err; }
            });
        },
        on: function(component, alarm) {
          if (!alarm) { alarms[component.channel] = 0; }
          console.log('BUZZER: channel ' +component.channel + ' wrote on');
          if (!alarm) { component.value = 1; }
          gpio.write(component.channel, true, function(err) {
            if (err) { throw err; }
          });
        },
        off: function(component, alarm) {
          if (!alarm) { alarms[component.channel] = 0; }
          console.log('BUZZER: channel ' +component.channel + ' wrote off');
          if (!alarm) { component.value = 0; }
          gpio.write(component.channel, false, function(err) {
            if (err) { throw err; }
          });
        },
        alarm: function(component, interval) {
            if (component.value === 'alarm') { return; }
            alarms[component.channel] = interval;
            component.value = 'alarm';
            self.alarmOn(component);
        },
        alarmOn: function(component) {
            if (alarms[component.channel] === 0) { return; }
            var interval = alarms[component.channel];
            console.log('BUZZER: channel %d alarm on (%d ms)', component.channel, interval);
            self.on(component, true);
            setTimeout(function() {
                self.alarmOff(component);
            }, interval);
        },
        alarmOff: function(component) {
            if (alarms[component.channel] === 0) { return; }
            var interval = alarms[component.channel];
            console.log('BUZZER: channel %d alarm off (%d ms)', component.channel, interval);
            self.off(component, true);
            setTimeout(function() {
                self.alarmOn(component);
            }, interval);
        }
    }
    return self;
})();

module.exports = new ComponentBuzzerService();
