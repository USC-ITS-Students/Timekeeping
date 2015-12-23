angular.module('app').controller('overviewController', ['$scope', '$location', 'DataLoader', function ($scope, $location, DataLoader) {

    DataLoader.loadIfNeeded(function(err){
        if(err) console.log(err);
    });

    //Record example
    //var payRecord1 = { payPeriod: "06/03/2015" , regular: "59.3", overtime: "0.0", doubletime: "0.0", vac:"3.8", sick:"3.5", otherpaid:"8.3", otherunpaid:"0.0", totalHours: "74.9", status:"Approved"};
    //var payRecord2 = { payPeriod: "05/20/2015", regular: "66.8", overtime: "0.0", doubletime: "0.0", vac: "3.8", sick: "4.5", otherpaid: "8.3", otherunpaid: "0.0", totalHours: "74.1", status: "Approved" };

    //Get Timesheet Detail
    $scope.getPeriodDetail = function (timesheet_index) {
        $location.path('/period_detail/' + timesheet_index.toString());
    };

}]);