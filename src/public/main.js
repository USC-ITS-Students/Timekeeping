//create the module
var app = angular.module('app', ['ngRoute']);

var checkloggedin = function($q, $http, $location, $rootScope){
    // Initialize a new promise
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/auth/checkloggedin')
        .then(
            function(){
                // user is already authenticated
                deferred.resolve(); // resolve deferred
            },
            function(){
                // not authenticated
                $rootScope.message = 'You need to log in.';
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
            templateUrl: 'modules/history_report/timesheet_history.html',
            controller: 'overviewController',
            resolve: {
                loggedin: checkloggedin
            }
        })
        .when('/period_detail', {
            templateUrl: 'modules/history_report/timesheet_history_detail.html',
            controller: 'detailController',
            resolve: {
                loggedin: checkloggedin
            }
        })
        .when('/login', {
            templateUrl : 'modules/login/login.html',
            controller : 'loginController'
        })
        // Default
        .otherwise({
            redirect: '/'
        });
});

// Service that checks if data has already been loaded, else load the data
app.service('DataLoader', ['$http', '$rootScope', function($http, $rootScope){
    this.loadIfNeeded = function (){
        if(!$rootScope.employee) {
            $http.get('/api/timesheets')
                .success(function (data) {
                    $rootScope.employee = data;
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }
    }
}]);