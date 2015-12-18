angular.module('app').controller('historyController', ['$scope', '$location', '$http', function ($scope, $location, $http) {

    //Record example
    var payRecord1 = { payPeriod: "06/03/2015" , regular: "59.3", overtime: "0.0", doubletime: "0.0", vac:"3.8", sick:"3.5", otherpaid:"8.3", otherunpaid:"0.0", totalHours: "74.9", status:"Approved"};
    var payRecord2 = { payPeriod: "05/20/2015", regular: "66.8", overtime: "0.0", doubletime: "0.0", vac: "3.8", sick: "4.5", otherpaid: "8.3", otherunpaid: "0.0", totalHours: "74.1", status: "Approved" };

    $http.get('/api/timesheets')
        .success(function (data) {
            $scope.employee = data;
            //console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    //Get Timesheet Detail
    $scope.getPeriodDetail = function () {
        $location.path('/period_detail');
    };

    $scope.getAllTimesheets = function() {
        $location.path('/');
    };

    console.log($scope.employee);
}]);