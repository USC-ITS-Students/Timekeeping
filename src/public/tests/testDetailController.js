'use strict';

describe('DetailController', function(){

    var overviewController, scope;

    //Mock services/data
    var mockrouteParams = {year:2015};
    var mockDataLoader = {load : function (year, cb){}};
    var mockLocation = {path: function (val){}, url: function (){}};

    var timesheets = [
                        {
                            owner: "7654321",
                            start: "2015-01-01T08:00:00.000Z",
                            end: "2015-01-14T08:00:00.000Z",
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
                                    positions : [ {title:'ITS - LUCY : Information Technology Services: Business Strategy', approver: 'Corley, Don', status: 'Approved', 
                                    days: [[{hours1:0, hours2:0, earncode:1}],[{hours1:3, hours2:3, earncode:1}],[{hours1:3, hours2:3, earncode:1}],
                                    [{hours1:4, hours2:2, earncode:1}],[{hours1:5, hours2:1, earncode:1}],[{hours1:2, hours2:0, earncode:1}],[{hours1:0, hours2:0, earncode:1}]]}],
                                    grandTotal : {hours: [0,6,6,6,6,2,0,0], total: 26}  
                                },
                                {
                                    positions : [ {title:'ITS - LUCY : Information Technology Services: Business Strategy', approver: 'Corley, Don', status: 'Approved', 
                                    days: [ [{hours1:0, hours2:0, earncode:1}],[{hours1:0, hours2:0, earncode:1}],[{hours1:4, hours2:3, earncode:1}],
                                    [{hours1:4, hours2:3, earncode:1}],[{hours1:3, hours2:3, earncode:1}],[{hours1:0, hours2:0, earncode:1}],[{hours1:0, hours2:0, earncode:1}]]}],                                   
                                    grandTotal : {hours: [0,0,7,7,6,6,0,0], total: 26}
                                }
                            ]
                        }
                    ];

    var weekDates = ['Thu Jan 01 2015', 'Fri Jan 02 2015', 'Sat Jan 03 2015', 'Sun Jan 04 2015', 'Mon Jan 05 2015', 'Tue Jan 06 2015', 'Wed Jan 07 2015',
                    'Thu Jan 08 2015', 'Fri Jan 09 2015', 'Sat Jan 10 2015', 'Sun Jan 11 2015', 'Mon Jan 12 2015', 'Tue Jan 13 2015', 'Wed Jan 14 2015'];

    beforeEach(module('app'));

    beforeEach(inject(function($rootScope, $controller){
       
        scope = $rootScope.$new();

        //Spies
        spyOn(mockDataLoader, 'load').and.returnValue(scope.timesheet);   
        spyOn(mockLocation, 'path');
        spyOn(mockLocation, 'url');  

        //Controller set up
        overviewController = $controller('detailController',{
            $scope : scope,
            $routeParams : mockrouteParams,
            $location : mockLocation,
            DataLoader : mockDataLoader
        });  

        scope.timesheet = timesheets[0];
    }));

    it('should loadData', function(){
        expect(mockDataLoader.load).toHaveBeenCalled();
    });

    it('goToOverview', function(){
        scope.goToOverview();
        expect(mockLocation.path).toHaveBeenCalledWith('/history/' + mockrouteParams.year);
    });

    it('should generateRange(n))', function(){
        expect(scope.generateRange(10).length).toEqual(10);
    });

    it('should generateWeekDates(start)', function(){
        var dates = scope.generateWeekDates(timesheets[0].start);
        for(var i = 0; i < dates.length; i++){
            expect(dates[i]).toEqual(new Date(weekDates[i]));
        }
    });

    it('should populateHours())', function(){
        spyOn(scope, 'generateHoursTable');  
        scope.populateHours();
        expect(scope.generateHoursTable).toHaveBeenCalledWith(scope.timesheet.week[0]);
        expect(scope.generateHoursTable).toHaveBeenCalledWith(scope.timesheet.week[1]);
    });

    it('should generateHoursTable(week))', function(){
        var table = scope.generateHoursTable(scope.timesheet.week[1]);
        expect(table.length).toEqual(1); //one element for each employee position
        //Compare data returned with timesheets information
        expect(table[0].position).toEqual(scope.timesheet.week[1].positions[0].title);
        expect(table[0].approver).toEqual(scope.timesheet.week[1].positions[0].approver);

        //Earncodes data
        expect(table[0].earnCodes[1]).toBeDefined();
        expect(table[0].earnCodes[1].days[2].hours1).toEqual(scope.timesheet.week[1].positions[0].days[2].hours1); //should match timesheet
        expect(table[0].earnCodes[1].days[2].hours2).toEqual(scope.timesheet.week[1].positions[0].days[2].hours2);
        expect(table[0].rowspan).toEqual(1)
    });
});