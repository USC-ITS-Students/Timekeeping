(function(){
    'use strict';

    //create the module
    var app = angular.module('app', ['ngRoute']);

    var checkloggedin = function($q, $http, $location){
        // Initialize a new promise
        var deferred = $q.defer();
        // Make an AJAX call to check if the user is logged in
        $http.get('/auth/checkloggedin').then(
            function(){
                // user is already authenticated
                deferred.resolve(); // resolve deferred
            },
            function(){
                // not authenticated
                deferred.reject(); // reject deffered
                $location.url('/login');
            }
        );
        return deferred.promise; // return the promise
    };

    //configure routes
    app.config(function($routeProvider){
        $routeProvider
        // route for the login page
            .when('/', {
                redirectTo:'/login'
            })
            .when('/login', {
                templateUrl : 'modules/login/login.html',
                controller :  'loginController'
            })
            .when('/history/:employee/:year', {
                templateUrl: 'modules/history_report/overview/timesheet_history.html',
                controller:  'overviewController',
                resolve: {
                    loggedin: checkloggedin
                }
            })
            .when('/history/:employee/0', {
                templateUrl: 'modules/history_report/overview/timesheet_history.html',
                controller:  'overviewController',
                resolve: {
                    loggedin: checkloggedin
                }
            })
            .when('/details/:employee/:year/:timesheet', {
                templateUrl: 'modules/history_report/detail/timesheet_history_detail.html',
                controller:  'detailController',
                resolve: {
                    loggedin: checkloggedin
                }
            })
            .when('/supervisor/:employee/:year', {
                templateUrl: 'modules/supervisor/supervisor_overview.html',
                controller:  'supervisorController',
                resolve: {
                    loggedin: checkloggedin
                }
            })
            .when('/supervisor/:employee/0', {
                templateUrl: 'modules/supervisor/supervisor_overview.html',
                controller:  'supervisorController',
                resolve: {
                    loggedin: checkloggedin
                }
            })
            .when('/admin/:employee/0', {
                templateUrl: 'modules/admin/admin_overview.html',
                controller:  'adminController',
                resolve: {
                    loggedin: checkloggedin
                }
            })
            .when('/admin/:employee/:year', {
                templateUrl: 'modules/admin/admin_overview.html',
                controller:  'adminController',
                resolve: {
                    loggedin: checkloggedin
                }
            })
            // Default
            .otherwise({
                redirectTo:'/'
            });
    });
})();
