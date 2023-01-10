var express = require('express');
var path =  require("path")
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var logger = require('morgan');
var models = require("./models/");
var cors = require('cors');

// var passport = require('passport');
// var session = require('express-session');
var cookieParser = require('cookie-parser')

var createError = require('http-errors');
// var session = require("express-session");
require("dotenv").config();


var app = express();
app.use(cookieParser())
app.use(cors());
app.use(express.json());
var cors = {
  origin: 'http://localhost3000/',
}

app.use(express.static(path.join(__dirname,"client", "build")));app.use(logger('dev'));
app.use(express.urlencoded({ limit:"50mb", extended: true}));
app.use(cookieParser());
// app.use(session({
// 	key: 'session_cookie_name',
// 	secret: 'session_cookie_secret',
// 	resave: false,
// 	saveUninitialized: true,
//   cookie: {secure: true}
// }));
//   app.use(passport.authenticate('session'));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static("public"));
app.use('/index', indexRouter);
app.use('/users', usersRouter);

app.use(express.static('public'));

//debugging purposes not for production
app.use(function(req, res, next){
 console.log(req.session);
 console.log(req.user);
 next();
}); 
app.use(function(req, res, next) {
    next(createError(404));
  });
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../deez-nuts/build', 'index.html'));
  });
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
   models.sequelize.sync().then(function () {
    
    
    console.log("DB Sync'd up")
  });
module.exports = app;
