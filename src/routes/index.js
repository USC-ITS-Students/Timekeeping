var router = require('express').Router();

router.get('/login', function(req, res){

    res.send('Welcome to login');

});

module.exports = router;