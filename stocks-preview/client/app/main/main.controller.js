'use strict';

angular.module('stockPreviewApp')
    .controller('MainCtrl', function ($q, $scope, $http, Restangular, forexSrv) {

        $scope.availableInstruments = null;
        $scope.loadedInstruments = {};
        $scope.model = {};
        $scope.model.chosenInstrumentsInD3Format = [];

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
                }),
                chosenInstrumentsHistory = _.map(chosenInstruments, function (instrument) {
                    var defaultGranularity = 'D';
                    var defaultCount = Math.ceil(365 / 2); // half of year

                    return forexSrv.getInstrumentHistory(instrument.instrument, defaultGranularity, defaultCount)
                });

            $q.all(chosenInstrumentsHistory).then(function (instrumentsHistory) {
                angular.extend($scope.model.chosenInstrumentsInD3Format, _.map(instrumentsHistory, function (instrumentHistory) {
                    var data = {
                        name: instrumentHistory.instrument,
                        values: []
                    };

                    angular.forEach(instrumentHistory.candles, function (candle) {
//                        var date = new Date(candle.time);
//                        data.values.push([date.getTime(), candle.closeAsk]);
                        data.values.push([candle.time, candle.closeAsk]);

                    });

                    return data;
                }));

                console.log($scope.model.chosenInstrumentsInD3Format);
            });
        };


        $scope.xAxisTickFormatFunction = function () {
            return function (d) {
                return d3.time.format('%x')(new Date(d));  //uncomment for date format
            }
        };

        $scope.xAxisDomainFunction = function (dataset) {
            var getter = function (x) {
                return x[1];
            }

            return [d3.min(dataset, getter), d3.max(dataset, getter)];
        };

        $scope.domain = [0.94539, 0.93341];

        $scope.someData = [
            {name: "Greg", score: 98},
            {name: "Ari", score: 96},
            {name: 'Q', score: 75},
            {name: "Loser", score: 48}
        ];
    });
