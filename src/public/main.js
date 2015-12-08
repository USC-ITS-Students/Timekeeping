//create the module
var app = angular.module('app', ['ngRoute']);

//configure routes
app.config(function($routeProvider){
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'modules/home/home.html',
            controller : 'homeController'
        })

        .when('/history', {
            templateUrl: 'modules/history_report/timesheet_history.html',
            controller: 'historyController'
        })

        .when('/period_detail', {
            templateUrl: 'modules/history_report/timesheet_history_detail.html',
            controller: 'historyController'
        })

        // Default
        .otherwise({
            redirect: '/'
        });
});