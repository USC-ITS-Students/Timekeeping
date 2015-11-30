var router = require('express').Router(),
    Users = require('../Models/user.js');


router.get('/employees', function(req, res){
   console.log(Users.getEmployee());
   res.json(Users.getEmployee());
});

module.exports = router;