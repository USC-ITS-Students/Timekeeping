// Models ---
var mongoose = require('mongoose');

var Employee = new mongoose.Schema({
    netid: { type: String, required: true, index: { unique: true } },
    empid: { type: String, required: true, index: { unique: true } },
    firstname: String,
    lastname: String,
    region: String,
    supervisors: [String],
    timesheets: [
        {
            start: Date,
            end: Date,
            total_hours: Number,
            timesheet_item: {
                organization: String,
                punch_in: Date,
                punch_out: Date,
                date: Date
            }
        }
    ]
});

// Exports ---
module.exports = mongoose.model('User', Employee);