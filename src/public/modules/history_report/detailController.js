angular.module('app').controller('detailController', ['$scope', '$location', '$routeParams', '$filter', 'DataLoader', function ($scope, $location, $routeParams, $filter, DataLoader) {

    DataLoader.loadIfNeeded(function(err){
        if(err) console.log(err);
        else{
            $scope.timesheet = $filter('orderBy')($scope.employee.timesheets, '-end')[$routeParams.timesheet - 1];
            console.log($scope.timesheet);
        }
    });

    $scope.orgidx = 0;
    $scope.goToOverview = function() {
        $location.path('/');
    };
}]);