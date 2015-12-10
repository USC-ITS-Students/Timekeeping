var router = require('express').Router();
var User = require('../../models/user');

router.get('/general', function (req, res) {
    User.find({ netid: req.query.netid, empid: req.query.empid }, 'firstname lastname empid region', function (err, users) {
        if (err) return console.error(err);
        res.json(users);
    });
});

router.get('/timesheetsOverview', function (req, res) {
    User.find({ netid: req.query.netid, empid:req.query.empid}, 'timesheets.end timesheets.total_hours', function (err, users) {
        if (err) return console.error(err);
        res.json(users);
    });
});

router.get('/timesheets', function (req, res) {
    //This route will be passed a user's id and employee id within the query. Mongo will be queried and the results displayed
    User.find({ netid: req.query.netid, empid: req.query.empid }, 'timesheets', function (err, users) {
        if (err) return console.error(err);
        res.json(users);
    });
});

module.exports = router;