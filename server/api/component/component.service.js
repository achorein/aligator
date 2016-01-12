'use strict';

// https://www.npmjs.com/package/rpi-gpio
//var gpio = require('rpi-gpio');
var ledSrv = require('./component.led.service');
var rangeSrv = require('./component.range.service');
var buzzSrv = require('./component.buzzer.service');

function ComponentService(){}
ComponentService.prototype = (function(){

    // init all gpio components
    var components = {
      led: [
        {channel: 29, name: 'Red LED', info: '#ff0000', value: 0}, // GPIO5
        {channel: 31, name: 'Yellow LED', info: '#ffff00', value: 0}, // GPIO6
        {channel: 32, name: 'Green LED', info: '#00ff00', value: 0}, // GPIO12
        //{channel: 33, name: 'White LED', info: '#ffffff', value: 0}, // GPIO13
        //{channel: 35, name: 'Blue LED', info: '#0000ff', value: 0}, // GPIO19
      ],
      range: [
        {channel: [16,18], name: 'Range sensor 1', info: 'ultrasonic', value: 0}, // GPIO23-GPIO24
        //{channel: 7, name: 'Range sensor 2', info: 'ultrasonic', value: 0},
      ],
      buzzer: [
        //{channel: 36, name: 'Buzzer 1', info: 'buzzer', value: 0} // GPIO16
      ],
      motor: [],
      temperature: []
    };

    // add type on all component
    var types = Object.keys(components);
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        for (var j=0; j<components[type].length;j++) {
            components[type][j].type = type;
            if (type === 'led') {
                ledSrv.init(components[type][j]);
            } else if (type === 'range') {
                rangeSrv.init(components[type][j]);
            }
        }
    }

    // manage mood on range change
    /*rangeSrv.monitor(components.range[0], function(value) {
      if (value >= 0 && value < 10) { // angry
        ledSrv.on(components.led[0]); // red
        ledSrv.off(components.led[1]); // yellow
        ledSrv.off(components.led[2]); // green
      } else if (value >= 0 && value < 100) { // unhappy
        ledSrv.off(components.led[0]);
        ledSrv.on(components.led[1]);
        ledSrv.off(components.led[2]);
      } else { // happy
        ledSrv.off(components.led[0]);
        ledSrv.off(components.led[1]);
        ledSrv.on(components.led[2]);
      }
    }, 5000);*/

    var self = {
      findIndex: function(component) {
        if (components[component.type]) {
            for (var i = 0; i < components[component.type].length; i++) {
                if (components[component.type][i].name === component.name) {
                    return i;
                }
            }
        }
        return -1;
      },
      componentList: function() {
        var result = [];
        result = result.concat(components.led);
        result = result.concat(components.range);
        result = result.concat(components.buzzer);
        result = result.concat(components.motor);
        result = result.concat(components.temperature);
        return result;
      },
      action: function(component, action) {
        var index = self.findIndex(component);
        if (index < 0) { throw Error('component not found ' + component); }
        var currentComponent = components[component.type][index];
        
        /*
         * LED
         */
        if (currentComponent.type === 'led') {
              if (action === 'blink') {
                ledSrv.blink(currentComponent, 2000);
              } else if (currentComponent.value === 0) {
                ledSrv.on(currentComponent);
              } else {
                ledSrv.off(currentComponent);
              }
        /*
         * RANGE
         */
        } else if (currentComponent.type === 'range') {
            currentComponent.value = rangeSrv.value(currentComponent);
        /*
         * BUZZER
         */
        } else if (currentComponent.type === 'buzzer') {
            if (action === 'blink') {
              buzzSrv.alarm(currentComponent, 2000);
            } else if (currentComponent.value === 0) {
              buzzSrv.on(currentComponent);
            } else {
              buzzSrv.off(currentComponent);
            }
        } else {
          throw Error('type unknown : ' + currentComponent.type);
        }
        return currentComponent;
      }
    }
    return self;
})();

module.exports = new ComponentService();
