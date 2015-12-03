var router = require('express').Router(),
    User = require('../Models/user.js');

router.get('/login', function(req, res){

    res.send('Welcome to login');

});

module.exports = router;