// Models ---

var mongoose = require('mongoose');

var Employee = new mongoose.Schema({
    netid: String,
    empid: String,
    firstname: String,
    lastname: String,
    region: String,
    supervisors: [],
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


// Functions ---

// Todo: Fetch employee from database based on given ID
// Currently: Creates a new employee from scratch and sends that
function getEmployee() {
    var employee = {
        netid: 'testemp',
        empid: '123456',
        firstname: 'Test',
        lastname: 'Employee',
        region: '987430',
        supervisors: [],
        timesheets: [
            {
                start: new Date('1/1/16'),
                end: new Date('1/15/16'),
                total_hours: 80,
                timesheet_item: {
                    date: new Date('1/1/16'),
                    organization: 'USC ITS',
                    punch_in: new Date('1/1/16T09:00:00'),
                    punch_out: new Date('1/1/16T17:00:00')
                }
            }
        ]
    };

    return employee;
}

// Exports ---
module.exports = mongoose.model('User', Employee)
module.exports.getEmployee = getEmployee;