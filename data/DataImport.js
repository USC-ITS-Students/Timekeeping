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
    //console.dir(argv);

    var HelpMenu = "Help Menu:\n" +
            "---------------\n" +
            "-f: Main header .csv file;       should be placed in same folder as this script         **Required**\n" +
            "-e: Earn summary .csv file;      should be placed in same folder as this script         **Required**\n" +
            "-s: Sanctions .csv file;         should be placed in same folder as this script         **Required**\n" +
            "-t: Time .csv file;              should be placed in same folder as this script         **Required**\n" +
            "-c: Mongodb connection string;   'mongodb://localhost:27017/Timesheet' by default\n" +
            "-h or --help: This menu.";

if(argv.h || argv.help){
    console.log(HelpMenu);
    return;
}

var headerFile = argv.f,
    earnSummaryFile = argv.e,
    sanctionsFile = argv.s,
    timeFile = argv.t,
    connectionString = argv.c;

if(headerFile && earnSummaryFile && sanctionsFile && timeFile){
    // Start program
    main();
}else{
    console.log(HelpMenu);
    return;
}

// ************ //
// *** MAIN *** //
// ************ //
function main(){
    // parse data, merge and write to database
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
                connectionString = "mongodb://localhost:27017/Timesheet";
            }

            MongoClient.connect(connectionString, {native_parser:true}, function(err, db) {
                assert.equal(null, err);

                // don't include docid when inserting to mongo
                merged_data.timesheets.forEach(function(timesheet){
                    delete timesheet.docid;
                });

                // insert to db
                Q.when([
                    // insert employees
                    db.collection('users').insert(merged_data.employees/*.slice(1, merged_data.employees.length)*/),
                    // insert timesheets
                    db.collection('timesheets').insert(merged_data.timesheets)
                ]).then(
                    function(){
                        // if successful just close the connection
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
        parseHeader(__dirname + '/' + headerFile),
        parseEarnSummary(__dirname + '/' + earnSummaryFile),
        parseSanctions(__dirname + '/' + sanctionsFile),
        parseTime(__dirname + '/' + timeFile)
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

        return data;
    });
}

// MAIN MERGE FUNCTION: merges the summaries, sanctions and times into corresponding timesheets
function merge(data){
    return Q.when([
        mergeSummaries(data.timesheets, data.summaries),
        mergeSanctions(data.timesheets, data.sanctions),
        mergeTimes(data.timesheets, data.times)
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

// PROCESS FUNCTIONS: Turn parsed csv files into JS Objects ready to be merged
function processHeader(data){
    return Q(function(resolve, reject){
        var employees = [];
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

                var employee = {
                    empid: empid,
                    firstname: name.slice(0, name.indexOf(',')),
                    lastname: name.slice(name.indexOf(',')+2, name.length)
                };


                // check if we need to push the employee
                if(employees.length === 0){
                    employees.push(employee);
                }else{
                    var employeeFound = false;
                    for(var i = 0; i < employees.length; i++){
                        if(employees[i].empid === empid){
                            employeeFound = true;
                        }
                    }
                    if(!employeeFound){
                        employees.push(employee);
                    }
                }

                var timesheet = {
                    docid: docid,
                    owner: empid,
                    end: enddate,
                    payfreq: payfreq,
                    supervisors: supervisors.split(","),
                    empstatus: empstatus,
                    mealwaive1: mealwaive1,
                    mealwaive2: mealwaive2,
                    status: docstatus,
                    empstart: empstart,
                    sickrate: sickrate,
                    sickbalance: sickbalance,
                    vacrate: vacrate,
                    vacbalance: vacbalance,
                    winterrate: winterrate,
                    winterbalance: winterbalance,
                    region: region,
                    organization: organization,
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
        var summaries = [];
        async.each(
            data, // array of rows
            // function to apply on each row
            function(doc, callback){
                var docid = doc[0],
                    weeknum = doc[1],
                    grandtotal = doc[3],
                    position = doc[4],
                    earncode = doc[5],
                    hours = [doc[6],doc[7],doc[8],doc[9],doc[10],doc[11],doc[12]],
                    totalhours = doc[13];


                // we only care about the totals here, the position specific hours is parsed in parseTime
                if(grandtotal === 'Y'){
                    var summary = {
                        docid: docid,
                        weeknum: weeknum-1,
                        hours: hours,
                        totalhours : totalhours
                    };

                    summaries.push(summary);
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
                    start = doc[2],
                    end = doc[3],
                    weeknum = doc[4],
                    position = doc[6],
                    earncode = doc[8];


                var time = {
                    docid: docid,
                    weeknum: weeknum-1,
                    start: start,
                    end: end,
                    day: day,
                    position: position,
                    earncode: earncode
                };

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


// MERGE FUNCTIONS: After parsing in the data, the data is all merged into two types of objects, timesheets and employees
function mergeSummaries(timesheets, summaries){
    async.each(
        summaries,
        function(summary){
            var i = getIndexOfMatch(timesheets, summary.docid);
            if(i !== -1){
                timesheets[i].week[summary.weeknum].summary = {
                    hours: summary.hours,
                    total: summary.totalhours
                };
            }else{
                console.log('Could not find header with docid: "' + summary.docid + '"for a summary!');
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
                // check if there are any positions
                var len = timesheets[i].week[time.weeknum].positions.length;
                if(len > 0){
                    // if yes, then check if the positions already exists
                    for(var j = 0; j < len; j++){
                        if(timesheets[i].week[time.weeknum].positions[j].title = time.position){
                            // if it does exist then just append
                            timesheets[i].week[time.weeknum].positions[j].days[time.day].push({
                                start: time.start,
                                end: time.end,
                                earncode: time.earncode
                            });
                        }else{
                            // it it doesn't exist then create a new position
                            timesheets[i].week[time.weeknum].positions[j].push({
                                title: time.title,
                                days: [[], [], [], [], [], [], []]
                            });
                            timesheets[i].week[time.weeknum].positions[j].days[time.day].push({
                                start: time.start,
                                end: time.end,
                                earncode: time.earncode
                            });
                        }
                    }
                }else{
                    // no then just create one
                    timesheets[i].week[time.weeknum].positions.push({
                        title: time.position,
                        days: [[], [], [], [], [], [], []]
                    });
                    timesheets[i].week[time.weeknum].positions[len].days[time.day].push({
                        start: time.start,
                        end: time.end,
                        earncode: time.earncode
                    });
                }
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