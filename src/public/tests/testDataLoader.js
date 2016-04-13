'use strict';

describe('Data Loader Service', function(){
    var DataLoader, rootScope, httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function(_DataLoader_, $rootScope, $httpBackend){
        DataLoader = _DataLoader_;
        httpBackend = $httpBackend;
        rootScope = $rootScope;
    }));

    describe('#load(year, callback)', function(){
        it('should load employee data and their timesheet data for the given year', function(){
            httpBackend.whenGET('api/users').respond(
                {
                    empid: "7654321",
                    firstname: "Qwerty",
                    lastname: "Asdf",
                    latestYearWorked: 2015,
                    earliestYearWorked: 2013
                }
            );

            httpBackend.whenGET('api/timesheets/2015').respond(
                [
                    {
                        owner: "7654321",
                        start: "2015-01-01T08:00:00.000Z",
                        end: "2015-01-14T08:00:00.000Z"
                    },
                    {
                        owner: "7654321",
                        start: "2015-15-01T08:00:00.000Z",
                        end: "2015-01-28T08:00:00.000Z"
                    }
                ]
            );

            DataLoader.load(2015, function(err){
                expect(err).toEqual(null);
                expect(rootScope.employee.empid).toEqual('7654321');
                expect(rootScope.timesheets[0].owner).toEqual('7654321');
                httpBackend.flush();
            });
            

        });
    });
});