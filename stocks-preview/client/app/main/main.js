'use strict';

angular.module('stockPreviewApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            });
    })
    .config(function (RestangularProvider) {
        RestangularProvider.setBaseUrl('http://api-sandbox.oanda.com/v1');
    });