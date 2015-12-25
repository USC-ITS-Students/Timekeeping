// Models ---
var mongoose = require('mongoose');

var TimesheetSchema = new mongoose.Schema({
    start: Date,
    end: Date,
    total_hours: Number,
    orgs: [{
        orgname: String,
        position: String,
        timesheet_items: [{
            punch_in: Date,
            punch_out: Date
        }]
    }]
});

TimesheetSchema.statics.getByOwner = function(owner, cb){
    this.find({owner:owner}, function(err, docs){
        if(typeof cb === 'function'){
            if(err) cb(err);
            else{
                cb(null, docs)
            }
        }
    });
};

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



// Exports ---
module.exports = mongoose.model('Timesheet', TimesheetSchema);