var router = require('express').Router();
var User = require('../../models/user');
var Timesheet = require('../../models/timesheet');

router.get('/getLoggedIn',
    function(req, res){
        // check if user is logged in
        if(req.isAuthenticated()){
           res.send(req.user);
        }else{
            res.sendStatus(401);
        }
    }
);

router.get('/:empid/supervisees',function(req, res){
    // check if user is logged in
    if(req.isAuthenticated()){

        var id = req.params.empid;
        // check if id is their own
        if(id === req.user.empid){
            //get employees who have a supervisor with a given approverid
         /*   Timesheet.getEmployeesByTimesheetApprover(req.user.principal_id, function(err, docs){
                if(err) res.sendStatus(400);
                else{
                    
                    var empids=[];

                    for(var i =0; i<docs.length; i++){
                        empids.push(docs[i].owner);
                    }

                    if (empids.length > 0){
                        //get employee information
                        User.getEmployeesByIDs(empids, function(err, result){
                            if(err) res.sendStatus(400);
                            else{
                                res.json(result);
                            }
                        });  
                    }
                    else{
                        res.sendStatus(204);
                    }
                }
            });*/

            User.getAllEmployees(id, function(err, result){
                if(err) res.sendStatus(400);
                else{
                    res.json(result);
                }
            });
        } 
        else{
            res.sendStatus(401);
        }
    }else{
        res.sendStatus(401);
    }
});

router.get('/:empid',
    function(req, res){
        // check if user is logged in
        if(req.isAuthenticated()){
            var id = req.params.empid;
            // check if id is their own
            if(id === req.user.empid){
                res.send(req.user);
            } 
            else{
              /*  Timesheet.findEmployeebyTimesheetApprover(req.user.principal_id, id, function(err, employee){
                    if(err) res.sendStatus(400);
                    else{
                        if(employee){                        
                            User.getEmployeeById(employee.owner, function(err, result){
                                if(err) res.sendStatus(400);
                                else{
                                    res.send(result);
                                }
                            });
                        }
                        else{
                            res.sendStatus(401);
                        }
                    }
                });*/
                User.getEmployeeById(id, function(err, result){
                    if(err) res.sendStatus(400);
                    else{
                        res.send(result);
                    }
                });
            }
        }else{
            res.sendStatus(401);
        }
    }
);


module.exports = router;