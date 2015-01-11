'use strict';

describe('Service: timezoneSrv', function () {

    // load the service's module
    beforeEach(module('timezoneAppApp'));

    var timezoneSrv, rootScope;

    beforeEach(inject(function ($rootScope) {
        rootScope = $rootScope;

        spyOn(rootScope, '$broadcast');
    }));


    beforeEach(inject(function (_timezoneSrv_) {
        timezoneSrv = _timezoneSrv_;
    }));

    it('should return date object', function () {
        expect(timezoneSrv.getRefDate()).toBeDefined();
    });

    it('should allow to set date', function () {
        var expectedDate = moment.utc(new Date(2016, 1, 1));

        timezoneSrv.setRefDate(expectedDate);
        expect(timezoneSrv.getRefDate()).toEqual(expectedDate);
    });

    it('should broadcast on set date operation', function () {
        var expectedDate = moment.utc(new Date(2016, 1, 1));

        timezoneSrv.setRefDate(expectedDate);
        expect(rootScope.$broadcast).toHaveBeenCalled();
    });

});
