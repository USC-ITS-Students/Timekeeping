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

router.get('/:empid/:year',function(req, res){
        // check if user is logged in
        if(req.isAuthenticated()){
            var id = req.params.empid;
            var authorized= false;

            //check if id is its own
            if(id === req.user.empid){
                Timesheet.getByYear(req.params.empid, req.params.year, function(err, docs){
                    if(err) res.sendStatus(400);
                    else{
                        res.json(docs);
                    }
                });
            }
            else{
                //user trying to access another employees timesheets, check if its supervisor
                Timesheet.findEmployeebyTimesheetApprover(req.user.principal_id, id, function(err, employee){
                    if(err) res.sendStatus(400);
                    else{
                        if(employee){     
                            Timesheet.getByYear(req.params.empid, req.params.year, function(err, docs){
                                if(err) res.sendStatus(400);
                                else{
                                    res.json(docs);
                                }
                            });
                        }
                        else{
                            res.sendStatus(401);
                        }
                    }
                });
            }

        }else{
            res.sendStatus(401);
        }
    }
);

module.exports = router;