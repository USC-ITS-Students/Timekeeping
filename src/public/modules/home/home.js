angular.module('app').controller('homeController', ['$scope', '$location', function ($scope, $location, $http) {
    
    $scope.incomplete_fields_error = "Enter a username/password."

    $scope.submit = function () {
        if ($scope.username && $scope.password) {
            $location.path('/history');
            $scope.login_error = false;
        }
        else {
            $scope.login_error = true;
        }
    }
}]);

