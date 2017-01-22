require('dotenv').config({ silent: true });

// an example timekeeper bot
var botName = 'timekeeper',
    timekeeper = require('./timekeeper'),
    inTime = '@in',
    outTime = '@out',
    request = require('request');


// watson work configuration; use Bluemix user vars or add values below
// these are provided when you register your appliction
var webhookSecret = 'eb7hq530q476bye5c4ki8d4kkhi4hwdi';
var appId = 'd5277090-e796-4ba5-87d0-1d2674b6426e';
var appSecret = '6sd5b8ircutrt7tikc5iy3es7teeyvho';

function messageCreated(body) {

  console.log("Message created.")

  // message directed to the bot
  if (/@in/gi.test(body.content)) {
    // for example, process a message
    console.log('In')
    timekeeper.handleMessage(body, (err, reply) => {

      if(!err) {

        respond(reply, body.spaceId, (err, res) => {

          // possibly handle result from watsonwork
          request.post('/checkIn', function (error, response, body) {

            if (!error && response.statusCode == 200) {
              console.log(body)
            }
          });

        });

      }

    });

  } else if (/@out/.test(body.content)) {
    timekeeper.handleMessage(body, (err, reply) => {
      if(!err) {
        respond(reply, body.spaceId,
          (err, res) => {
            // possibly handle result from watsonwork
          });
      }
    });
  }
}

// function messageAnnotationAdded(body) {
//   // your code here
//   console.log(`${body.type} ${body.annotationType} ${body.annotationPayload}`);

//   // an example of a focus
//   if(body.annotationType === 'message-focus') {
//     var payload = JSON.parse(body.annotationPayload);

//     if(payload.lens === 'ActionRequest') {
//       timekeeper.handleActionRequest(body, (err, reply) => {

//         if(reply){
//           respond(reply, body.spaceId, (err, res) => {
//             // possibly handle result from watsonwork
//           });
//         }
//       });
//     }
//   }
// }

// dependencies
var express = require('express'),
  http = require('http'),
  path = require('path'),
  crypto = require('crypto'),
  bodyParser = require('body-parser');

var oauth = require('./oauth');

// set up express
var app = express();

// Route Files
var checkIn = require('./routes/checkIn'),
    checkOut = require('./routes/checkOut');

// all environments
app.set('port', 4000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// watson work services middleware
app.use(verifier);
app.use(ignorer);
app.use(webhook);

// Routes
app.use('/checkIn', checkIn);
app.use('/checkOut', checkOut);

initialize();

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
  console.log(botName + ' bot listening on ' + app.get('port'));
});

// Middleware function to handle the Watson Work challenge
function verifier(req, res, next) {
  if(req.body.type === 'verification') {
    console.log('Got Webhook verification challenge ' + req.body);

    var bodyToSend = {
      response: req.body.challenge
    };

    var hashToSend = crypto.createHmac('sha256', webhookSecret)
          .update(JSON.stringify(bodyToSend))
          .digest('hex');

    res.set('X-OUTBOUND-TOKEN', hashToSend);
    res.send(bodyToSend);
  } else {
    next();
  }
}

// Middleware function to ignore messages from this bot
function ignorer(req, res, next){
  // Ignore our own messages
  if (req.body.userId === appId) {
    res.status(201).send().end();
    return;
  } else {
    console.log('Sending body to next middleware ' + JSON.stringify(req.body));
    next();
  }
}

// Middleware function to handle the webhook event
function webhook(req, res, next) {

    console.log("Made it to the webhook!")

    switch(req.body.type) {
      case "message-created":
        messageCreated(req.body);
        console.log("Message created!")
        break;
      case "space-members-added":
        spaceMembersAdded(req.body);
        break;
      case "space-members-removed":
        spaceMembersRemoved(req.body);
        break;
      case "message-annotation-added":
        messageAnnotationAdded(req.body);
        break;
      case "message-annotation-edited":
        messageAnnotationEdited(req.body);
        break;
      case "message-annotation-removed":
        messageAnnotationRemoved(req.body);
        break;
  }

  // you can acknowledge here or later; if later, uncomment next()
  // but you MUST respond or watsonwork will keep sending the message
  res.status(200).send().end();
  // next();
}

var jwtToken = '';
var errors = 0;

// Obtains the JWT token needed to post messages to spaces.
function initialize() {

  console.log(`running initialize ${oauth}`);

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
        console.log("Timed out.");
        return;
      }

      console.log("Initialized JWT token");
      jwtToken = token();
    });
}

/**
 * Posts a message to a space.
 */
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // API to authorize application and generate access token.
// var WWS_OAUTH_URL = "https://api.watsonwork.ibm.com/oauth/token";

// // Build request options for authentication.
// const authenticationOptions = {
//     "method": "POST",
//     "url": WWS_OAUTH_URL,
//     "auth": {
//       "user": appId,
//       "pass": appSecret
//     },
//     "form": {
//       "grant_type": "client_credentials"
//     }
//   };

// if (!appId || !appSecret) {
//   console.log("Please provide the app id and app secret as environment variables.");
//   process.exit(1);
// }

// // Authorize application.
// request(authenticationOptions, function(err, response, body){

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

module.exports = app;
