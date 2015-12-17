var router = require('express').Router();

router.get('/', function(req, res){
    if(req.isAuthenticated()){
        // user is logged in
        res.sendStatus(200);
    }else {
        // user is logged in
        res.sendStatus(401);
    }
});

module.exports = router;