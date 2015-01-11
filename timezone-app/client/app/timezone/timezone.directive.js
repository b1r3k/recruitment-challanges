'use strict';

angular.module('timezoneAppApp')
    .controller('TimezoneCtrl', function ($scope, $filter, $interval, timezoneSrv) {
        $scope.model = {
            date: timezoneSrv.getRefDate(),
            dateStr: null,
            selectedTimezone: $scope.initTimezone || 'UTC',
            timezoneNames: moment.tz.names(),
        };

        var dateFormat = 'H:mm YYYY-MM-DD';

        $scope.updateDateStr = function () {
            $scope.model.dateStr = $scope.model.date.tz($scope.model.selectedTimezone).format(dateFormat);
        };

        $scope.parseDateStr = function (dateStr) {
            var newDate = moment.tz(dateStr, dateFormat, $scope.model.selectedTimezone);

            return newDate;
        };

        $scope.changeDate = function ($event, newDateStr) {
            var newDate = $scope.parseDateStr(newDateStr);
            $event.preventDefault();

            if (newDate.isValid()) {
                timezoneSrv.setRefDate(newDate.utc());
            }
        };

        $scope.$on('update-date', function (event, broadcastedDate) {
            $scope.model.date = broadcastedDate;
            $scope.updateDateStr();
        });

        // init
        $scope.updateDateStr();
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