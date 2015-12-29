(function(){
    angular.module('app').controller('detailController', ['$scope', '$location', '$routeParams', '$filter', 'DataLoader', function ($scope, $location, $routeParams, $filter, DataLoader) {

        DataLoader.load($routeParams.year, function(err){
            if(err) console.log(err);
            else{
                $scope.timesheet = $filter('orderBy')($scope.timesheets, '-end')[$routeParams.timesheet - 1];
            }
        });

        $scope.orgidx = 0;
        $scope.goToOverview = function() {
            $location.path('/history/' + $routeParams.year);
        };

        $scope.Dates = [{Day: 'Thu', Date:"01/02"}, {Day: 'Fri', Date:"01/05"}, {Day: 'Sat', Date:"06/02"}, {Day: 'Sun', Date:"07/02"}, {Day: 'Mon', Date:"06/01"}, {Day: 'Tue', Date:"01/02"}, {Day: 'Wed', Date:"01/02"}];
    }]);
})();