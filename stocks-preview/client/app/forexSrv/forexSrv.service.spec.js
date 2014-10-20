'use strict';

describe('Service: forexSrv', function () {

  // load the service's module
  beforeEach(module('stockPreviewApp'));

  // instantiate service
  var forexSrv;
  beforeEach(inject(function (_forexSrv_) {
    forexSrv = _forexSrv_;
  }));

  it('should do something', function () {
    expect(!!forexSrv).toBe(true);
  });

});
