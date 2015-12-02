var router = require('express').Router();
var User = require('../../Models/user.js');

router.get('/timesheets', function(req, res){
	//This route will be passed a user's id and employee id within the query. Mongo will be queried and the results displayed
    User.find({ netid: req.query.netid, empid: req.query.empid}, function (err, users) {
	  if (err) return console.error(err);
	  res.json(users);
	});
});

module.exports = router; 