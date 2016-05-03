// Models ---
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    empid: { type: String, required: true, index: { unique: true } },
    firstname: String,
    lastname: String,
    lastWorkedYear: Number,
    principal_id: String
});

UserSchema.statics.login = function(empid, password, cb){
        if(password === 'test123'){//5678901
            this.findOne({empid:empid}, function(err, docs){
                if(typeof cb === 'function'){
                    if(err) cb(err);
                    else{
                        cb(null, docs);
                    }
                }
            });
        }else{
            if(typeof cb === 'function'){
                cb('incorrect password.');
            }
        }
    };

//Search employee by mongodb id
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

//Search employee by empid
UserSchema.statics.getEmployeeById = function(empid, cb){
    this.findOne({empid:empid}, function(err, docs){
        if(typeof cb === 'function'){
            if(err) cb(err);
            else{
                cb(null, docs);
            }
        }
    });
};

//Get group of employees
UserSchema.statics.getEmployeesByIDs = function(ids, cb){
    query={
        empid:{"$in":ids}
    };
    //console.log(query);
    this.find(query, function(err, docs){
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