// Models ---

var EmployeeModel = {
    netid: String,
    empid: String,
    firstname: String,
    lastname: String,
    region: String,
    supervisors: [],
    timesheets: [
        {
            start: String,
            end: String,
            total_hours: Number,
            timesheet_item: {
                organization: String,
                punch_in: String,
                punch_out: String,
                date: String
            }
        }
    ]
};


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
                start: '1/1/16',
                end: '1/15/16',
                total_hours: 80,
                timesheet_item: {
                    date: '1/1/16',
                    organization: 'USC ITS',
                    punch_in: '9:00 AM',
                    punch_out: '5:00 PM'
                }
            }
        ]
    };

    return employee;
}

// Exports ---

module.exports.getEmployee = getEmployee;