/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function () {
    this.timezones = element.all(by.tagName('timezone'));
    this.dateGMT = this.timezones.first().element(by.model('model.dateStr'));
    this.timezoneGMT = this.timezones.first().element(by.model('model.selectedTimezone'));
    this.timezoneGMTOption = this.timezones.first().all(by.tagName('option'));
    this.dateLocal = this.timezones.last().element(by.model('model.dateStr'));
    this.timezoneLocal = this.timezones.last().element(by.model('model.selectedTimezone'));
    this.timezoneLocalOption = this.timezones.last().all(by.tagName('option'));
};

module.exports = new MainPage();

