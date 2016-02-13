'use strict';

var crypto = require('crypto');
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
var songs = require('j5-songs');

var LEDRED = 'GPIO21';
var LEDYELLOW = 'GPIO20';
var LEDGREEN = 'GPIO26';
var LEDWHITE = ['GPIO5', 'GPIO6'];
var BUZZER = 'GPIO13';
var RANGE1 = 'GPIO12';
var RANGE2 = 'GPIO4';
var MOTOR1 = ['GPIO18','GPIO17','GPIO27']; /*PWM0*/
var MOTOR2 = ['GPIO19','GPIO23','GPIO22']; /*PWM1*/


class ComponentService {

    constructor() {
      // components available for REST services
      this._components = {
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
          {channel: MOTOR1, name: 'Direction', info: 'hbridge', value: 0},
          {channel: MOTOR2, name: 'Propulsion', info: 'hbridge', value: 0}
        ],
        range: [
          {channel: RANGE1, name: 'Range sensor front', info: 'HCSR04', value: 0}, 
          {channel: RANGE2, name: 'Range sensor back', info: 'HCSR04', value: 0},
        ]
      };
      // cache for loaded internal component from johnny-five
      this._gpios = {};

      // add type on all component
      var types = Object.keys(this._components);
      types.forEach(type => {
          this._components[type].forEach(component => {
              component.id = this._get(component.channel);
              component.type = type;
              console.log('- registered: ' + component.id + ' (' + component.type + ') => ' + component.name)
          })
      });

      // wait for init finished and set default values
      board.on("ready", () => {
        console.log('> Board ready !');
        // LEDs
        self._components.led.forEach(led => {
            self._gpios[led.id] = new five.Led(led.channel);
        });
        // BUZZER / PIEZO
        self._components.buzzer.forEach(buzzer => {
            self._gpios[buzzer.id] = new five.Piezo(buzzer.channel);
        });
        // MOTORS
        self._components.motor.forEach(motor => {
            self._gpios[motor.id] = new five.Motor(motor.channel);
            self._gpios[motor.id].stop();
        });
        // RANGE SENSOR / PROXIMITY
        /*self._components.range.forEach(function(range){
            self._gpios[range.id] = new five.Proximity({
              controller: "HCSR04",
              pin: range.channel,
              freq: '25ms'
            });
        });

        // manage mood on range change
        self._gpios[self._get(RANGE1)].on("data", function() {
            var current = self._find(self._get(RANGE1));
            current.value = this.cm;
            if (this.cm >= 0 && this.cm <= 10) { // angry
                self.action(self._get(LEDRED), "on");
                self.action(self._get(LEDYELLOW), "off");
                self.action(self._get(LEDGREEN), "off");
            } else if (this.cm > 0 && this.cm < 100) { // unhappy
                self.action(self._get(LEDRED), "off");
                self.action(self._get(LEDYELLOW), "on");
                self.action(self._get(LEDGREEN), "off");
            } else { // happy
                self.action(self._get(LEDRED), "off");
                self.action(self._get(LEDYELLOW), "off");
                self.action(self._get(LEDGREEN), "on");
            }
        });*/

        // Default action
        self.action(self._get(LEDGREEN)); // toggle led => on
        self.action(self._get(BUZZER), 'song', 'mario-intro');
      });
    }

    _get(channel) {
      return crypto.createHash('md5').update(channel.toString()).digest('hex');
    }

    _find(componentId) {
      var result = null;
      var types = Object.keys(this._components);
      types.forEach(type => {
          this._components[type].forEach(component => {
            if (component.id === componentId) {
              result = component;
            }
          });
      });
      return result;
    }

    componentList() {
      var result = [];
      result = result.concat(this._components.led);
      result = result.concat(this._components.buzzer);
      result = result.concat(this._components.motor);
      result = result.concat(this._components.range);
      return result;
    }

    action(componentId, action, value) {
      var current = this._find(componentId);
      if (!current) { throw Error('component not found ' + componentId); }
      /*
       * LED
       */
      if (current.type === 'led') {
            if (action === 'blink') {
              if (!value) {
                value = 500;
              }
              this._gpios[current.id].blink(value);
              current.value = 'blink';
            } else if (action === 'on') {
              this._gpios[current.id].stop(); // stop blinking
              this._gpios[current.id].on(); // stop blinking
              current.value = 1;
            } else if (action === 'off') {
              this._gpios[current.id].stop(); // stop blinking
              this._gpios[current.id].off(); // stop blinking
              current.value = 1;
            } else {
              current.value = (current.value + 1) % 2;
              this._gpios[current.id].stop(); // stop blinking
              this._gpios[current.id].toggle();
            }
      /*
       * BUZZER
       */
      } else if (current.type === 'buzzer') {
          if (action === 'song') {
            this._gpios[current.id].off(); // stop current note
            this._gpios[current.id].play(songs.load(value)); // play a song
          } else if (action === 'stop') {
            this._gpios[current.id].off(); // stop current note
          }
      /*
       * MOTOR
       */
      } else if (current.type === 'motor') {
          if (action === 'forward') {
            if (value) {
                this._gpios[current.id].forward(255*value/100);
            } else {
                this._gpios[current.id].forward(255);
            }
          } else if (action === 'reverse') {
            if (value) {
                this._gpios[current.id].reverse(255*value/100);
            } else {
                this._gpios[current.id].reverse(255);
            }
          } else if (action === 'stop') {
            this._gpios[current.id].stop();
          }
      } else {
        throw Error('type unknown : ' + current.type);
      }
      return current;
    }
}

// Handler for SIGINT (Ctrl+c) in order to shutdown everything
process.on('SIGINT', function() {
  console.log('SIGINT detected : shutting down system gracefully');
  this._components.led.forEach(led => {
      console.log('- closing ' + led.id + ' (' + led.type + ') => ' + led.name);
      this._gpios[led.id].off();
  });
  this._components.buzzer.forEach(buzzer => {
      this._gpios[buzzer.id].off;
      console.log('- closing: ' + buzzer.id + ' (' + buzzer.type + ') => ' + buzzer.name);
  });
  this._components.motor.forEach(motor => {
      console.log('- closing ' + motor.id + ' (' + motor.type + ') => ' + motor.name);
      this._gpios[motor.id].stop();
  });
});

var self = new ComponentService()
module.exports = self;
