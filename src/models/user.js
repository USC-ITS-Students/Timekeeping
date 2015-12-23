// Models ---
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    netid: { type: String, required: true, index: { unique: true } },
    empid: { type: String, required: true, index: { unique: true } },
    firstname: String,
    lastname: String,
    timesheets: [
        {
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
        }
    ]
});

UserSchema.statics.login = function(netid, password, cb){
        if(password === 'test123'){
            this.findOne({netid:netid}, function(err, docs){
                if(typeof cb === 'function'){
                    if(err) cb(err);
                    else{
                        cb(null, docs);
                    }
                }
            });
        }
    };

UserSchema.statics.getByNetid = function(netid, cb){
    this.findOne({netid:netid}, function(err, docs){
        if(typeof cb === 'function'){
            if(err) cb(err);
            else{
                 cb(null, docs);
            }
        }
    });
};

// Exports ---
module.exports = mongoose.model('User', UserSchema);