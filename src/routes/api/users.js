var router = require('express').Router();
var User = require('../../models/user');
var Timesheet = require('../../models/timesheet');

router.get('/:empid',
    function(req, res){
        // check if user is logged in
        if(req.isAuthenticated()){
            var id = req.params.id;
            // check if id is their own
            if(empid === req.user.empid){
                res.send(req.user);
            } else{
                //TODO: Add way for supervisors to retreive employee objects
            }
        }else{
            res.sendStatus(401);
        }
    }
);

router.get('/employees',function(req, res){
    // check if user is logged in
    if(req.isAuthenticated()){
    	//get employees who have a supervisor with a given approverid
        Timesheet.getEmployeesByTimesheetApprover(req.user.principal_id, function(err, docs){
            if(err) res.sendStatus(400);
            else{
                var empids=[];
                for(var i =0; i<docs.length; i++){
                    empids.push(docs[i].owner);
                }
                //get employee information
                User.getEmployeesByIDs(empids, function(err, result){
                if(err) res.sendStatus(400);
                else{
                    res.json(result);
                }
                });         
            }
        });
    }else{
        res.sendStatus(401);
    }
});

module.exports = router;