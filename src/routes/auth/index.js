var router = require('express').Router();

router.use('/login', require('./login'));
router.use('/checkloggedin', require('./checkloggedin'));
router.use('/logout', require('./logout'));

module.exports = router;