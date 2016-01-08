var router = require('express').Router();
var passport = require('passport');

router.post('/',
    passport.authenticate('local'),
    function(req, res){
        // This function is only called on a successful login
        // Session has been initialized
        // Send year to redirect to
        res.json(req.user);
});

module.exports = router;