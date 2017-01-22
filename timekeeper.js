'use strict';

var botName = 'timekeeper',
    botMessageText = `Would anyone like to do '%s'? Type @${botName} %d.`,
    actionConfidence = .8,	// i.e. 80% confident it's an action
    todoId = 0,
    todos = new Map(),
    inTime = "@in",
    outTime = "@out";

module.exports.handleMessage = function(body, callback) {
  var inCommand = body.content.substring(inTime),
      outCommand = body.content.substring(outTime);

  // if the command is just a number, someone is accepting a todo
  if(/@in/.test(inCommand)) {

    callback(null, `Hi, ${body.userName}! Lemme just check you in here...`);
    
  } else if (/@out/.test(outCommand)) {

    callback(null, `Timing you out now, ${body.userName}! See ya later! :)`);

  } else {
    // Otherwise, the bot doesn't know the command
    callback(null, `Hmm. I don't know that command. Could you ask it a different way?`);
  }
}

module.exports.handleActionRequest = function(body, callback) {
  var payload = JSON.parse(body.annotationPayload);

  // need to ignore messages from the bot like replies to the user
  if(payload.phrase.indexOf(`${botName}`) == -1) {
    console.log(`New message ${body.messageId} being processed`);

    if(payload.confidence >= actionConfidence) {
      var message = botMessageText.replace('%s', payload.phrase).replace('%d', todoId);

      // store the phrase (i.e. the todo) with an internal ID
      // this ID later used to associate user with a specific todo
      todos.set(todoId, payload.phrase);
      todoId++;	// increment the todo counter

      callback(null, message);

    } else {
      console.log(`Skipping ${body.messageId}; confidence was below ${actionConfidence}`);
    }
  } else {
    console.log(`Already processed todo for message ${body.messageId}`);
  }
}
