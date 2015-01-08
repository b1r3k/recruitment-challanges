'use strict';

angular.module('timezoneAppApp')
    .controller('TimezoneCtrl', function ($scope, $filter, centralClock, $interval) {
        $scope.model = {
            date: centralClock.getClock(),
            dateStr: null,
            selectedTimezone: $scope.initTimezone || "UTC",
            timezoneNames: moment.tz.names(),
        };

        var dateFormat = "H:mm YYYY-MM-DD";

        $scope.updateDateStr = function () {
            $scope.model.date = centralClock.getClock();
            $scope.model.dateStr = $scope.model.date.tz($scope.model.selectedTimezone).format(dateFormat);
        }

        $scope.changeDate = function ($event, newDateStr) {
            $event.preventDefault();
            var newDate = moment(newDateStr, dateFormat, true);

            if (newDate.isValid()) {

                var newClock = newDate.tz($scope.model.selectedTimezone).utc();
                centralClock.setClock(newClock);
                console.log('Jump! ', newDate);
                console.log('Sending: ', newClock);
            }
        };

        $scope.$on("update-time", function () {
            $scope.updateDateStr();
        });

        // init
        $scope.updateDateStr();

//        var updateInterval = $interval($scope.updateDateStr, 1000);
//
//        $scope.$on('$destroy', function () {
//            $interval.cancel(updateInterval);
//        });
    })
    .directive('timezone', function () {
        return {
            templateUrl: 'app/timezone/timezone.html',
            restrict: 'EA',
            controller: 'TimezoneCtrl',
            scope: {
                initTimezone: '=initTimezone'
            }
        };
    });