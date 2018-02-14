var iohandler = require('./tjbot.IOHandler');

var configfile =__dirname+"\\"+'bluemix_credentials.json';
var bin =__dirname+"\\data\\";

var listener = iohandler.Ispeech_to_text.create(configfile);

listener.listen(function(data){
    console.log(data);
});


//var filer = iohandler.IfileIO.create(__dirname+"\\data\\");

//var speaker = iohandler.Itext_to_speech.create(configfile,bin)
//speaker.speak("<voice-transformation type='Young' strength='80%'> For example, you can make my voice a bit softer, </express-as>");


//var convo = iohandler.Iconversation.create(__dirname+"\\"+'bluemix_credentials.json');
//convo.selectWID(1);
//convo.write("hello",function(data){console.log("cb:"+data);});

