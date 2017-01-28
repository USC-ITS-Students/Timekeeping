/**
 * Created by sanjana on 1/13/2017.
 */
(function(){
    'use strict';

    angular.module('app').controller('adminController', ['$scope', '$location', '$routeParams', 'DataLoader', function ($scope, $location, $routeParams,  DataLoader) {


        var year = parseInt($routeParams.year);
        var empid = $routeParams.employee;

        $scope.selectedYear =  parseInt(year); // model for select year dropdown
        // load data if needed
        DataLoader.loadAdmin( empid, function(err){
            if(err){
                console.log(err);
                $location.url('/login');
            }
            else{


            }
        });

        $scope.submit = function () {
            $scope.employeeSearchList = [];
            for (var i=0; i<$scope.AdminEmployees.length;i++) {
                if ($scope.EmpID==$scope.AdminEmployees[i].empid || $scope.EmpLastName==$scope.AdminEmployees[i].lastname  || $scope.EmpFirstName==$scope.AdminEmployees[i].firstname)
                {
                    if ($scope.AdminEmployees[i].type == 'supervisor')
                    {

                    $location.url('/supervisor/'+ $scope.AdminEmployees[i].empid +'/'+$scope.AdminEmployees[i].latestYearWorked );
                    }
                    else
                    {
                     $location.url('/history/'+ $scope.AdminEmployees[i].empid +'/'+$scope.AdminEmployees[i].latestYearWorked );
                    }

                }
                 else if($scope.AdminEmployees[i].lastname.startsWith($scope.EmpLastName) || $scope.AdminEmployees[i].firstname.startsWith($scope.EmpFirstName)) {
                 $scope.employeeSearchList.push($scope.AdminEmployees[i]);
                }

            }

        }

        $scope.getDetails = function (emp_id,year1, type) {
            if(type.toString()=='supervisor')
            {
                $location.url('/supervisor/'+ emp_id+'/'+ year1 );
            }
            else {
                 $location.url('/history/'+ emp_id+'/'+ year1 );
            }


        };
    }]);
})();
