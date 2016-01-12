'use strict';

var app = require('../..');
import request from 'supertest';

describe('Component API:', function() {

  describe('GET /api/component/list', function() {
    var info;

    beforeEach(function(done) {
      request(app)
        .get('/api/component/list')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          info = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(info).to.be.instanceOf(Array);
    });

 });

 describe('POST /api/component/action for LED', function() {
    var info;

    beforeEach(function(done) {
      var payload = {component: {name: 'Red LED', type: 'led'}, action: 'switch'};
      request(app)
        .post('/api/component/action')
        .send(payload)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            console.log(res.text);
            return done(err);
          }
          info = res.body;
          done();
        });
    });

    it('should respond with JSON object', function() {
      expect(info).to.be.an('object');
      expect(info.value).to.be.equal(1);
    });

  });

  describe('POST /api/component/action for RANGE', function() {
    var info;

    beforeEach(function(done) {
      var payload = {component: {name: 'Range sensor 1', type: 'range'}, action: 'refresh'};
      request(app)
        .post('/api/component/action')
        .send(payload)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            console.log(res.text);
            return done(err);
          }
          info = res.body;
          done();
        });
    });

    it('should respond with JSON object', function() {
      expect(info).to.be.an('object');
    });

  });

});
