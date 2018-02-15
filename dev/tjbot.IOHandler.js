//------------------------------
// IO Handler
//==============================
/*

TODO: 
1. Create a Visual REconition Service Interface
2. Troubleshoot Speech-text service 
3. implement all services with RPI hardware
4. Unit tests to verify iohandler is still working with drivers
5. Unit test for npm packages 

//IBM Watson - Visual Recognition Service
var visual_recognition = new watson.VisualRecognitionV1({
  username: config.visual_recognition.username,
  password: config.visual_recognition.password,
    version_date: '2017-05-26'
})

*/

//----------------------------------------------
// WATSON API'S
//----------------------------------------------
//IBM Watson - Speech to Text Service
var Ispeech_to_text = {
    speech_to_text:null,
    create: function(conf_file){
        var obj = Object.create(this);
        var watson = require('watson-developer-cloud');                    
        var fs = require('fs');
        obj.config = 
            JSON.parse(fs.readFileSync(conf_file,'utf8'))
                .speech_to_text[0];
        obj.speech_to_text = new watson.SpeechToTextV1 ({
            username: obj.config.credentials.username,
            password: obj.config.credentials.password
        });
        return obj;
    },
    listen: function(callback){
        // Initiate Microphone Instance to Get audio samples
        var mic = require('mic');
        var micInstance = mic(
            { 
                'rate': '44100', 
                'channels': '2', 
                'debug': false, 
                'exitOnSilence': 6 
            });
        
        var micInputStream = 
        micInstance.getAudioStream();
        
        micInputStream.on('data', function(data) {
            console.log("Recieved Input Stream: " + data.length);
        });
        
        micInputStream.on('error', function(err) {
            console.log("Error in Input Stream: " + err);
        });
        
        micInputStream.on('silence', function() {
            // detect silence.
        });

        micInstance.start();
        
        //Create textstreamer for microphone
        var textStream = 
        micInputStream.pipe(
            this.speech_to_text
            .createRecognizeStream(
                {
                    content_type: 'audio/l16; rate=44100; channels=2',
                    model: 'en-US_BroadbandModel'
                }));
        textStream.setEncoding('utf8');
        
        textStream.on('data', function(str) {
            callback(str);
            //console.log(str);
        });
        
        textStream.on('error', function(err) {
            callback(str);
        });
    },
    test:function(callback){
        //TODO : Create a Unit Test
        callback("Speech-To-Text Unit Test: Not Implemented");  
    }
}
exports.Ispeech_to_text = Ispeech_to_text;

//IBM Watson - Text to Speech Service
var Itext_to_speech = {
    text_to_speech:null,
    config:null,
    create: function(conf_file,binpath){
        var obj = Object.create(this);
        var watson = require('watson-developer-cloud');            
        var fs = require('fs');  
        obj.config = 
            JSON.parse(fs.readFileSync(conf_file,'utf8'))
                .text_to_speech[0];   
        obj.text_to_speech = 
            new watson.TextToSpeechV1 ({
            username: obj.config.credentials.username,
            password: obj.config.credentials.password
        });
        obj.binpath = binpath;
        return obj;
    },
    setvoice: function(voice){
       this.voice = this.config.voices[voice];
    },
    speak: function(msg){
        //adjust parameters
        var params = {
           text: msg,
           voice: this.voice,
           accept: 'audio/wav'
           };
        
        // Streaming the resulting audio to file and play the file using aplay 
        var exec = require('child_process').execSync;        
        var fs = require('fs');
        this.text_to_speech
            .synthesize(params)
            .pipe(fs.createWriteStream(this.binpath+"\\"+'output.wav'))
            .on('close', function(){
                var create_audio = exec('aplay output.wav', 
                    function(error, stdout, stderr) {
                        if (error !== null) {
                            console.log('Error occurred while playing back: ' + error);
                    }});
                console.log("Audio not supported : run output.wav file manually")
            });    
    },
    test:function(callback){
        //TODO : Create a Unit Test
        callback("Text-To-Speech Unit Test: Not Implemented");  
    }
}
exports.Itext_to_speech = Itext_to_speech;

//IBM Watson - Conversation Service
var Iconversation = {
    workspace_id:null,
    conversation:null,
    config:null,
    create: function(conf_file){
        var obj = Object.create(this);
        var watson = require('watson-developer-cloud');                    
        var fs = require('fs');
        obj.config = 
            JSON.parse(fs.readFileSync(conf_file,'utf8'))
                .conversation[0];
        obj.conversation = new watson.ConversationV1({
            username: obj.config.credentials.username,
            password: obj.config.credentials.password,
            version_date: '2017-05-26'
        });
        obj.workspace_id=obj.config.workspaceid;
        return obj;
    },
    selectWID:function(id){
        this.workspace_id=this.config.workspaceids[id];
    },
    write: function(msg,callback){
       this.conversation.message(
           {workspace_id:this.workspace_id,input: {'text': msg}},  
       function(err, response) {
            if (err)
                console.log('error:', err);
            else
                callback(response.output.text); 
        });
    },
    test:function(callback){
        this.conversation.message(
            {
                workspace_id:this.workspace_id,
                input: {'text': "Hello"}
            },  
        function(err, response) {
             if (err)
                callback("Conversation Unit Test: FAIL"); 
             else
                 callback("Conversation Unit Test: PASS"); 
         });  
    }
}
exports.Iconversation = Iconversation;


//----------------------------------------------
// FILE MANAGER
//----------------------------------------------
//Local File IO 
var IfileIO = {
    path:null,
    create: function(path){
        var obj = Object.create(this);
        obj.path = path;
        return obj;
    },
    readAsync: function(file){
        var fs = require('fs');
        fs.readFile(this.path + file, function(err, data) {
            var array = data.toString().split("\n");
            for(i in array) {
                console.log(array[i]);
            }
        });
    },
    read:function(file){
        var fs = require('fs');
        var array = fs.readFileSync(this.path+file).toString().split("\n");
        for(i in array) {
            console.log(array[i]);
        }
    },
    test:function(callback){
        //TODO : Create a Unit Test
        callback("FileIO Unit Test: Not Implemented");  
    }
}
exports.IfileIO = IfileIO;

//Test Interface 
var Itest = {
    state:null,
    msg:null,
    create: function(state){
        var obj = Object.create(this);
        obj.state = state;
        obj.msg = state;
        return obj;
    },
    init : function(msg){
        this.msg=msg;
    },
    read:function(){
        return "Hello World; " + this.msg;
    }
}
exports.Itest = Itest;

//----------------------------------------------
// HARDWARE PERIPHERALS
//----------------------------------------------
//Servo Interface 
var IServo = {
    state:null,
    msg:null,
    create: function(state){
        var obj = Object.create(this);
        obj.state = state;
        obj.msg = state;
        return obj;
    },
    init : function(msg){
        this.msg=msg;
    },
    read:function(){
        return "Hello World; " + this.msg;
    },
    test:function(callback){
        //TODO : Create a Unit Test
        callback("Servo Unit Test: Not Implemented");  
    }
}
exports.IServo = IServo;

//LED Interface 
var ILed = {
    state:null,
    msg:null,
    create: function(state){
        var obj = Object.create(this);
        obj.state = state;
        obj.msg = state;
        return obj;
    },
    init : function(LIGHT_PIN){
        var rpio = require('rpio');
        rpio.open(LIGHT_PIN,rpio.OUTPUT,rpio.LOW);
    },
    reset:function(){
        process.on('SIGINT', function () {
            this.init();
            process.nextTick(function () { process.exit(0); });
        });
    },
    test:function(callback){
        //TODO : Create a Unit Test
        callback("LED Unit Test: Not Implemented");  
    }
}
exports.ILed = ILed;

