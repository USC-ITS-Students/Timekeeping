(function(){
    'use strict';

    angular.module('app').controller('overviewController', ['$scope', '$location', '$routeParams', 'DataLoader', function ($scope, $location, $routeParams,  DataLoader) {
        var year = parseInt($routeParams.year);

        // load data if needed
        DataLoader.load(year, function(err){
            if(err) console.log(err);
            else{
                if(!year || year < $scope.employee.earliestYearWorked || year > $scope.employee.latestYearWorked){
                    $location.url('/history/'+$scope.employee.latestYearWorked);
                }
                // genearate total hours
                if($scope.timesheets.length > 0){
                    $scope.total_hours = generateTotalHours($scope.timesheets);
                }else{
                    $scope.total_hours = ['0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0'];
                }

                // load years for dropdown box
                $scope.years = [];
                var i = $scope.employee.latestYearWorked;
                while(i >= $scope.employee.earliestYearWorked){
                    $scope.years.push(i);
                    i--;
                }
            }
        });


        //Get Timesheet Detail
        $scope.getPeriodDetail = function (timesheet_index) {
            $location.path('/details/' + year + '/' +  timesheet_index.toString());
        };

        $scope.selectedYear =  parseInt(year);

        $scope.onChange = function(){
            $location.url('/history/' + $scope.selectedYear);
        };


        function generateTotalHours(timesheets){
            // calculate total hours by type for the year
            var totals =  timesheets
                            // map each timesheet to an array of their hour types
                            .map(function(ts){
                                return  [
                                            ts.hourTypeTotals['Regular'],
                                            ts.hourTypeTotals['Overtime'],
                                            ts.hourTypeTotals['Double Time'],
                                            ts.hourTypeTotals['Vacation'],
                                            ts.hourTypeTotals['Sick'],
                                            ts.hourTypeTotals['Other Paid'],
                                            ts.hourTypeTotals['Other Unpaid']
                                        ];
                            })
                            // combine all hours of the same type into one index of an array
                            .reduce(function(prev, curr){
                                return prev.map(function(val, i){
                                    return val + curr[i];
                                })
                            });

            // add on grand total hours for the year
            totals.push(
                timesheets
                    // map each timesheet to the sum of the grandtotals of both of its weeks
                    .map(function(ts){
                        return ts.week[0].grandTotal.total + ts.week[1].grandTotal.total;
                    })
                    // add all of the grand totals together
                    .reduce(function(prev, curr){
                        return prev+curr;
                    })
            );
            return totals;
        }
    }]);
})();

