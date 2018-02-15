//=========================================
// System Module:
//
// 
//=========================================
console.log("TJBOT DMGame System v1.0");
console.log("========================");

//Load configuration files and set system file paths
var configfile =__dirname+"\\"+'bluemix_credentials.json';
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
console.log("IOHandler Ready.");

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

//load a gamemanager program
//use the game manager to 
//load all teh game data.

//load standby mode program
//process the data that we pull back from the 
//iohandler. this program
/* would be the program tha tstarts up the system
and waits for user input. 
its the launch point for the game




//var filer = IOHandler.IfileIO.create(__dirname+"\\data\\");
//var speaker = IOHandler.Itext_to_speech.create(configfile,bin)
//speaker.speak("<voice-transformation type='Young' strength='80%'> For example, you can make my voice a bit softer, </express-as>");
//var convo = IOHandler.Iconversation.create(__dirname+"\\"+'bluemix_credentials.json');
//convo.selectWID(1);
//convo.write("hello",function(data){console.log("cb:"+data);});

