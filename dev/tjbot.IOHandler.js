//------------------------------
// IO Handler
//------------------------------

var rpio = require('rpio'),
var watson = require('watson-developer-cloud'),
var exec = require('child_process').execSync,

//IBM BlueMix Authentication 
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('bluemix_auth.json','utf8'));

//IBM Watson - Speech to Text Service
var Ispeech_to_text = {
    speech_to_text:null,
    buffer:null,
    create: function(workspaceid){
        obj = Object.create(this);
        var speech_to_text = new watson.SpeechToTextV1 ({
        username: config.speech_to_text.username,
        password: config.speech_to_text.password
        });
        this.speech_to_text = _speech_to_text;
        this.buffer = [];
    },
    init: function(){
        // Initiate Microphone Instance to Get audio samples
        var mic = require('mic');
        var micInstance = mic(
            { 'rate': '44100', 'channels': '2', 'debug': false, 'exitOnSilence': 6 });
        var micInputStream = micInstance.getAudioStream();
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
        var textStream = micInputStream.pipe(
            this.speech_to_text.createRecognizeStream({
        content_type: 'audio/l16; rate=44100; channels=2',
        model: 'en-US_BroadbandModel'})
        );
        textStream.setEncoding('utf8');
        textStream.on('data', function(str) {
            this.buffer.push(str);
        });
        textStream.on('error', function(err) {
            console.log(err) ;
        });
    },
    read: function(){
       return this.buffer.last();    
    },
    //...
}
modules.export = Ispeech_to_text;



//IBM Watson - Text to Speech Service
var Itext_to_speech = {
    text_to_speech:null,
    create: function(workspaceid){
        obj = Object.create(this);
        var text_to_speech = new watson.TextToSpeechV1 ({
        username: config.text_to_speech.username,
        password: config.text_to_speech.password
        });
        this.text_to_speech = _text_to_speech;
    },
    speak: function(msg){
        var params = {
           text: text,
           voice: this.config.TextToSpeech.voice,
           accept: 'audio/wav'
           };

        /* Streaming the resulting audio to file and play the file using aplay */
        this.text_to_speech.synthesize(params).pipe(fs.createWriteStream('output.wav'))
        .on('close', function(){
            var create_audio = exec('aplay output.wav', function(error, stdout, stderr) {
            if (error !== null) {
                console.log('Error occurred while playing back: ' + error);
            }});
        });    
    },
    //...
}
modules.export = Itext_to_speech;

//IBM Watson - Visual Recognition Service
var visual_recognition = new watson.VisualRecognitionV1({
  username: config.visual_recognition.username,
  password: config.visual_recognition.password,
    version_date: '2017-05-26'
});
//TODO : Visual Recognition Interface

//IBM Watson - Conversation Service
var Iconversation = {
    conversation:null,
    buffer:null,
    create: function(workspaceid){
        obj = Object.create(this);
        var _conversation = new watson.ConversationV1({
            username: config.conversation.username,
            password: config.conversation.password,
            version_date: '2017-05-26',
            workspace_id: config.conversation.workspaceid
        });
        this.conversation = _conversation;
        this.buffer = [];
    },
    write: function(msg){
       conversation.message({input: {'text': msg}},  
       function(err, response) {
            if (err)
                console.log('error:', err);
            else
                this.buffer.push(response.output.text); 
        });
    },
    read: function(){
       return this.buffer.last();    
    },
    //...
}
modules.export = Iconversation;


//Local File IO 
var Ifileio = {
    path:null,
    create: function(path){
        obj = Object.create(this);
        this.path = path;
    },
    readlines: function(filename){
       //read in file     
    },
    //...
}
modules.export = Ifileio;

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

//TODO : Interface for Servo
