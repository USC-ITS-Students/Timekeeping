var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');

var dbhost = 'localhost';
if(process.argv[2] === 'production'){
    dbhost = 'db';
}

mongoose.connect(dbhost + ':27017/Timesheet');
var User = require('./models/user');

// Don't serve front-end in production, when nginx is installed
//if(process.argv[2] !== 'production'){
    app.use(express.static(__dirname + '/public'));
//}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['keyboard cat', 'piano dog']
}));

// set up passport
passport.use(new LocalStrategy(
    function(netid, password, done){
        if(password === 'test123'){
            User.findOne({netid:netid}, function(err, docs){
                if(err) return done(err);
                else{
                    return done(null, docs);
                }
            });
        } else{
            return done(null, false);
        }
    }
));
passport.serializeUser(function(user, done){
    done(null, user.netid);
});
passport.deserializeUser(function(id, done){
    User.findOne({netid:id}, function(err, docs){
        if(err) done(err);
        else{
            done(null, docs);
        }
    });
});
app.use(passport.initialize());
app.use(passport.session());


// Import api routes
app.use('/', require('./routes'));

module.exports = app;
