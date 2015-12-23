angular.module('app').controller('loginController', ['$scope', '$location', '$http', '$rootScope', function ($scope, $location, $http, $rootScope) {
    $scope.netid = '';
    $scope.password = '';
    $scope.error_message = '';

    $scope.submit = function () {
        if ($scope.netid && $scope.password) {
            $http.post('/auth/login', {username:$scope.netid, password:$scope.password})
                .then(
                    function(){
                        // login successful callback
                        console.log('successful login');
                        $scope.login_error = true;
                        $location.url('/');
                    },
                    function(){
                        // login failure callback
                        $scope.error_message = 'Invalid netid/password';
                        $scope.login_error = true;
                    }
                );
            //$location.path('/history');
            //$scope.login_error = false;
        }
        else {
            $scope.error_message = 'Enter a netid/password.';
            $scope.login_error = true;
        }
    }
}]);

