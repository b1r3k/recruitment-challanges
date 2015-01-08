'use strict';

angular.module('timezoneAppApp')
  .controller('MainCtrl', function ($scope, $http) {
        var localTimezone = jstz.determine().name();

        $scope.timezones = ["UTC", localTimezone];

        $scope.addTimezone = function () {
            $scope.timezones.push(localTimezone);
        };
  });
