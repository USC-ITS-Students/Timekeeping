(function(){
    'use strict';
    
    //TODO: ADD BUTTON FOR SUPERVISOR, DO KARMA TESTS

    // Service that checks if data has already been loaded, else load the data
    angular.module('app').service('DataLoader', ['$http', '$rootScope', '$q', function($http, $rootScope, $q){
        
        // this function handles loading the employee
        function loadEmployee(empid) {
            return $http.get('api/users/'+empid).then(function (data) {
                $rootScope.employee = data.data;

            });
          /*  if(!$rootScope.employee){
                return $http.get('api/users/'+empid).then(function (data) {
                    $rootScope.employee = data.data;

                });
            }
            else{
                if($rootScope.employee.empid != empid){
                    return $http.get('api/users/'+empid).then(function (data) {
                        $rootScope.employee = data.data;
                    });
                }
                else{
                    // employee already loaded
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            }  */
        }

        // this function deals with loading the employees managed by supervisor
        function loadSupervisorEmployees(empid){
            return $http.get('api/users/'+empid+'/supervisees').then(function (data) {
                $rootScope.supervisorEmployees = data.data;

            });
        /*   if(!$rootScope.supervisorEmployees){
                return $http.get('api/users/'+empid+'/supervisees').then(function (data) {
                    $rootScope.supervisorEmployees = data.data;
                    $rootScope.supervisorEmployees1="hello";
                });
            }
            else{
                // employees already loaded
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            }*/
        }

        // this function deals with loading the timesheets for the given year
        function loadTimesheets(empid,year){
          /*  if(!$rootScope.timesheets || $rootScope.year !== year){
                return $http.get('api/timesheets/'+empid+'/'+year).then(function (data) {

                    $rootScope.year = year;
                    $rootScope.timesheets = data.data;
                });
            }
            else{*/
                if(!$rootScope.employee.empid != empid){
                    return $http.get('api/timesheets/'+empid+'/'+year).then(function (data) {
                        $rootScope.year = year;
                        $rootScope.timesheets = data.data;
                    });
                }
                else{
                    // timesheets already loaded
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
           // }
        }

        // this function makes sure that both the em
        this.load = function (year, empid, cb) {
            $q.all([
                loadEmployee(empid),
                loadTimesheets(empid,year)

            ]).then(
                function(){
                    if(typeof cb === 'function') cb(null);
                },
                function(err){
                    if(typeof cb === 'function') cb(err);
                }
            );

        }

        this.loadSupervisor = function (year,empid,cb) {
            $q.all([
                loadEmployee(empid),
                loadSupervisorEmployees(empid)
            ]).then(
                function(){
                    if(typeof cb === 'function')cb(null);
                },
                function(err){
                    if(typeof cb === 'function')cb(err);
                }
            );
        }
    }]);
})();