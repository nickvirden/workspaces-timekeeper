require('dotenv').config({ silent: true });

// Requirements
var express = require('express'),
  path = require('path'),
  // favicon = require('serve-favicon'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  jwt = require('jwt-express'),
  request = require('request');

// Route Files
var routes = require('./routes/index'),
    timekeeper = require('./routes/timekeeper');

// Express App
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

// Routes
app.use('/', routes);
app.use('/timekeeper', timekeeper);

var WWS_OAUTH_URL = "https://api.watsonwork.ibm.com/oauth/token", // API to authorize application and generate access token.
  APP_ID = process.env.APP_ID, // App ID retrieved from registration process.
  APP_SECRET = process.env.APP_SECRET, // App secret retrieved from registration process.
  authenticationOptions = { // Build request options for authentication.
    "method": "POST",
    "url": WWS_OAUTH_URL,
    "auth": {
      "user": APP_ID,
      "pass": APP_SECRET
    },
    "form": {
      "grant_type": "client_credentials"
    }
  };

if (!APP_ID || !APP_SECRET) {
  console.log("Please provide the app id and app secret as environment variables.");
  process.exit(1);
}

// Authorize application.
request(authenticationOptions, function(err, response, body) {

  // If successful authentication, a 200 response code is returned
  if(response.statusCode == 200){
    console.log ("Authentication successful\n");
    console.log ("App Id: " + authenticationOptions.auth.user);
    console.log ("App Secret: " + authenticationOptions.auth.pass + "\n");
    console.log ("access_token:\n\n" + JSON.parse(body).access_token + "\n");
    console.log ("token_type: " + JSON.parse(body).token_type);
    console.log ("expires_in: " + JSON.parse(body).expires_in);
    console.log ("\n");
  } else {
    console.log("Error authenticating with\nApp: " + authenticationOptions.auth.user + "\nSecret: " + authenticationOptions.auth.pass + "\n\n");
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handlers

// Development - Prints stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production - Won't print stacktrace
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var hostname = '0.0.0.0', // 'localhost' if not virtualized
    port = process.env.PORT || 4000;

app.listen(port, hostname, function() {
    
    console.log('Server running at http://' + hostname + ':' + port + '/');

});


module.exports = app;