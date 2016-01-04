(function(){
    'use strict';

    angular.module('app').controller('detailController', ['$scope', '$location', '$routeParams', '$filter', 'DataLoader', function ($scope, $location, $routeParams, $filter, DataLoader) {

        DataLoader.load($routeParams.year, function(err){
            if(err) console.log(err);
            else{
                var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                $scope.timesheet = $filter('orderBy')($scope.timesheets, '-end')[$routeParams.timesheet - 1];
                $scope.Dates = generateWeek($scope.timesheet.start).map(function(date){
                    return {
                        Day: weekdays[date.getDay()],
                        Date: ('0' + (date.getMonth()+1).toString()).slice(-2) + '/' + ('0' + (date.getDate()).toString()).slice(-2)
                    };
                });

            }
        });

        $scope.orgidx = 0;
        $scope.goToOverview = function() {
            $location.path('/history/' + $routeParams.year);
        };

    }]);

    function generateWeek(start){
        var startDate = new Date(start);
        startDate.setTime(startDate.getTime() + 1*86400000);
        var dates = [startDate];
        for(var i = 0; i < 13; i++){
            var next = new Date();
            next.setTime( dates[i].getTime() + 1*86400000);
            dates.push(next);
        }

        return dates;
    }
})();