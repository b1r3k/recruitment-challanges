'use strict';

describe('Service: centralClock', function () {

    // load the service's module
    beforeEach(module('timezoneAppApp'));

    // instantiate service
    var centralClock;
    beforeEach(inject(function (_centralClock_) {
        centralClock = _centralClock_;
    }));

    it('should return date object', function () {
        expect(centralClock.getClock()).toBeDefined();
    });

    it('should allow to set date', function () {
        var expectedDate = moment.utc(new Date(2016, 1, 1));

        centralClock.setClock(expectedDate);
        expect(centralClock.getClock()).toEqual(expectedDate);
    });

    it('should allow to set date', function () {
        var expectedDate = moment.utc(new Date(2016, 1, 1));

        centralClock.setClock(expectedDate);
        expect(centralClock.getClock()).toEqual(expectedDate);
    });

});
