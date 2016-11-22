/*
*** USC Timekeeping csv-to-mongodb parser ***
        Author: Daniel K. Arellano
        Email: dkarella@usc.edu
        Organization: USC ITS
 */


// Includes
var parser = require('csv-parse'),
    fs = require('fs'),
    async = require('async'),
    Q = require('q'),
    MongoClient = require('mongodb'),
    assert = require('assert'),
    argv = require('minimist')(process.argv.slice(2));

    var HelpMenu = "Help Menu:\n" +
            "---------------\n" +
            "-f: Main header .csv file;       **Required**\n" +
            "-e: Earn summary .csv file;      **Required**\n" +
            "-s: Sanctions .csv file;         **Required**\n" +
            "-t: Time .csv file;              **Required**\n" +
            "-p: Principal Prop .csv file;    **Required**\n" +
            "-c: Mongodb connection string;   'mongodb://localhost:27017/Timekeeping' by default\n" +
            "-h or --help: This menu.";

// Check if help flag was entered
if(argv.h || argv.help){
    console.log(HelpMenu);
    return;
}

// get commandline data
var headerFile = argv.f,
    earnSummaryFile = argv.e,
    sanctionsFile = argv.s,
    timeFile = argv.t,
    propertiesFile = argv.p,
    connectionString = argv.c;
var approvers = [];
var employees = [];
var properties = [];
// check if all required arguments have been given
if(headerFile && earnSummaryFile && sanctionsFile && timeFile && propertiesFile){
    // Start program
    main();
}else{
    console.log(HelpMenu);
    return;
}


// ************ //
// *** MAIN *** //
// ************ //
// parse data, merge and write to database
function main(){
    parse()
        .then(function(data){
            // sort timesheets by docid so that we can do binary searches to find index when merging
            data.timesheets.sort(compare);

            function compare(a,b) {
                if (a.docid < b.docid)
                    return -1;
                else if (a.docid > b.docid)
                    return 1;
                else
                    return 0;
            }
            return merge(data);
        })
        .then(function(merged_data){
            // connect to database
            if(!connectionString){
                connectionString = "mongodb://localhost:27017/Timekeeping2";
            }

            MongoClient.connect(connectionString, {native_parser:true}, function(err, db) {
                assert.equal(null, err);

                // insert to db
                Q.all([
                    // insert employees
                    db.collection('users').insert(merged_data.employees),
                    // insert timesheets
                    db.collection('timesheets').insert(merged_data.timesheets)
                ]).then(
                    function(){
                        // if successful just close the connection
                        console.log('Successfully written to the db.');
                        db.close();
                    },
                    function(err){
                        // if error, print error and close
                        console.log(err);
                        db.close();
                    }
                );
            });
        });
}

// **************************** //
// *** FUNCTION DEFINITIONS *** //
// **************************** //
// MAIN PARSE FUNCTION: parses the data from csv files and turns them into js objects
function parse() {
    return Q.all([
        parseHeader(headerFile),
        parseEarnSummary(earnSummaryFile),
        parseSanctions(sanctionsFile),
        parseTime(timeFile),
        parseProperties(propertiesFile)

    ]).then(function(callbacks){
        var data = {};

        callbacks[0](function(ret){
            data.timesheets = ret[0];
            data.employees = ret[1];
        });
        callbacks[1](function(ret){
            data.summaries = ret;
        });
        callbacks[2](function(ret){
            data.sanctions = ret;
        });
        callbacks[3](function(ret){
            data.times = ret;
        });
        callbacks[4](function(ret){
            data.properties = ret;
        });

        return data;
    });
}

// MAIN MERGE FUNCTION: merges the summaries, sanctions and times into corresponding timesheets
function merge(data){
    return Q.all([
        mergeEmployeesInfo(data.employees, data.properties),
        mergeSummaries(data.timesheets, data.summaries),
        mergeSanctions(data.timesheets, data.sanctions),
        mergeTimes(data.timesheets, data.times),
        mergeApprovers(data.employees)
    ]).then(function(){
        return data;
    });
}

// PARSE FUNCTIONS: Read in and parse .csv files and call on process functions (see below)
function parseHeader(file){
    return Q.nfcall(fs.readFile, file, 'utf-8')
        .then(function(text){
            return Q.nfcall(parser, text);
        })
        .then(function(data){
            return processHeader(data);
        })
}

function parseEarnSummary(file){
    return Q.nfcall(fs.readFile, file, 'utf-8')
        .then(function(text){
            return Q.nfcall(parser, text);
        })
        .then(function(data){
            return processEarnSummary(data);
        });
}

function parseSanctions(file){
    return Q.nfcall(fs.readFile, file, 'utf-8')
        .then(function(text){
            return Q.nfcall(parser, text);
        })
        .then(function(data){
            return processSanctions(data);
        });
}

function parseTime(file){
    return Q.nfcall(fs.readFile, file, 'utf-8')
        .then(function(text){
            return Q.nfcall(parser, text);
        })
        .then(function(data){
            return processTime(data);
        });
}

function parseProperties(file){
    return Q.nfcall(fs.readFile, file, 'utf-8')
        .then(function(text){
            return Q.nfcall(parser, text);
        })
        .then(function(data){
            return processProperties(data);
        })
}



// PROCESS FUNCTIONS: Turn parsed csv files into JS Objects ready to be merged
function processHeader(data){
    return Q(function(resolve, reject){

        var timesheets = [];
        async.each(
            data, // array of rows
            // function to apply on each row
            function(doc, callback){
                var docid = doc[0],
                    supervisors = doc[2],
                    organization = doc[3],
                    region = doc[4],
                    name = doc[5],
                    empid = doc[6],
                    payfreq = doc[7],
                    empstatus = doc[8],
                    empstart = doc[9],
                    mealwaive1 = doc[10],
                    mealwaive2 = doc[11],
                    docstatus = doc[12],
                    enddate = doc[13],
                    sickrate = doc[14],
                    sickbalance = doc[15],
                    vacrate = doc[16],
                    vacbalance = doc[17],
                    winterrate = doc[18],
                    winterbalance = doc[19];

                // calculate the start date
                enddate = new Date(enddate);
                var startdate = new Date();
                startdate.setTime(enddate.getTime() - 13*86400000);

                var employee = {
                    empid: empid,
                    firstname: name.slice(0, name.indexOf(',')),
                    lastname: name.slice(name.indexOf(',')+2, name.length),
                    latestYearWorked: enddate.getFullYear(),
                    earliestYearWorked: enddate.getFullYear(),
                    docid:docid
                };

                // check if we need to push the employee or update
                if(employees.length === 0){
                    employees.push(employee);
                }else{
                    var employeeFound = false;
                    for(var i = 0; i < employees.length; i++){
                        if(employees[i].empid === empid){
                            employeeFound = true;
                            employees[i].latestYearWorked = Math.max(employees[i].latestYearWorked, employee.latestYearWorked);
                            employees[i].earliestYearWorked = Math.min(employees[i].earliestYearWorked, employee.earliestYearWorked);
                        }
                    }
                    if(!employeeFound){
                        employees.push(employee);
                    }
                }

                var timesheet = {
                    docid: docid,
                    owner: empid,
                    start: startdate,
                    end: enddate,
                    payfreq: payfreq,
                    supervisors: supervisors.split(","),
                    empstatus: empstatus,
                    mealwaive1: mealwaive1,
                    mealwaive2: mealwaive2,
                    status: docstatus,
                    empstart: empstart,
                    sickrate: parseFloat(sickrate),
                    sickbalance: parseFloat(sickbalance),
                    vacrate: parseFloat(vacrate),
                    vacbalance: parseFloat(vacbalance),
                    winterrate: parseFloat(winterrate),
                    winterbalance: parseFloat(winterbalance),
                    region: region,
                    organization: organization,
                    hourTypeTotals: {
                        'Regular': 0,
                        'Overtime': 0,
                        'Double Time': 0,
                        'Vacation': 0,
                        'Sick': 0,
                        'Other Paid': 0,
                        'Other Unpaid': 0
                    },
                    week: [
                        {
                            positions: []
                        },
                        {
                            positions: []
                        }
                    ]
                };

                timesheets.push(timesheet);
                callback();
            },
            // when done:
            function(err){
                if(err) return reject(err);
                return resolve([timesheets, employees]);
            }
        );
    });
}

function processEarnSummary(data){
    return Q(function(resolve, reject){
        var summaries = {
            grandTotals: [],
            hourTypeTotals: []
        };
        async.each(
            data, // array of rows
            // function to apply on each row
            function(doc, callback){
                var docid = doc[0],
                    weeknum = doc[1],
                    grandtotal = doc[3],
                    timeType = doc[5],
                    hours = [parseFloat(doc[6]),parseFloat(doc[7]),parseFloat(doc[8]),parseFloat(doc[9]),parseFloat(doc[10]),parseFloat(doc[11]),parseFloat(doc[12])],
                    totalhours = parseFloat(doc[13]);

                if(grandtotal === 'Y'){
                    var summary = {
                        docid: docid,
                        weeknum: weeknum-1,
                        hours: hours,
                        totalhours : parseFloat(totalhours)
                    };
                    summaries.grandTotals.push(summary);
                }else{
                    var summary = {
                        docid: docid,
                        type: timeType,
                        totalhours : parseFloat(totalhours)
                    };
                    summaries.hourTypeTotals.push(summary);
                }
                callback();
            },
            // when done:
            function(err){
                if(err) return reject(err);
                return resolve(summaries);
            }
        )
    });
}

function processSanctions(data){
    return Q(function(resolve, reject){
        var sanctions = [];
        async.each(
            data, // array of rows
            // function to apply on each row
            function(doc, callback){
                var docid = doc[0],
                    weeknum = doc[1],
                    type = doc[2],
                    checks = [doc[3], doc[4], doc[5], doc[6], doc[7], doc[8], doc[9]];

                var sanction = {
                    docid: docid,
                    weeknum: weeknum-1,
                    type: type,
                    checks: checks
                };

                sanctions.push(sanction);
                callback();
            },
            // when done:
            function(err){
                if(err) return reject(err);
                return resolve(sanctions);
            }
        )
    });
}

function processTime(data){
    var times = [];
    return Q(function(resolve, reject){
        async.each(
            data, // array of rows
            // function to apply on each row
            function(doc, callback){
                var docid = doc[0],
                    day = doc[1],
                    hours1 = doc[2],
                    hours2 = doc[3],
                    weeknum = doc[4],
                    position = doc[6],
                    earncode = doc[8],
                    approver = doc[9],
                    approverid = doc[10],
                    status = doc[11];


                var time = {
                    docid: docid,
                    weeknum: weeknum-1,
                    hours1: hours1,
                    hours2: hours2,
                    day: day,
                    position: position,
                    earncode: earncode,
                    approver: approver,
                    approverid: approverid,
                    status: status
                };
                var employeeID;

                for(var i = 0; i < employees.length; i++){
                    if(employees[i].docid === docid){
                        employeeID=employees[i].empid;

                    }
                }
                var empIDs=[];
                empIDs.push(employeeID)
                var approver ={
                    empid:approverid,
                    supervisee:empIDs
                }
                if (approvers.length==0){
                    approvers.push(approver);

                }
                var approverFound = false;
                var empFound = false;
                for(var i = 0; i < approvers.length; i++){
                    if(approvers[i].empid === approverid){
                        approverFound = true;

                        for (var j=0 ; j< approvers[i].supervisee.length; j++)
                        {
                            if (approvers[i].supervisee[j]===employeeID)
                            {
                                empFound=true;
                            }
                        }
                        if(!empFound){

                            approvers[i].supervisee.push(employeeID);
                        }
                    }
                }
                if(!approverFound){
                    approvers.push(approver);
                }


                times.push(time);
                callback();
            },
            // when done:
            function(err){
                if(err) return reject(err);
                return resolve(times);
            }
        )
    });
}

function processProperties(data){
    return Q(function(resolve, reject){

        async.each(
            data, // array of rows
            // function to apply on each row
            function(doc, callback){
                var principal_id = doc[0],
                    empid = doc[20];

                var property = {
                    empid: empid,
                    principal_id: principal_id
                };

                properties.push(property);

                callback();
            },
            // when done:
            function(err){
                if(err) return reject(err);
                return resolve(properties);
            }
        );
    });
}


// MERGE FUNCTIONS: After parsing in the data, the data is all merged into two types of objects, timesheets and employees
function mergeEmployeesInfo(employees, properties){
    // merge principal id with employee
    async.each(
        properties,
        function(property){
            var employeeFound = false;
            for(var i = 0; i < employees.length; i++){
                if(employees[i].empid === property.empid){
                    employeeFound = true;
                    employees[i].principal_id = property.principal_id;
                }
            }
        },
        // when done:
        function(err){
            if(err) console.log(err);
        }
    );
}

// MERGE FUNCTIONS: After parsing in the data, the data is all merged into two types of objects, timesheets and employees
function mergeApprovers(employees){
    // merge principal id with employee
    async.each(
        approvers,
        function(approver){

            console.log( approver.empid);
            var employeeFound = false;
            for(var i = 0; i < employees.length; i++){
                if(employees[i].empid === approver.empid){

                    employeeFound = true;
                    employees[i].supervisees = approver.supervisee;
                }
            }
        },
        // when done:
        function(err){
            if(err) console.log(err);
        }
    );
}

function mergeSummaries(timesheets, summaries){
    // merge grand totals
    async.each(
        summaries.grandTotals,
        function(grandTotal){
            var i = getIndexOfMatch(timesheets, grandTotal.docid);
            if(i !== -1){
                timesheets[i].week[grandTotal.weeknum].grandTotal = {
                    hours: grandTotal.hours,
                    total: grandTotal.totalhours
                };
            }else{
                console.log('Could not find header with docid: "' + grandTotal.docid + '"for a grand total!');
            }
        },
        // when done:
        function(err){
            if(err) console.log(err);
        }
    );

    // merge hour type totals
    async.each(
        summaries.hourTypeTotals,
        function(hourTypeTotal){
            var i = getIndexOfMatch(timesheets, hourTypeTotal.docid);
            if(i !== -1){
                timesheets[i].hourTypeTotals[hourTypeTotal.type] += hourTypeTotal.totalhours;
            }else{
                console.log('Could not find header with docid: "' + hourTypeTotal.docid + '"for a hour type total!');
            }
        },
        // when done:
        function(err){
            if(err) console.log(err);
        }
    );
}

function mergeSanctions(timesheets, sanctions){
    async.each(
        sanctions,
        function(sanction){
            var i = getIndexOfMatch(timesheets, sanction.docid);
            if(i !== -1){
                timesheets[i].week[sanction.weeknum][sanction.type+'Sanctions'] = sanction.checks;
            }else{
                console.log('Could not find header with docid: "' + sanction.docid + '" for a sanction!');
            }
        },
        // when done:
        function(err){
            if(err) console.log(err);
        }
    );
}

function mergeTimes(timesheets, times){
    async.each(
        times,
        function(time){
            var i = getIndexOfMatch(timesheets, time.docid);
            if(i !== -1){
                var posIdx = -1; // need to keep track of what position the time corresponds to so that we can update approve/status
                // check if there are any positions
                var len = timesheets[i].week[time.weeknum].positions.length;
                if(len > 0){
                    // if yes, then check if the positions already exists
                    for(var j = 0; j < len; j++) {
                        if (timesheets[i].week[time.weeknum].positions[j].title === time.position) {
                            posIdx = j;
                            // if it does exist then just append
                            timesheets[i].week[time.weeknum].positions[j].days[time.day].push({
                                hours1: time.hours1,
                                hours2: time.hours2,
                                earncode: time.earncode
                            });
                            break;
                        }
                    }

                    // it it doesn't exist yet, then create a new position
                    if(posIdx === -1){
                        timesheets[i].week[time.weeknum].positions.push({
                            title: time.title,
                            days: [[], [], [], [], [], [], []]
                        });
                        timesheets[i].week[time.weeknum].positions[j].days[time.day].push({
                            hours1: time.hours1,
                            hours2: time.hours2,
                            earncode: time.earncode
                        });
                        posIdx = timesheets[i].week[time.weeknum].positions.length - 1;
                    }

                }else{
                    // no then just create one
                    timesheets[i].week[time.weeknum].positions.push({
                        title: time.position,
                        days: [[], [], [], [], [], [], []]
                    });
                    timesheets[i].week[time.weeknum].positions[len].days[time.day].push({
                        hours1: time.hours1,
                        hours2: time.hours2,
                        earncode: time.earncode
                    });

                    posIdx = timesheets[i].week[time.weeknum].positions.length - 1;
                }
                // Approver / status should be the same for all times corresponding to a position
                // so we can just update each time
                timesheets[i].week[time.weeknum].positions[posIdx].approver = time.approver;
                timesheets[i].week[time.weeknum].positions[posIdx].approverid = time.approverid;
                timesheets[i].week[time.weeknum].positions[posIdx].status = time.status;
            }else{
                console.log('Could not find header with docid: "' + time.docid + '" for a time!');
            }
        },
        // when done:
        function(err){
            if(err) return reject(err);
            return resolve();
        }
    );
}

function getIndexOfMatch(timesheets, docid){
    var left = 0;
    var right = timesheets.length -1;

    while(left <= right){
        var mid = Math.floor((left+right)/2);
        if(docid < timesheets[mid].docid){
            right = mid-1;
        }else if(docid > timesheets[mid].docid){
            left = mid+1;
        }else{
            return mid;
        }
    }

    return -1;
}

function write(outputFile, output){
    fs.writeFile(outputFile, output, function(err){
        if(err) return console.log(err);
        console.log('written to: ' + outputFile);
    })
}
