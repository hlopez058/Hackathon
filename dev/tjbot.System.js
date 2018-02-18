//=========================================
// System Module:
//
// 
//=========================================
console.log("TJBOT DMGame System v1.0");
console.log("========================");

//Load configuration files and set system file paths
var configfile =__dirname+"\\"+'bluemix_config.json';
var bin =__dirname+"\\data\\";
console.log("Configuration:"+configfile);

//Load Interfaces from IOHandler
console.log("Loading IOHandler...");
var IOHandler = require('./tjbot.IOHandler');
var Iconversation = IOHandler.Iconversation.create(configfile);
var Ispeech_to_text = IOHandler.Ispeech_to_text.create(configfile);
var Itext_to_speech = IOHandler.Itext_to_speech.create(configfile);
var IfileIO = IOHandler.IfileIO.create(configfile);
var ILed = IOHandler.ILed.create();
var IServo = IOHandler.IServo.create();
/*
//Run Diagnostics on peripherals
console.log("Running IOHandler Unit Tests...");
var diag_callback = function(data){console.log(data);}
Iconversation.test(diag_callback);
Ispeech_to_text.test(diag_callback);
Itext_to_speech.test(diag_callback);
IfileIO.test(diag_callback);
ILed.test(diag_callback);
IServo.test(diag_callback);
*/
console.log("IOHandler Ready.");


var GameMgr = require('./tjbot.GameMgr');

var talkback = function(data){ 
    //Itext_to_speech.speak(data);

    console.log(data);
}

var IGameMgr = GameMgr.create(bin,talkback,Iconversation);

//uncomment when on RPI hardware :
//Ispeech_to_text.listen(IGameMgr.parse);
IGameMgr.parse("Hello");
