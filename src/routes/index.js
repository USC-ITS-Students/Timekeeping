var router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/api/timesheets', require('./api/timesheets'));
router.use('/api/users', require('./api/users'));

module.exports = router;