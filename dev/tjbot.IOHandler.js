//------------------------------
// IO Handler
//------------------------------
/*var rpio = require('rpio');
var watson = require('watson-developer-cloud');
var exec = require('child_process').execSync;

//IBM BlueMix Authentication 
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('bluemix_credentials.json','utf8'));

//IBM Watson - Visual Recognition Service
var visual_recognition = new watson.VisualRecognitionV1({
  username: config.visual_recognition.username,
  password: config.visual_recognition.password,
    version_date: '2017-05-26'
});
//TODO : Visual Recognition Interface

//LED RGB 
var Iled ={
    state:null,
    create: function(state){
        obj = Object.create(this);
        this.state = state;
    },
    init : function(LIGHT_PIN){
        rpio.open(LIGHT_PIN,rpio.OUTPUT,rpio.LOW);
    
    },
    reset:function(){
        process.on('SIGINT', function () {
            this.init();
            process.nextTick(function () { process.exit(0); });
        });
    }
    //..
}
exports.Iled = Iled;

*/


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
            //callback(str);
            console.log(str);
        });
        
        textStream.on('error', function(err) {
          
            callback(str);
        });
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
        var fs = require('fs');
        this.text_to_speech
            .synthesize(params)
            .pipe(fs.createWriteStream(this.binpath+"\\"+'output.wav'))
            .on('close', function(){
                /*var create_audio = exec('aplay output.wav', 
                    function(error, stdout, stderr) {
                        if (error !== null) {
                            console.log('Error occurred while playing back: ' + error);
                    }});*/
                console.log("Audio not supported : run output.wav file manually")
            });    
    },
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
    }
}
exports.Iconversation = Iconversation;

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
    //...
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
