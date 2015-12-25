angular.module('app').controller('loginController', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    $scope.netid = '';
    $scope.password = '';
    $scope.error_message = '';

    $scope.submit = function () {
        if ($scope.netid && $scope.password) {
            $http.post('/auth/login', {username:$scope.netid, password:$scope.password})
                .then(
                    function(){
                        // login successful callback
                        $scope.login_error = true;
                        $location.url('/2015');
                    },
                    function(){
                        // login failure callback
                        $scope.error_message = 'Invalid netid/password';
                        $scope.login_error = true;
                    }
                );
        }
        else {
            $scope.error_message = 'Enter a netid/password.';
            $scope.login_error = true;
        }
    }
}]);

