var router = require('express').Router();

router.get('/', function(req, res){
  req.logout();
  res.sendStatus(200);
});

module.exports = router;

