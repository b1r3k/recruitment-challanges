'use strict';

angular.module('stockPreviewApp')
    .controller('MainCtrl', function ($scope, $http, Restangular, forexSrv) {

        $scope.availableInstruments = null;
        $scope.loadedInstruments = {};

        forexSrv.getAvailableInstruments().then(function (data) {
            $scope.availableInstruments = data
        });

        $scope.canBeChecked = function (instrument) {
            var checkedCounter = 0;

            angular.forEach($scope.availableInstruments, function (instrument) {
                if (instrument.checked) {
                    checkedCounter++;
                }
            });

            if (checkedCounter > 3) {
                instrument.checked = false;
            }
        };

        $scope.loadInstruments = function (instruments) {
            var chosenInstruments = _.filter(instruments, function (instrument) {
                return instrument.checked;
            });

            var checkedInstrumentsHistory = _.map(chosenInstruments, function (instrument) {
                var defaultGranularity = 'D';
                var defaultCount = 365 / 2;

                return forexSrv.getInstrumentHistory(instrument.instrument, defaultGranularity, defaultCount)
            });
        };
    });
