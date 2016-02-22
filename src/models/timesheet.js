// Models ---
var mongoose = require('mongoose');

var TimesheetSchema = new mongoose.Schema({
    owner: String,
    end: Date,
    payfreq: String,
    supervisors: [String],
    empstatus: String,
    mealwaive1: String,
    mealwaive2: String,
    status: String,
    empstart: String,
    sickrate: String,
    sickbalance: Number,
    vacrate: Number,
    vacbalance: Number,
    winterrate: Number,
    winterbalance: Number,
    region: String,
    organization: String,
    hourTypeTotals: {},
    week: []
});

TimesheetSchema.statics.getByYear = function(owner, year, cb){
    if(typeof year !== 'number'){
        year = parseInt(year);
    }
    query = {
        owner:owner,
        '$and':[
            {end: {'$gte': new Date(year.toString()+'-01-01T00:00:00Z')}},
            {end: {'$lt': new Date((year+1).toString()+'-01-01T00:00:00Z')}}
        ]
    };
    this.find(query, function(err, docs){
        if(typeof cb === 'function'){
            if(err) cb(err);
            else{
                cb(null, docs)
            }
        }
    });
};

TimesheetSchema.statics.getEmployeesByTimesheetApprover = function(approverid, cb){
    query = {
        'week.positions.approverid':''+approverid+''
    };
    this.find(query, 'owner', function(err, docs){
        if(typeof cb === 'function'){
            if(err) cb(err);
            else{
                cb(null, docs)
            }
        }
    });
};



// Exports ---
module.exports = mongoose.model('Timesheet', TimesheetSchema);