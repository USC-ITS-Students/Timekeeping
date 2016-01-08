// Models ---
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    empid: { type: String, required: true, index: { unique: true } },
    firstname: String,
    lastname: String,
    lastWorkedYear: Number
});

UserSchema.statics.login = function(empid, password, cb){
        if(password === 'test123'){
            this.findOne({empid:empid}, function(err, docs){
                if(typeof cb === 'function'){
                    if(err) cb(err);
                    else{
                        cb(null, docs);
                    }
                }
            });
        }
    };

UserSchema.statics.getById = function(id, cb){
    this.findById(id, function(err, docs){
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