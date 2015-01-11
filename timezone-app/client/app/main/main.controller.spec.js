'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('timezoneAppApp'));

    var MainCtrl,
        scope;

//  Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    it('should init with two timezones, one GMT & one local', function () {
        var localTimezone = jstz.determine().name();

        expect(scope.timezones.length).toBe(2);
        expect(scope.timezones.indexOf('GMT')).toBeGreaterThan(-1);
        expect(scope.timezones.indexOf(localTimezone)).toBeGreaterThan(-1);
    });

    it('should allow to add new timezone', function () {
        scope.addTimezone();
        expect(scope.timezones.length).toBe(3);
    });
});
