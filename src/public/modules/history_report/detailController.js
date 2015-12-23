angular.module('app').controller('detailController', ['$scope', '$location', '$routeParams' , '$rootScope', 'DataLoader', function ($scope, $location, $routeParams, $rootScope, DataLoader) {

    DataLoader.loadIfNeeded(function(err){
        if(err) console.log(err);
        else{
            $scope.timesheet = $rootScope.employee.timesheets[$routeParams.timesheet-1];
        }
    });

    $scope.orgidx = 0;
    $scope.goToOverview = function() {
        $location.path('/');
    };
}]);