(function(){
    'use strict';

    // Service that checks if data has already been loaded, else load the data
    angular.module('app').service('DataLoader', ['$http', '$rootScope', '$q', function($http, $rootScope, $q){
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
})();