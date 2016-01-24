'use strict';

// https://www.npmjs.com/package/rpi-gpio
//var gpio = require('rpi-gpio');
var ledSrv = require('./component.led.service');
var rangeSrv = require('./component.range.service');
var buzzSrv = require('./component.buzzer.service');

class ComponentService {

    constructor() {
      // init all gpio components
      this.components = {
        led: [
          {channel: 40, name: 'Red LED', info: '#ff0000', value: 0}, // GPIO21
          {channel: 38, name: 'Yellow LED', info: '#ffff00', value: 0}, // GPIO20
          {channel: 37, name: 'Green LED', info: '#00ff00', value: 0}, // GPIO26
          {channel: 35, name: 'Double White LED', info: '#ffffff', value: 0}, // GPIO19
        ],
        range: [
          //{channel: [16,18], name: 'Range sensor 1', info: 'ultrasonic', value: 0}, // GPIO23-GPIO24
          //{channel: 7, name: 'Range sensor 2', info: 'ultrasonic', value: 0},
        ],
        buzzer: [
          //{channel: 36, name: 'Buzzer 1', info: 'buzzer', value: 0} // GPIO16
        ],
        motor: [],
        temperature: []
      };

      // add type on all component
      var promise;
      var types = Object.keys(this.components);
      types.forEach(type => {
          this.components[type].forEach(component => {
              component.type = type;
              var newPromise;
              if (type === 'led') {
                  newPromise = ledSrv.init(component);
              } else if (type === 'range') {
                  newPromise = rangeSrv.init(component);
              }
              if (newPromise) {
                if (!promise) {
                    promise = newPromise;
                } else {
                    promise = promise.then(() => {
                        return newPromise;
                    })
                }
              }
          })
      });
      if (!promise) {
         throw new Error('components not initialized !');
      }
      // wait for init finished and set default values
      promise.then(() => {
        ledSrv.on(this.components.led[2]); // green
      });

      // manage mood on range change
      /*rangeSrv.monitor(this.components.range[0], function(value) {
        if (value >= 0 && value < 10) { // angry
          ledSrv.on(this.components.led[0]); // red
          ledSrv.off(this.components.led[1]); // yellow
          ledSrv.off(this.components.led[2]); // green
        } else if (value >= 0 && value < 100) { // unhappy
          ledSrv.off(this.components.led[0]);
          ledSrv.on(this.components.led[1]);
          ledSrv.off(this.components.led[2]);
        } else { // happy
          ledSrv.off(this.components.led[0]);
          ledSrv.off(this.components.led[1]);
          ledSrv.on(this.components.led[2]);
        }
      }, 100);*/
    }

    _findIndex(component) {
      if (this.components[component.type]) {
          for (var i = 0; i < this.components[component.type].length; i++) {
              if (this.components[component.type][i].name === component.name) {
                  return i;
              }
          }
      }
      return -1;
    }

    componentList() {
      var result = [];
      result = result.concat(this.components.led);
      result = result.concat(this.components.range);
      result = result.concat(this.components.buzzer);
      result = result.concat(this.components.motor);
      result = result.concat(this.components.temperature);
      return result;
    }

    action(component, action) {
      var index = this._findIndex(component);
      if (index < 0) { throw Error('component not found ' + component); }
      var currentComponent = this.components[component.type][index];
      
      /*
       * LED
       */
      if (currentComponent.type === 'led') {
            if (action === 'blink') {
              ledSrv.blink(currentComponent, 500);
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
            buzzSrv.alarm(currentComponent, 1000);
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

module.exports = new ComponentService();
