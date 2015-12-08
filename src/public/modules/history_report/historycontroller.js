angular.module('app').controller('historyController', ['$scope', '$location', function ($scope, $location, $http) {

    //Record example
    var payRecord1 = { payPeriod: "06/03/2015" , regular: "59.3", overtime: "0.0", doubletime: "0.0", vac:"3.8", sick:"3.5", otherpaid:"8.3", otherunpaid:"0.0", totalHours: "74.9", status:"Approved"};
    var payRecord2 = { payPeriod: "05/20/2015", regular: "66.8", overtime: "0.0", doubletime: "0.0", vac: "3.8", sick: "4.5", otherpaid: "8.3", otherunpaid: "0.0", totalHours: "74.1", status: "Approved" };
    $scope.week = 7;
    //Get Employee
    $scope.employee = { name: "Hasdf Aasdklf", region: "2510251000", id: "555", position:"Program Assistant"}

    //Get Employee Pay History
    $scope.record = [payRecord1, payRecord2];

    //Get period detail
    $scope.getPeriodDetail = function () {
        //Get info ...
        $location.path('/period_detail');
    }
}]);