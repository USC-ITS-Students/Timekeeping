var router = require('express').Router();
var Timesheet = require('../../models').TimesheetModel;

router.get('/:year',
    //TODO: Add way for supervisors to retreive employee objects
    function(req, res){
        // check if user is logged in
        if(req.isAuthenticated()){
            Timesheet.getByYear(req.user.empid, req.params.year, function(err, docs){
                if(err) res.sendStatus(400);
                else{
                    res.json(docs);
                }
            });
        }else{
            res.sendStatus(401);
        }
    }
);

module.exports = router;