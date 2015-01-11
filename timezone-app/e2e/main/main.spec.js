'use strict';

describe('Main View', function () {
    var page;

    beforeEach(function () {
        browser.get('/');
        page = require('./main.po');
    });

    it('should allow to change timezone', function () {
        var initialDateStr = page.dateLocal.getText(function (str) {
            return str;
        });

        page.timezoneLocalOption.get(0).click();
        page.dateLocal.getText(function (str) {
            expect(str).not.toBe(initialDateStr);
        });
        return false;
    });

    it('should propagate date/time change to other timezones', function () {
        var newDateStr = '17:50 2015-01-11',
            initialDateStr = page.dateLocal.getText(function (str) {
                return str;
            });

        page.dateGMT.clear();
        page.dateGMT.sendKeys(newDateStr + '\n');
        page.dateLocal.getText(function (str) {
            expect(str).not.toBe(initialDateStr);
        });
    });
});
