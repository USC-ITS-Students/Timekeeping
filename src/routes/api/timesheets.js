var router = require('express').Router();
var User = require('../../models/user');
var passport = require('passport');

router.get('/',
    function(req, res){
        // check if user is logged in
        if(req.isAuthenticated()){
            // user is stored in the session (req.user)
            console.log(req.user.timesheets[0].end);
            res.json(req.user);
        }else{
            res.sendStatus(401);
        }
    }
);

module.exports = router;