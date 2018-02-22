var configfile =__dirname+"\\"+'bluemix_config.json';

console.log("Configuration:"+configfile);
console.log("hello world");


var fs = require('fs');

//Load Interfaces from IOHandler
console.log("Loading IOHandler...");
var IOHandler = require('./tjbot.IOHandler');

var Iconversation = IOHandler.Iconversation.create(configfile);

Iconversation.selectWID("8aa183e7-6839-45b9-bfa3-a09f0bef18d2");

Iconversation.write("lights on",
                        function(data){
                            console.log("reply:" + data);
                        });

