var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sessions = require('client-sessions');
const csurf = require('csurf');
//mongodb driver -> mongoose
const mongoose = require('mongoose');
let user = require('./db_models/user-model');
let uri = 'mongodb://rxg6164:mulsanne%40383061@ds115758.mlab.com:15758/user';
//open a connection to the 'test' database on our locally running instance of MongoDB.
mongoose.connect(uri);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  // we're connected!
  // let user1 = new user({
  //   email:'abc@xyz.com',
  //   username: 'abc',
  //   password:'abc',
  //   passwordConf: 'abc'
  // });
  // user1.save(function (err) {
  //   if (err) return err;
  //   // saved!
  // })
  // let user2 = new user({
  //   email:'mno@rst.com',
  //   username: 'mno',
  //   password:'mno',
  //   passwordConf: 'mno'
  // });
  // user2.save(function (err) {
  //   if (err) return err;
  //   // saved!
  // })
});


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let homeRouter = require('./routes/home');
let registerRouter = require('./routes/register');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(csurf({cookie:true}));
app.use(sessions({
  cookieName: "session",
  secret: "qc1s5f52a8fFg3T2YH3Sf8T12S8GH25WB5skg5am",
  duration: 5 * 60 * 1000
}));
app.use((req,res,nxt) => {
  if(!(req.session && req.session.userId)) {
    return nxt();
  }
  user.findById(req.session.userId,(err,user) => {
    if(err) {
      return nxt(err);
    }
    if(!user){
      return nxt();
    }

    //set password to undefined so that we don't accidentally use that somewhere
    //best step is to not pull password field from mongodb at all.
    user.password = undefined;

    //we can use req.user object for whatever purpose
    req.user = user;
    //below stmt specific to express.
    //in any template you'll have user var available to you
    res.locals.user = user;
    nxt();
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home',homeRouter);
app.use('/register',registerRouter);

app.get('/logout', function(req,res,next) {
  req.session.reset();
  res.redirect('/');
});

// catch 404 and forward to error handler
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

module.exports = app;
