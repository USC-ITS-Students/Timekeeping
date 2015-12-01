var router = require('express').Router(),
    User = require('../Models/user.js');

router.get('/employees', function(req, res){

	//Basic user being saved to mongodb. 
	var user = User({ 
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
        ]});

	user.save(function(err){
    	if(err){
    		return res.send(err);
    	}
    	else{
    		console.log('Saved');
    	}
    });

	User.find(function (err, users) {
	  if (err) return console.error(err);
	  res.json(users);
	});
});

module.exports = router;