var router = require('express').Router();

router.get('/',
    function(req, res){
        // check if user is logged in
        if(req.isAuthenticated()){
            res.json(req.user);
        }else{
            res.sendStatus(401);
        }
    }
);

module.exports = router;