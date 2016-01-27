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
                redirectTo:'/history/0'
            })
            .when('/login', {
                templateUrl : 'modules/login/login.html',
                controller :  'loginController'
            })
            .when('/details/:year/:timesheet', {
                templateUrl: 'modules/history_report/detail/timesheet_history_detail.html',
                controller:  'detailController',
                resolve: {
                    loggedin: checkloggedin
                }
            })
            .when('/history/:year', {
                templateUrl: 'modules/history_report/overview/timesheet_history.html',
                controller:  'overviewController',
                resolve: {
                    loggedin: checkloggedin
                }
            })
            // Default
            .otherwise({
                redirectTo: '/history/0'
            });
    });
})();


