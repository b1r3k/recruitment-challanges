'use strict';

angular.module('stockPreviewApp')
    .service('forexSrv', function (Restangular, $q) {
        this.getAvailableInstruments = function () {
            var deferred = $q.defer();

            Restangular.all('instruments').customGET().then(function (data) {
                deferred.resolve(data.instruments);
            });

            return deferred.promise;
        }

        this.getInstrumentHistory = function (instrumentName, granularity, count) {
            var options = {
                instrument: instrumentName,
                granularity: granularity,
                count: count,
                candleFormat: 'bidask'
            },
                deferred = $q.defer();

            Restangular.all('candles').customGET('', options).then(function (instrumentHistory) {
                deferred.resolve(instrumentHistory);
            });

            return deferred.promise;
        }
    });
