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

//create a handler for interfacing the 
//game engine with the io's
var talkback = function(data){ 
    //Itext_to_speech.speak(data);
    console.log("reply:"+data);    
}

var IGameMgr = GameMgr.create(bin,talkback,Iconversation);

//uncomment when on RPI hardware :
//Ispeech_to_text.listen(IGameMgr.parse);

//some test data to interface with the game manager
//IGameMgr.parse("Hello");

///------------------------------>
// Interface- Console Demo
// (Replace with real Interfaces)
///------------------------------>
var readline = require('readline'),
rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt( '>> ');
rl.prompt();
rl.on('line', function(line) {

    //some test data to interface with the game manager
    IGameMgr.parse(line);
   
rl.prompt();
}).on('close', function() {
console.log('Have a great day!');
process.exit(0);
});
///------------------------------>