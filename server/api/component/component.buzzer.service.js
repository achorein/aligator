'use strict';

// https://www.npmjs.com/package/rpi-gpio
//var gpio = require('rpi-gpio');
var gpio = {on: function(){}, setup: function(){}, read: function(){}, write: function(){}}; // mock

class ComponentBuzzerService {

    constructor() {
        this.alarms = {};
    }

    init(component) {
        console.log('BUZZER: channel ' +component.channel + ' setup => ' + component.name);
        gpio.setup(component.channel, gpio.DIR_OUT, function(err){
            if (err) { throw err; }
        });
    }

    on(component, alarm) {
      if (!alarm) { this.alarms[component.channel] = 0; }
      console.log('BUZZER: channel ' +component.channel + ' wrote on');
      if (!alarm) { component.value = 1; }
      gpio.write(component.channel, true, function(err) {
        if (err) { throw err; }
      });
    }

    off(component, alarm) {
      if (!alarm) { this.alarms[component.channel] = 0; }
      console.log('BUZZER: channel ' +component.channel + ' wrote off');
      if (!alarm) { component.value = 0; }
      gpio.write(component.channel, false, function(err) {
        if (err) { throw err; }
      });
    }

    alarm(component, interval) {
        if (component.value === 'alarm') { return; }
        this.alarms[component.channel] = interval;
        component.value = 'alarm';
        this.alarmOn(component);
    }

    alarmOn(component) {
        if (this.alarms[component.channel] === 0) { return; }
        var interval = this.alarms[component.channel];
        console.log('BUZZER: channel %d alarm on (%d ms)', component.channel, interval);
        this.on(component, true);
        setTimeout(function() {
            this.alarmOff(component);
        }, interval);
    }

    alarmOff(component) {
        if (this.alarms[component.channel] === 0) { return; }
        var interval = this.alarms[component.channel];
        console.log('BUZZER: channel %d alarm off (%d ms)', component.channel, interval);
        this.off(component, true);
        setTimeout(function() {
            this.alarmOn(component);
        }, interval);
    }
}

module.exports = new ComponentBuzzerService();
