'use strict';

angular.module('timezoneAppApp')
    .service('timezoneSrv', function ($rootScope) {
        var refDate = moment.utc();

        this.getRefDate = function () {
            return angular.copy(refDate);
        };

        this.setRefDate = function (newDate) {
            // newDate should be moment.utc()
            refDate = angular.copy(newDate);
            $rootScope.$broadcast('update-date', refDate);
        };
    });
