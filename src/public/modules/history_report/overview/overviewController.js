(function(){
    'use strict';

    angular.module('app').controller('overviewController', ['$scope', '$location', '$routeParams', 'DataLoader', function ($scope, $location, $routeParams,  DataLoader) {

        DataLoader.load($routeParams.year, function(err){
            if(err) console.log(err);

            if($scope.timesheets.length > 0){
                var total = $scope.timesheets
                    .map(function(timesheet){
                        return timesheet.total_hours;
                    })
                    .reduce(function(curr, total){
                        return curr+total;
                    });
                $scope.total_hours = {
                    total: total
                }
            }else{
                $scope.total_hours = {
                    total: '0.0'
                }
            }
        });


        //Get Timesheet Detail
        $scope.getPeriodDetail = function (timesheet_index) {
            $location.path('/details/' + $routeParams.year + '/' +  timesheet_index.toString());
        };


        $scope.years = [];

        var currentYear = new Date().getFullYear();
        for(var i = 0; i < 50; i++){
            $scope.years.push(currentYear-i);
        }

        $scope.selectedYear =  parseInt($routeParams.year);

        $scope.onChange = function(){
            $location.url('/history/' + $scope.selectedYear);
        }
    }]);
})();

