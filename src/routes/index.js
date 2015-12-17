var router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/api/timesheets', require('./api/timesheets'));

module.exports = router;