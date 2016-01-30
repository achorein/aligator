'use strict';

// https://www.npmjs.com/package/rpi-gpio
//var gpio = require('rpi-gpio');
var crypto = require('crypto');
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
var songs = require('j5-songs');

var rangeSrv = require('./component.range.service');

var LEDRED = 'GPIO21';
var LEDYELLOW = 'GPIO20';
var LEDGREEN = 'GPIO26';
var LEDWHITE = ['GPIO19', 'GPIO16'];
var BUZZER = 'GPIO13';
var RANGE1 = [16,18];
var RANGE2 = [7,11];
var MOTOR1 = [12,11,13];
var MOTOR2 = [19,18,22];

// init all gpio components
var components = {
  led: [
    {channel: LEDRED, name: 'Red LED', info: '#ff0000', value: 0}, 
    {channel: LEDYELLOW, name: 'Yellow LED', info: '#ffff00', value: 0}, 
    {channel: LEDGREEN, name: 'Green LED', info: '#00ff00', value: 0},
    {channel: LEDWHITE, name: 'Double White LED', info: '#ffffff', value: 0}, 
  ],
  buzzer: [
    {channel: BUZZER, name: 'Piezo', info: 'piezo', value: 0}
  ],
  motor: [
    {channel: MOTOR1, name: 'Propulsion', info: 'hbridge', value: 0},
    {channel: MOTOR2, name: 'Direction', info: 'hbridge', value: 0}
  ],
  range: [
    {channel: RANGE1, name: 'Range sensor 1', info: 'ultrasonic', value: 0}, 
    {channel: RANGE2, name: 'Range sensor 2', info: 'ultrasonic', value: 0},
  ]
};

// loaded gpios (j5)
var gpios = {};

class ComponentService {

    constructor() {

      // add type on all component
      //var promise;
      var types = Object.keys(components);
      types.forEach(type => {
          components[type].forEach(component => {
              component.id = this._getId(component.channel);
              component.type = type;
              console.log('- registered: ' + component.id + ' (' + component.type + ') => ' + component.name)
              /*if (component.channel instanceof Array) {
                let id = '';
                component.channel.forEach(channel => {
                  id += '|'+channel;
                });
                component.id = id;
              } else {
                component.id = component.channel;
              }*/
              /*var newPromise;
              if (type === 'range') {
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
              }*/
          })
      });

      // wait for init finished and set default values
      board.on("ready", () => {
        console.log('> Board ready !');
        components.led.forEach(led => {
            gpios[led.id] = new five.Led(led.channel);
        });
        components.buzzer.forEach(buzzer => {
            gpios[buzzer.id] = new five.Piezo(buzzer.channel);
        });
        componentService.action(componentService._getId(LEDGREEN)); // toggle led => on
        componentService.action(componentService._getId(BUZZER), 'song', 'mario-intro');
      });

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
      }, 100);*/
    }

    _getId(channel) {
      return crypto.createHash('md5').update(channel.toString()).digest('hex');
    }

    _findComponent(componentId) {
      var result = null;
      var types = Object.keys(components);
      types.forEach(type => {
          components[type].forEach(component => {
            if (component.id === componentId) {
              result = component;
            }
          });
      });
      return result;
    }

    componentList() {
      var result = [];
      result = result.concat(components.led);
      result = result.concat(components.buzzer);
      result = result.concat(components.motor);
      result = result.concat(components.range);
      return result;
    }

    action(componentId, action, value) {
      var currentComponent = this._findComponent(componentId);
      if (!currentComponent) { throw Error('component not found ' + componentId); }
      /*
       * LED
       */
      if (currentComponent.type === 'led') {
            if (action === 'blink') {
              gpios[currentComponent.id].blink(500);
              currentComponent.value = 'blink';
            } else {
              currentComponent.value = (currentComponent.value + 1) % 2;
              gpios[currentComponent.id].stop(); // sto blinking
              gpios[currentComponent.id].toggle();
            }
      /*
       * RANGE
       */
     /* } else if (currentComponent.type === 'range') {
          currentComponent.value = rangeSrv.value(currentComponent);*/
      /*
       * BUZZER
       */
      } else if (currentComponent.type === 'buzzer') {
          if (action === 'song') {
            gpios[currentComponent.id].off();
            gpios[currentComponent.id].play(songs.load(value));
          } else if (action === 'stop') {
            gpios[currentComponent.id].off();
          }
      } else {
        throw Error('type unknown : ' + currentComponent.type);
      }
      return currentComponent;
    }
}

var componentService = new ComponentService()
module.exports = componentService;
