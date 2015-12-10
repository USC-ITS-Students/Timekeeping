angular.module('app').controller('historyController', ['$scope', '$location', '$http', function ($scope, $location, $http) {

    //Record example
    var payRecord1 = { payPeriod: "06/03/2015" , regular: "59.3", overtime: "0.0", doubletime: "0.0", vac:"3.8", sick:"3.5", otherpaid:"8.3", otherunpaid:"0.0", totalHours: "74.9", status:"Approved"};
    var payRecord2 = { payPeriod: "05/20/2015", regular: "66.8", overtime: "0.0", doubletime: "0.0", vac: "3.8", sick: "4.5", otherpaid: "8.3", otherunpaid: "0.0", totalHours: "74.1", status: "Approved" };

    //Get Employee Timesheet History
    var netid = "testemp", empid = "123456";

    $http.get('/api/general', { params: { netid: netid, empid: empid } })
    .success(function (data) {
        $scope.record = data[0];
        //console.log(data);
    })
    .error(function (data) {
        console.log('Error: ' + data);
    });

    $http.get('/api/timesheetsOverview', { params: {netid:netid, empid:empid} })
        .success(function (data) {
            //Format date
            for (i = 0; i < data[0].timesheets.length; i++) {
                data[0].timesheets[i].end = new Date(data[0].timesheets[i].end).toLocaleDateString();
            }
            $scope.timesheets = data[0].timesheets;
           //console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
    });

    //Get Timesheet Detail
    $scope.getPeriodDetail = function () {
        $location.path('/period_detail');
    }

}]);