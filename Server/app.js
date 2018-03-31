<<<<<<< HEAD

=======
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var bodyParser = require('body-parser');
var helmet = require('helmet');
<<<<<<< HEAD
var passport = require('passport');

//config file
var config = require('./api/config/config');
//router
var router = require('./api/routes/index');
=======
var expressSession = require('express-session');
var passport = require('passport');
var cors = require('cors');


//config file
var config = require('./api/config/config');

// mongoose Database connection
require('./api/config/DBConnection');

//router

>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337

//express app
var app = express();
app.set(config.SECRET);

<<<<<<< HEAD
//middleware
=======
// Disabling etag for testing
// @author: Wessam
app.disable('etag');

//middleware
app.use(cors());
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
<<<<<<< HEAD

//router
app.use('/api', router);


// mongoose Database connection
require('./api/config/DBConnection');


=======
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./api/passport/init');
initPassport(passport);

//router
var router = require('./api/routes/index')(passport);
app.use('/api', router);
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
// 500 internal server error handler
app.use(function (err, req, res, next) {
  if (err.statusCode === 404) {
    return next();
  }
  res.status(500).json({
    // Never leak the stack trace of the err if running in production mode
    data: null,
    err: config.ENV === 'prod' ? null : err,
    msg: '500 Internal Server Error'
  });
});

// 404 error handler
app.use(function (req, res) {
  res.status(404).json({
    data: null,
    err: null,
    msg: '404 Not Found'
  });
});

module.exports = app;
