(function(){
    'use strict';

    angular.module('app').controller('supervisorController', ['$scope', '$location', '$routeParams', 'DataLoader', function ($scope, $location, $routeParams,  DataLoader) {


        var year = parseInt($routeParams.year);
        var empid = $routeParams.employee;

        $scope.selectedYear =  parseInt(year); // model for select year dropdown
        // load data if needed
        DataLoader.loadSupervisor(year, empid, function(err){
            if(err){
                console.log(err);
                $location.url('/login');
            }
            else{


            }
        });

        $scope.getDetails = function (supervisee_id,year1) {

            $location.url('/history/'+ supervisee_id+'/'+ year1 );

        };
    }]);
})();
