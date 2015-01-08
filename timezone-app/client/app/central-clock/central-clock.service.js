'use strict';

angular.module('timezoneAppApp')
    .service('centralClock', function ($rootScope) {
        var clock = moment.utc();

        this.getClock = function () {
            return angular.copy(clock);
        }

        this.setClock = function (newDate) {
            // newDate should be moment.utc()
            clock = angular.copy(newDate);
            $rootScope.$broadcast("update-time");
        }
    });
