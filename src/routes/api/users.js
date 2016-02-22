var router = require('express').Router();

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

module.exports = router;