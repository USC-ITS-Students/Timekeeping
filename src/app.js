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
var User =  require('./models').UserModel;

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
    function(empid, password, done){
        User.login(empid, password, function(err, docs){
            if(err) return done(err);
            else{
                return done(null, docs)
            }
        });
    }
));
passport.serializeUser(function(user, done){
    done(null, user._id);
});
passport.deserializeUser(function(id, done){
    User.getById(id, function(err, docs){
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
