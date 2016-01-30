'use strict';

describe('OverviewController', function(){

    var overviewController, scope;

    //Mock services/data
    var mockrouteParams = {year:2015};
    var mockDataLoader = {load : function (year, cb){}};
    var mockLocation = {path: function (val){}, url: function (){}};

    var employee = {
                    empid: "7654321",
                    firstname: "Qwerty",
                    lastname: "Asdf",
                    latestYearWorked: 2015,
                    earliestYearWorked: 2013
                    };

    var timesheets = [
                        {
                            owner: "7654321",
                            start: "2015-01-01T08:00:00.000Z",
                            end: "2015-01-14T08:00:00.000Z",
                            hourTypeTotals: {
                                'Regular': 40,
                                'Overtime': 4,
                                'Double Time': 0,
                                'Vacation': 10,
                                'Sick': 0,
                                'Other Paid': 0,
                                'Other Unpaid': 0
                            },
                            week: [
                                {
                                    grandTotal : {hours: [4,5,5,5,5,5,4], total: 33} //hours: hours per day, total: total per week
                                },
                                {
                                    grandTotal : {hours: [3,3,3,3,3,3,3], total: 21}
                                }
                            ]
                        },
                        {
                            owner: "7654321",
                            start: "2015-15-01T08:00:00.000Z",
                            end: "2015-01-28T08:00:00.000Z",
                            hourTypeTotals: {
                                'Regular': 40,
                                'Overtime': 10,
                                'Double Time': 0,
                                'Vacation': 1,
                                'Sick': 1,
                                'Other Paid': 0,
                                'Other Unpaid': 0
                            },
                            week: [
                                { 
                                    grandTotal : {hours: [0,6,6,6,6,2,0,0], total: 26}  
                                },
                                {
                                    grandTotal : {hours: [0,0,7,7,6,6,0,0], total: 26}
                                }
                            ]
                        }
                    ];
    
    var yearsWorked = [2015,2014,2013];
    var totalHours = [80,14,0,11,1,0,0,106]; //total hours per type

    beforeEach(module('app'));

    beforeEach(inject(function($rootScope, $controller){

        //Spies
        spyOn(mockDataLoader, 'load');//.and.returnValue();   
        spyOn(mockLocation, 'path');
        spyOn(mockLocation, 'url');     

        //Controller set up
        scope = $rootScope.$new();
        overviewController = $controller('overviewController',{
            $scope : scope,
            $routeParams : mockrouteParams,
            $location : mockLocation,
            DataLoader : mockDataLoader
        });
    }));

    it('should loadData', function(){
        expect(mockDataLoader.load).toHaveBeenCalled();
    });

    it('should calculateTotalHours(timesheets)', function(){
        expect(scope.calculateTotalHours(timesheets)).toEqual(totalHours);
    });

    it('should calculateYearsWorked(earliestYearWorked, latestYearWorked)', function(){
        expect(scope.calculateYearsWorked(employee.earliestYearWorked, employee.latestYearWorked)).toEqual(yearsWorked);
    });

    it('should getPeriodDetail(timesheet_index)', function(){
        var timesheet_index = 1;
        scope.getPeriodDetail(timesheet_index);
        expect(mockLocation.path).toHaveBeenCalled();
        expect(mockLocation.path).toHaveBeenCalledWith('/details/'+mockrouteParams.year+'/'+timesheet_index);
    });

    it('should call location.url method onChange()', function(){
        scope.onChange();
        expect(mockLocation.url).toHaveBeenCalled();
        expect(mockLocation.url).toHaveBeenCalledWith('/history/' + scope.selectedYear);
    });
});