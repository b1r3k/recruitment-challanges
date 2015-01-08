'use strict';

angular.module('timezoneAppApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui.keypress'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });