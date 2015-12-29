(function(){
    angular.module('app').controller('overviewController', ['$scope', '$location', '$routeParams', 'DataLoader', function ($scope, $location, $routeParams,  DataLoader) {

        DataLoader.load($routeParams.year, function(err){
            if(err) console.log(err);
        });

        //Get Timesheet Detail
        $scope.getPeriodDetail = function (timesheet_index) {
            $location.path('/details/' + $routeParams.year + '/' +  timesheet_index.toString());
        };

    }]);
})();

