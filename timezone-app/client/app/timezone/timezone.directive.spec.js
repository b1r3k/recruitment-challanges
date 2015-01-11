'use strict';

describe('Directive: timezone', function () {

    // load the directive's module and view
    beforeEach(module('timezoneAppApp'));
    beforeEach(module('app/timezone/timezone.html'));

    var element, scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make date/time & timezone input', inject(function ($compile) {
        element = angular.element('<timezone></timezone>');
        element = $compile(element)(scope);
        scope.$apply();
        expect(element.html('.date').length).toBe(1);
        expect(element.html('.timezone').length).toBe(1);
    }));

    it('should make default timezone UTC', inject(function ($compile) {
        element = angular.element('<timezone></timezone>');
        element = $compile(element)(scope);
        scope.$apply();
        expect(scope.$$childHead.model.selectedTimezone).toBe('UTC');
    }));
});