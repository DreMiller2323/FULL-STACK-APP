var express = require('express');
var LocalStrategy=require("passport-local")
var path = require("path");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var logger = require('morgan');
var models = require("./models/");
var passport = require('passport');
var session = require('express-session');
var createError = require('http-errors');
var cors = require('cors');
var session = require("express-session");
var app = express();


app.use(express.static(path.join(__dirname,  "build")));
app.use(express.static("public"));

app.use(logger('dev'));
app.use(cors({
  origin: 'https://www.localhost:3000/'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
// app.use (express.static (path.join(__dirname, '../client/build')));

app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	resave: false,
	saveUninitialized: true,
}));
  app.use(passport.authenticate('session'));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname,  "build", "index.html"));
});
//debugging purposes not for production
app.use(function(req, res, next){
 console.log(req.session);
 console.log(req.user);
 next();
}); 
app.use(function(req, res, next) {
    next(createError(404));
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
