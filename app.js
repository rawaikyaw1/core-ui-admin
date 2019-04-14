require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin/admin');
var adminUserRouter = require('./routes/admin/adminUser');
var typeRouter = require('./routes/admin/type');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var session = require('express-session');
var models = require('./models');

var app = express();

app.use(session({
  secret: 'secret-session',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.warning = req.flash("warning");
  res.locals.info = req.flash("info");
  res.locals.danger = req.flash("danger");
  res.locals.formData = req.flash("formData");
  res.locals.user = (req.user) ? req.user : null;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/admin/users', adminUserRouter);
app.use('/admin/type', typeRouter);

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

//passport auth configuration
passport.use(new LocalStrategy({
  usernameField : 'email',
  passwordField: 'password'
},
  function(email, password, done) {
    console.log('Cehcking login....');
    models.User.findOne({
      where: {email:email}
    })
    .then(
      function(result){
        
        if(!result){
          return done(null, false, {
            message: 'Credential does not match.'
          })
        }
        // console.log(result);
        let yes = bcrypt.compareSync(password, result.password);
  
        if(yes){
          console.log('true user');
          return done(null, result);
        }else{
          console.log('false user');
          return done(null, false, {
            message: 'Credential does not match.'
          })
        }
      }
    )
  }
));

passport.serializeUser(function(user, done){
  done(null , user.id);
});

passport.deserializeUser(function(id, done){
  // console.log('user info success');
  models.User.findOne({where:{id:id}}).then(function(result){
    if(!result){
      return done(null, false);
    }
    return done(null, result);
  })
  .catch(function(err){
    if(err){
      return done(err);
    }
  })

});

module.exports = app;
