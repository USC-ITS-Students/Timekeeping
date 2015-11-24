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
        // Default
        .otherwise({
            redirect: '/'
        });
});