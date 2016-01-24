'use strict';

var math = require('mathjs');

// https://github.com/clebert/r-pi-usonic
//var usonic = require('r-pi-usonic');
var usonic = {createSensor: function(){ return () => -42;}, init: function(){ return () => null}}; // mock

class ComponentRangeService {

    constructor() {
        this.ranges = {};
        this.sample = 5; // do 5 mesure before compute average
        usonic.init(err => {
            if (err) { throw err; }
        });
    }

    init(component) {
        console.log('RANGE: channel ' + this._id(component) + ' setup => ' + component.name);
        var sensor = usonic.createSensor(component.channel[0], component.channel[1], 1000); // 1000 µs
        this.ranges[this._id(component)] = {
            sensor: sensor,
            callback: null,
            interval: 100, // ms
            values: []
        }
    }

    value(component) {
        //console.log('RANGE: channel ' + this._id(component) + ' read value');
        return this.ranges[this._id(component)].sensor();
    }

    monitor(component, callback, interval) {
        //console.log('RANGE: channel ' + this._id(component) + ' monitor');
        this.ranges[this._id(component)].callback = callback;
        if (interval) {
            this.ranges[this._id(component)].interval = interval
        }
        this._monitor(component);
    }

    _id(component) {
        return component.channel[0]+'-'+component.channel[1];
    }

    _monitor(component) {
        setTimeout(() => {
            this.ranges[this._id(component)].values.push(this.value(component));
            if (this.ranges[this._id(component)].values.length === this.sample) {
                // got 5 values, compute average
                let value = math.mean(this.ranges[this._id(component)].values);
                component.value = value;
                this.ranges[this._id(component)].callback(value);
                // renit
                this.ranges[this._id(component)].values = [];
            }
            this._monitor(component);
        }, this.ranges[this._id(component)].interval);
    }
}

module.exports = new ComponentRangeService();
