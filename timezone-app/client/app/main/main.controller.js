'use strict';

angular.module('timezoneAppApp')
  .controller('MainCtrl', function ($scope) {
        var localTimezone = jstz.determine().name();

        $scope.timezones = ['GMT', localTimezone];

        $scope.addTimezone = function () {
            $scope.timezones.push(localTimezone);
        };
  });
