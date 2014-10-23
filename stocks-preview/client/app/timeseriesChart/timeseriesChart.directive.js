'use strict';

angular.module('stockPreviewApp')
    .directive('timeseriesChart', function ($window) {
        return {
            restrict: 'EA',
            scope: {
                margin: '@',
                height: '@',
                width: '@',
                padding: '@',
                data: '='
            },
            link: function (scope, element, attrs) {
                console.log(scope.data);
                var margin = parseInt(attrs.margin) || 20,
                    chartHeight = parseInt(attrs.height) || 200,
                    chartWidth = parseInt(attrs.width) || 400,
                    chartPadding = parseInt(attrs.padding) || 5;

                var svg = d3.select(element[0])
                    .append('svg')
                    .style('width', '100%');

                var transformData = function (data) {
                    var datasets = [];

                    data.forEach(function (instrument) {
                        var transformedInstrument = [];

                        angular.forEach(instrument.values, function (value, key) {
                            this.push([Date.parse(value[0]), parseFloat(value[1])]);
                        }, transformedInstrument);

                        datasets.push({
                            name: instrument.name,
                            values: transformedInstrument
                        });
                    });

                    return datasets;
                }

                // Browser onresize event
                window.onresize = function () {
                    scope.$apply();
                };

                // Watch for resize event
                scope.$watch(function () {
                    return angular.element($window)[0].innerWidth;
                }, function () {
                    scope.render(scope.data);
                });

                scope.$watch('data', function (newVals) {
                    var transformedDatasets = transformData(newVals);
                    scope.render(transformedDatasets);
                }, true);

                scope.render = function (datasets) {
                    svg.selectAll('*').remove();

                    if (!datasets || datasets.length == 0) return;

                    var margin = {top: 20, right: 30, bottom: 130, left: 80},
                        width = chartWidth - margin.left - margin.right,
                        height = chartHeight - margin.top - margin.bottom;

                    var x = d3.time.scale()
                        .range([0, width]);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var color = d3.scale.category10();

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var line = d3.svg.line()
//                        .interpolate("basis")
                        .x(function (d) {
                            return x(d[0]);
                        })
                        .y(function (d) {
                            return y(d[1]);
                        });

                    var chart = svg.attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    x.domain(d3.extent(datasets[0].values, function (d) {
                        return d[0];
                    }));

                    var getMinFromDatasets = function (datasets) {
                        return d3.min(datasets, function (dataset) {
                            return d3.min(dataset.values, function (v) {
                                return v[1];
                            });
                        })
                    }

                    var getMaxFromDatasets = function (datasets) {
                        return d3.max(datasets, function (dataset) {
                            return d3.max(dataset.values, function (v) {
                                return v[1];
                            });
                        })
                    }

                    var minInDatasets = getMinFromDatasets(datasets),
                        maxInDatasets = getMaxFromDatasets(datasets);

                    y.domain([ minInDatasets - 0.001 * minInDatasets, maxInDatasets + 0.001 * maxInDatasets]);

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .tickPadding(40)
                        .orient("left");

                    chart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    chart.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "translate(0," + (height - margin.bottom - margin.top) / 2 + ") rotate(-90)")
                        .attr("y", -70)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Closing bid price");

                    var instrumentPrice = chart.selectAll(".instrumentPrice")
                        .data(datasets)
                        .enter().append("g")
                        .attr("class", "instrumentPrice");

                    instrumentPrice.append("path")
                        .attr("class", "line")
                        .attr("fill", "none")
                        .attr("d", function (d) {
                            return line(d.values);
                        })
                        .style("stroke", function (d) {
                            return color(d.name);
                        });

                    instrumentPrice.append("text")
                        .datum(function (d) {
                            return {name: d.name, value: d.values[d.values.length - 1]};
                        })
                        .attr("transform", function (d) {
                            return "translate(" + x(d.value[0]) + "," + y(d.value[1]) + ")";
                        })
                        .attr("x", 3)
                        .attr("dy", ".35em")
                        .text(function (d) {
                            return d.name;
                        });
                }
            }
        }
    });