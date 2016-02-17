(function(){
    'use strict';

    angular.module('app')
        .controller('detailController', ['$scope', '$location', '$routeParams', '$filter', 'DataLoader', function ($scope, $location, $routeParams, $filter, DataLoader) {

            // load data if needed
            DataLoader.load($routeParams.year, function(err){
                if(err) console.log(err);
                else{
                    var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    $scope.timesheet = $filter('orderBy')($scope.timesheets, '-end')[$routeParams.timesheet - 1];
                    $scope.Dates = $scope.generateWeekDates($scope.timesheet.start).map(function(date){
                        return {
                            Day: weekdays[date.getDay()],
                            Date: ('0' + (date.getMonth()+1).toString()).slice(-2) + '/' + ('0' + (date.getDate()).toString()).slice(-2)
                        };
                    });

                    $scope.populateHours();
                }
            });

            // scope variables
            $scope.orgidx = 0;
            $scope.goToOverview = function() {
                $location.path('/history/' + $routeParams.year);
            };

            $scope.generateRange = function(n){
                if(n === 0){
                    return [0];
                }

                var range = [];
                for(var i = 0; i < n; i++){
                    range.push(i);
                }

                return range;
            };

            // helper functions
            // generates the dates associated with the timesheet
            $scope.generateWeekDates = function(start){
                var startDate = new Date(start);
                startDate.setHours(0, 0, 0, 0);
                var dates = [startDate];
                for(var i = 0; i < 13; i++){
                    var next = new Date();
                    next.setTime( dates[i].getTime() + 1*86400000);
                    dates.push(next);
                }

                return dates;
            }

            // creates two arrays that are used to populate the weeks' hours
            $scope.populateHours = function(){
                $scope.week1HoursTable = $scope.generateHoursTable($scope.timesheet.week[0]);
                $scope.week2HoursTable = $scope.generateHoursTable($scope.timesheet.week[1]);
            }

            // convers a week's data into a table that can be used in the view
            $scope.generateHoursTable = function(week){
                var table = [];
                if(week.positions.length) {
                    week.positions.forEach(function (pos) {
                        // create main object
                        var rowData = {};
                        rowData.position = pos.title; // add the position to the row data
                        rowData.approver = pos.approver;
                        rowData.status = pos.status;

                        // need separate inner row for each type of earn code
                        var earnCodes = {};
                        pos.days.forEach(function(day, i){
                            day.forEach(function(hours){
                                if(!(hours.earncode in earnCodes)){
                                    // Each different earncode is associated with a week's worth of hours.
                                    // These hours are separated into arrays since a day can have multiple sets of hours
                                    earnCodes[hours.earncode] = {
                                        days: [[], [], [], [], [], [], []],
                                        rowspan: 1
                                    }
                                }
                                // insert hours into the corresponding day for that earncode.
                                earnCodes[hours.earncode].days[i].push({hours1: hours.hours1, hours2: hours.hours2});
                                // keep track of the rowspan needed for the earncode
                                earnCodes[hours.earncode].rowspan = Math.max(earnCodes[hours.earncode].days[i].length, earnCodes[hours.earncode].rowspan);
                            });
                        });

                        var allEarnCodeRowSpans = _.values(earnCodes)
                            .map(function(code) {
                                return code.rowspan;
                            });

                        var innerRowsOffset = allEarnCodeRowSpans.reduce(function(prev, curr){
                                return prev + curr;
                            }) - allEarnCodeRowSpans.length;

                        rowData.earnCodes = earnCodes;
                        // figure out the rowspan needed for the whole row
                        rowData.rowspan = _.size(earnCodes) + innerRowsOffset;
                        // push row data into table
                        table.push(rowData);
                    });
                }
                return table;
            }
        }]);
})();