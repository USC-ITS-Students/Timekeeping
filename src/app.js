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

var routes = require('./routes/index');
var loginRoute = require('./routes/auth/login');

mongoose.connect('mongodb://test:123@ds027335.mongolab.com:27335/timedb');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'session',
    keys: ['keyboard cat', 'piano dog']
}));

// set up passport strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
   function(netid, password, done){
       console.log('In passport use local strategy: ' + netid + ', ' + password);
       if(netid === 'test' && password === 'test123'){
           return done(null, {netid:'test', first_name:'John', last_name:'Doe'})
       } else{
           return done(null, false);
       }
   }
));
passport.serializeUser(function(user, done){
    done(null, user.netid);
});
passport.deserializeUser(function(id, done){
    done(null, {netid:id, first_name:'John', last_name:'Doe'});
});

// Import api routes
app.use('/', routes);

module.exports = app;
