var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var PORT = 3000;
var mongoose = require('mongoose');
var app = express();

var routes = require('./routes/index');
var loginController = require('./routes/api/login');

mongoose.connect('mongodb://localhost:27017/timedb');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Import api routes
app.use('/', routes);
app.use('/api', loginController);

module.exports = app;
