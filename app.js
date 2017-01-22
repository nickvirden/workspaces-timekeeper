require('dotenv').config({ silent: true });

// Requirements
var express = require('express'),
  path = require('path'),
  // favicon = require('serve-favicon'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  jwt = require('jwt-express'),
  crypto = require('crypto'),
  request = require('request');

// Route Files
var checkIn = require('./routes/checkIn'),
    checkOut = require('./routes/checkOut');

// Express App
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/checkIn', checkIn);
app.use('/checkOut', checkOut);

// var WWS_OAUTH_URL = "https://api.watsonwork.ibm.com/oauth/token", // API to authorize application and generate access token.
//   APP_ID = process.env.APP_ID, // App ID retrieved from registration process.
//   APP_SECRET = process.env.APP_SECRET, // App secret retrieved from registration process.
//   authenticationOptions = { // Build request options for authentication.
//     "method": "POST",
//     "url": WWS_OAUTH_URL,
//     "auth": {
//       "user": APP_ID,
//       "pass": APP_SECRET
//     },
//     "form": {
//       "grant_type": "client_credentials"
//     }
//   };

// if (!APP_ID || !APP_SECRET) {
//   console.log("Please provide the app id and app secret as environment variables.");
//   process.exit(1);
// }

var trelloCalls= "";

var success = function(successMsg) {
  asyncOutput(successMsg);
};

var error = function(errorMsg) {
  asyncOutput('error ' + errorMsg);
}

var newCard = {
  name: 'new card', // this will be changed to the users input eventually
};

// Trello.post('/cards/', newCard, success, error);

/**
 * Middleware function to handle the Watson Work challenge
 */
function verifier(req, res, next) {
  if(req.body.type === 'verification') {
    console.log('Got Webhook verification challenge ' + req.body);

    var bodyToSend = {
      response: req.body.challenge
    };

    var hashToSend = crypto.createHmac('sha256', WEBHOOK_SECRET)
          .update(JSON.stringify(bodyToSend))
          .digest('hex');

    res.set('X-OUTBOUND-TOKEN', hashToSend);
    res.send(bodyToSend);
  } else {
		next();
	}
}

var jwtToken = '';
var errors = 0;

/**
 * Obtains the JWT token needed to post messages to spaces.
 */
function initialize() {
	oauth.run(
		appId,
		appSecret,
		(err, token) => {
			if(err) {
				console.error(`Failed to get JWT token - attempt ${errors}`);
				errors++;
				if(errors > 10) {
					console.error(`Too many JWT token attempts; giving up`);
					return;
				}
				setTimeout(initialize, 10000);
				return;
			}

			console.log("Initialized JWT token");
			jwtToken = token();
		});
}


function respond(text, spaceId, callback) {
	var url = `https://api.watsonwork.ibm.com/v1/spaces/${spaceId}/messages`;
	var body = {
		headers: {
			Authorization: `Bearer ${jwtToken}`
		},
		json: true,
		body: {
			type: 'appMessage',
			version: 1.0,
			annotations: [{
					type: 'generic',
					version: 1.0,
					color: '#6CB7FB',
					text: text,
			}]
		}
	};

	console.log('Responding to ' + url + ' with ' + JSON.stringify(body));

	request.post(url, body, (err, res) => {
		if (err || res.statusCode !== 201) {
			console.error(`Error sending message to ${spaceId} ${err}`);
			callback(err);
			return;
		}
		callback(null, res.body);
	});
}


// Authorize application.
// request(authenticationOptions, function(err, response, body) {

//   // If successful authentication, a 200 response code is returned
//   if(response.statusCode == 200){
//     console.log ("Authentication successful\n");
//     console.log ("App Id: " + authenticationOptions.auth.user);
//     console.log ("App Secret: " + authenticationOptions.auth.pass + "\n");
//     console.log ("access_token:\n\n" + JSON.parse(body).access_token + "\n");
//     console.log ("token_type: " + JSON.parse(body).token_type);
//     console.log ("expires_in: " + JSON.parse(body).expires_in);
//     console.log ("\n");
//   } else {
//     console.log("Error authenticating with\nApp: " + authenticationOptions.auth.user + "\nSecret: " + authenticationOptions.auth.pass + "\n\n");
//   }
// });

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
    res.render({
      message: err.message,
      error: err.status
    });
  });
}

// Production - Won't print stacktrace
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

// var hostname = '0.0.0.0', // 'localhost' if not virtualized
var hostname = 'localhost',
    port = 4000;

app.listen(port, hostname, function() {

    console.log('Server running at http://' + hostname + ':' + port + '/');

});

module.exports = app;
