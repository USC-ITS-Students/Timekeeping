(function(){
    'use strict';

    angular.module('app').controller('loginController', ['$scope', '$location', '$http', function ($scope, $location, $http) {
        // If the user is already logged in redirect them to the history overview page
       /* $http.get('/auth/checkloggedin').then(
            function(){
                $http.get('api/users/getLoggedIn').then(function (res) {
                    $location.url('/history/'+res.data.empid+'/0');
                });                
            }
        );*/

        $scope.empid = ''; // model for empid input field
        $scope.password = ''; // model for password input field
        $scope.error_message = ''; // model for error message label

        // this is called when the user hits the submit button
        $scope.submit = function () {
            if ($scope.empid && $scope.password) {
                $http.post('/auth/login', {username:$scope.empid, password:$scope.password})
                    .then(
                        function(res){ // this function is called upon receiving a success status
                            // redirect to history overview page
                            if (res.data.type == 'supervisor')
                            {
                                $location.url('/supervisor/'+$scope.empid+'/'+res.data.latestYearWorked.toString());
                            }
                          else{
                                $location.url('/history/'+$scope.empid+'/'+res.data.latestYearWorked.toString());
                            }
                        },
                        function(){ // this function is called upon receiving an unsuccessful status
                            // display error message
                            $scope.error_message = 'Invalid Employee ID/Password';
                            $scope.login_error = true;
                        }
                    );
            }
            else {
                // display error message
                $scope.error_message = 'Missing Employee ID/Password.';
                $scope.login_error = true;
            }
        }
    }]);
})();


