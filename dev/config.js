/*
User-specific configuration
    ** IMPORTANT NOTE ********************
    * Please ensure you do not interchange your username and password.
    * Hint: Your username is the lengthy value ~ 36 digits including a hyphen
    * Hint: Your password is the smaller value ~ 12 characters
*/ 
var conf_file =__dirname+'/'+'bluemix_config.json';

var fs = require('fs');  
var tts = 
	JSON.parse(fs.readFileSync(conf_file,'utf8'))
		.text_to_speech[0];   
var stt = 
		JSON.parse(fs.readFileSync(conf_file,'utf8'))
			.speech_to_text[0];   
  
var conv = 
	JSON.parse(fs.readFileSync(conf_file,'utf8'))
	.conversation[0];   

				
exports.conversationWorkspaceId = conv.conversationWorkspaceId; // replace with the workspace identifier of your conversation

// Create the credentials object for export
exports.credentials = {};

// Watson Conversation
// https://www.ibm.com/watson/developercloud/conversation.html
exports.credentials.conversation = {
	password: conv.credentials.password,
	username: conv.credentials.username
};

// Watson Speech to Text
// https://www.ibm.com/watson/developercloud/speech-to-text.html
exports.credentials.speech_to_text = {
	password: stt.credentials.password,
	username: stt.credentials.username
};

// Watson Text to Speech
// https://www.ibm.com/watson/developercloud/text-to-speech.html
exports.credentials.text_to_speech = {
	password: tts.credentials.password,
	username: tts.credentials.username
};

// Watson Text to Speech
// https://www.ibm.com/watson/developercloud/text-to-speech.html
exports.credentials.visual_recognition = {
	apikey: cef3db1dd507aecb89b94e79e59400eb7d65c852
};
