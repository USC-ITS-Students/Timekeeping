var router = require('express').Router();
var passport = require('passport');

router.post('/',
    passport.authenticate('local'),
    function(req, res){
        console.log('login requst received');
        // This function is only called on a successful login
        // Session has been initialized
        // Send OK status
        res.sendStatus(200);
});

module.exports = router;