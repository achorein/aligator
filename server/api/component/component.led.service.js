'use strict';

var q = require('q');

// https://www.npmjs.com/package/rpi-gpio
var gpio = require('rpi-gpio');
//var gpio = {on: function(){}, setup: function(){}, read: function(){}, write: function(){}}; // mock

class ComponentLedService {

    constructor() {
        this.blinks = {};
    }

    init(component) {
        var deferred = q.defer();
        gpio.setup(component.channel, gpio.DIR_OUT, err => {
            if (err) { 
              console.log('LED: ' + component.name + ' | channel ' + component.channel + ' | SETUP KO | ' + err);
              deferred.reject(err); 
            } else { 
              console.log('LED: ' + component.name + ' | channel ' + component.channel + ' | SETUP OK :)');
              deferred.resolve();
            }
        });
        return deferred.promise;
    }

    on(component, blink) {
      if (!blink) { this.blinks[component.channel] = null; } // stop blink on manual change
      console.log('LED: channel ' +component.channel + ' wrote on');
      if (!blink) { component.value = 1; } // change component value on manual change
      gpio.write(component.channel, true, err => {
        if (err) { throw err; }
      });
    }

    off(component, blink) {
      if (!blink) { this.blinks[component.channel] = null; } // stop blink on manual change
      console.log('LED: channel ' +component.channel + ' wrote off');
      if (!blink) { component.value = 0; } // change component value on manual change
      gpio.write(component.channel, false, err => {
        if (err) { throw err; }
      });
    }

    blink(component, interval) {
        if (component.value === 'blink') { return; }
        this.blinks[component.channel] = {
          interval: interval,
          state: null
        };
        component.value = 'blink';
        this._blink(component);
    }

    _blink(component) {
        var blink = this.blinks[component.channel];
        if (!blink) { return; }
        
        if (blink.state === 0) {
          console.log('LED: channel %d blink on (%d ms)', component.channel, blink.interval);
          this.on(component, true);
          blink.state = 1;
        } else {
          console.log('LED: channel %d blink off (%d ms)', component.channel, blink.interval);
          this.off(component, true);
          blink.state = 0;
        }
        setTimeout(() => {
            this._blink(component);
        }, blink.interval);
    }
}

module.exports = new ComponentLedService();
