'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var componentCtrlStub = {
  list: 'componentCtrl.list',
  action: 'componentCtrl.action'
};

var routerStub = {
  get: sinon.spy(),
  post: sinon.spy()
};

// require the index with our stubbed out modules
var componentIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './component.controller': componentCtrlStub
});

describe('component API Router:', function() {

  it('should return an express router instance', function() {
    expect(componentIndex).to.equal(routerStub);
  });

  describe('GET /api/component', function() {

    it('should route to component.controller.list', function() {
      expect(routerStub.get
        .withArgs('/list', 'componentCtrl.list')
        ).to.have.been.calledOnce;
    });
    
    it('should route to component.controller.action', function() {
      expect(routerStub.post
        .withArgs('/action', 'componentCtrl.action')
        ).to.have.been.calledOnce;
    });

  });

});
