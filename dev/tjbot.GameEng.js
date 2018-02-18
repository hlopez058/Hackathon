//Load Game Script
//Move this to GameMgr.js
//
var fs = require('fs');
var script = JSON.parse(fs.readFileSync(__dirname+"\\data\\script.json",'utf8'));

var Iplayer = require('./models/player');

var player = Iplayer.create("bob");

//------------------------------
// Game Engine Processor
//------------------------------
// Entry point for decision trees
var processor = function(data){
    //Use chatbot to process inputs
    //get resut of chat bot to run functions
    // var response = ChatBot(data)    
    if(script[data]==undefined){
        console.log("I do not understand that yet.");
    }else{
        console.log(script[data]);
    }
}

///------------------------------>
// Interface- Console Demo
// (Replace with real Interfaces)
///------------------------------>
var readline = require('readline'),
rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('>> ');
rl.prompt();
rl.on('line', function(line) {
switch(line.trim()) {
    case 'hello':
        console.log('hello lets play');
        break;
    default:
        processor(line);
    break;
}
rl.prompt();
}).on('close', function() {
console.log('Have a great day!');
process.exit(0);
});
///------------------------------>
