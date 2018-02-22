//=========================================
// System Module:
//
// 
//=========================================
console.log("TJBOT DMGame System v1.0");
console.log("========================");

//Load configuration files and set system file paths
var configfile =__dirname+'/'+'bluemix_config.json';
var bin =__dirname+'/data/';
console.log("Configuration:"+configfile);

//Load Interfaces from IOHandler
console.log("Loading IOHandler...");
/*
var IOHandler = require('./tjbot.IOHandler');
var Iconversation = IOHandler.Iconversation.create(configfile);
var Ispeech_to_text = IOHandler.Ispeech_to_text.create(configfile);
var Itext_to_speech = IOHandler.Itext_to_speech.create(configfile,bin);
var IfileIO = IOHandler.IfileIO.create(configfile);
var ILed = IOHandler.ILed.create();
var IServo = IOHandler.IServo.create();
*/

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

var IGameMgr = GameMgr.create(bin);

//convo ready
//---------------------------------------------------------
var TJBot = require('tjbot');
var config = require('./config');

// obtain our credentials from config.js
var credentials = config.credentials;

// obtain user-specific config
var WORKSPACEID = "f73eeffe-b9e0-4209-be8f-08e2610452dc";
var WORKSPACEID_NLP = "77995ae9-0519-423f-baa4-2ad69df9406e";
// these are the hardware capabilities that TJ needs for this recipe
var hardware = ['microphone', 'speaker','servo','led'];//,'camera'];


var GameEng = require('./tjbot.GameEng');

var IGameEng = GameEng.create(bin);
IGameEng.start();


// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    }
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);

tj.raiseArm();
tj.shine('green');


// listen for utterances with our attentionWord and send the result to
// the Conversation service
tj.listen(function(msg) {
	var turn =msg;
   
	// send to the conversation service
    tj.converse(WORKSPACEID_NLP, turn, function(response) {	
        // speak the result
        console.log(response.description);
    
        var enteredRoom = false;
        var resp = response.description;
        var playdata = "not playable";
        switch(resp){
            
            case "describe" : 
            playdata = IGameEng.roomDesc("room"); 
            
            case "clues" : 
            playdata =IGameEng.roomTips(); break;
            
            case "move east" : 
            playdata = IGameEng.roomNav("east") ; enteredRoom =true;
            break;
            case "move west" : 
            playdata =  IGameEng.roomNav("west") ;enteredRoom =true;
            break;
            case "move north" :
                playdata = IGameEng.roomNav("north") ; 
                enteredRoom =true;
            break;

            case "move south" : 
            playdata = IGameEng.roomNav("south") ; enteredRoom =true;
            break;

            case "see east" : 
            playdata = IGameEng.roomDesc("east") ; break;  

            case "see west" : 
            playdata =  IGameEng.roomDesc("west") ;break;

            case "see north" :
            playdata = IGameEng.roomDesc("north") ; break

            case "see south" : 
            playdata = IGameEng.roomDesc("south") ;  
            break;
            
            default :
            //console.log(resp);
            tj.speak(resp);
        }
                    


        if(playdata!="not playable"){

            /*
            if(IGameEng.room.enter.condition.stat == "visual"){
                tj.speak()
                tj.shine("orange");
                tj.takePhoto(bin + 'picture.jpg').then(function(data) {
                    if (!fs.existsSync(bin + 'picture.jpg')) {
                        throw new Error("expected picture.jpg to have been created");
                    }
                    console.log("picture taken successfully, removing the file");
                    if (fs.existsSync(bin + 'picture.jpg')) {
                        fs.unlink(bin + 'picture.jpg');
                    }
                });
                tj.speak("beep beep boop beeb booob booop beeb. Picture Taken");

                
                imageRecognition(bin, function(data){
                    recog = JSON.stringify(data);                                        
                    console.log(recog);
                    tj.speak("face scanned" + recog);
                
                });

            }*/

            if(enteredRoom){
                var soundname =  bin + IGameEng.room.audio;
                tj.play(soundname);
    
                var actout =  IGameEng.room.actout;
                switch(actout){
                    case "danger" : 
                        tj.shine("red");
                        tj.lowerArm();
                        break;
                    case "happy" :
                        tj.shine("yellow");
                        tj.raiseArm();
                        break;
                    case "normal" :
                        tj.shine("blue");
                        tj.lowerArm();
                        break;
                }
            }

            //remove any metadata
            tj.speak(playdata);
        }
                 
    });

	tj.shine('off');
	tj.lowerArm();
});


function imageRecognition(path,callback){
    var watson = require('watson-developer-cloud');
    var fs = require('fs');
    var visual_recognition = watson.visual_recognition({
      api_key: 'cef3db1dd507aecb89b94e79e59400eb7d65c852',
      version: 'v3',
      version_date: '2016-05-20'
    });
    
    var params = {
      images_file: fs.createReadStream(path + 'picture.jpg')
    };
    
    var resp="";
    visual_recognition.detectFaces(params,function(result){callback(result);});    
}