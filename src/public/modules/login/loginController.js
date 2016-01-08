(function(){
    'use strict';

    angular.module('app').controller('loginController', ['$scope', '$location', '$http', function ($scope, $location, $http) {
        // check if the user is already logged in
        $http.get('/auth/checkloggedin').then(
            function(){
                // if user is already loggedin, redirect
                $location.url('/history');
            }
        );

        $scope.empid = '';
        $scope.password = '';
        $scope.error_message = '';

        $scope.submit = function () {
            if ($scope.empid && $scope.password) {
                $http.post('/auth/login', {username:$scope.empid, password:$scope.password})
                    .then(
                        function(res){
                            // login successful callback
                            $scope.login_error = true;
                            $location.url('/history/'+res.data.latestYearWorked.toString());
                        },
                        function(){
                            // login failure callback
                            $scope.error_message = 'Invalid Employee ID/Password';
                            $scope.login_error = true;
                        }
                    );
            }
            else {
                $scope.error_message = 'Missing Employee ID/Password.';
                $scope.login_error = true;
            }
        }
    }]);
})();


