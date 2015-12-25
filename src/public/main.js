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
    var currentYear = new Date().getFullYear();
    $routeProvider
        // route for the login page
        .when('/', {
            redirectTo:'/history/'+currentYear
        })
        .when('/login', {
            templateUrl : 'modules/login/login.html',
            controller :  'loginController'
        })
        .when('/details/:year/:timesheet', {
            templateUrl: 'modules/history_report/timesheet_history_detail.html',
            controller:  'detailController',
            resolve: {
                loggedin: checkloggedin
            }
        })
        .when('/history/:year', {
            templateUrl: 'modules/history_report/timesheet_history.html',
            controller:  'overviewController',
            resolve: {
                loggedin: checkloggedin
            }
        })
        // Default
        .otherwise({
            redirectTo: '/history/'+currentYear
        });
});

// Service that checks if data has already been loaded, else load the data
app.service('DataLoader', ['$http', '$rootScope', '$q', function($http, $rootScope, $q){
    function loadEmployee() {
        if(!$rootScope.employee){
            // need to load the employee
            return $http.get('api/users').then(function (data) {
                $rootScope.employee = data.data;
            });
        }else{
            // employee already loaded
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }
    }

    function loadTimesheets(year){
        if(!$rootScope.timesheets || $rootScope.year !== year){
            // need to load the timesheets
            return $http.get('api/timesheets/'+year).then(function (data) {
                $rootScope.year = year;
                $rootScope.timesheets = data.data;
            });
        }else{
            // timesheets already loaded
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }
    }

    this.load = function (year, cb) {
        $q.all([
            loadEmployee(),
            loadTimesheets(year)
        ]).then(
            function(){
                if(typeof cb === 'function') cb(null);
            },
            function(err){
                if(typeof cb === 'function') cb(err);
            }
        );

    }
}]);

