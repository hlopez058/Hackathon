
var Game = {
    room : null,
    player: null,
    running:true,
    create: function(){
        var obj = Object.create(this);
        obj.running = true; 
        obj.player = require('./models/player').create();
        game.enterRoom("1");        
        return obj;
    },
    enterRoom : function(id){
        //read the rooms.json list of room objects
        var rooms ="";
        var fs = require('fs');
        fs.readFile(path + 'rooms.json', 'utf8', 
        function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            rooms = JSON.parse(data); 
        }});
        this.room = rooms[id];
    }
}


var GameMgr =  {
    game:null,
    talk:null,
    path:null,
    newGameReq:false,
    chatbot:false,
    create: function(path,talkback,chatbot){
        var obj = Object.create(this);
        
        //create a gamestate object
        obj.game= Game.create();
        obj.talk = talkback;
        obj.path =  path ;
        obj.chatbot = chatbot;

        return obj;
    },
    parse:function(data){
        //does the data have a 
        console.log("parsing:" + data);

        if(this.newGameReq){
           if(data.toLowerCase().includes('yes')){
               this.newGame();
            }else{
               this.newGameReq = false; 
            }
            return;
        }
        if(data.toLowerCase().includes('new game')){
            this.newGame();
            return;
        }
        if(data.toLowerCase().includes('pause game')||
        data.toLowerCase().includes('save game')){
            this.pauseGame();
            return;
        }
        if(data.toLowerCase().includes('restart game')){
            this.restartGame();
            return;
        }
        if(data.toLowerCase().includes('load game')||
            data.toLowerCase().includes('resume game')){
            this.loadGame();
            return;
        }
        if(data.toLowerCase().includes('quit game')){
            this.quitGame();
            return;
        }

        //process the input as in-game data request
        //pass it into the game object

        this.game.input(data);
        

        //Let Chatbot handle any other statements
        this.chatbot.write(data,this.talk);
        
    },
    newGame: function(){
        if(this.game.running && this.newGameReq==false){
            this.talk("Are you sure you would like to start a new game?");
            this.newGameReq = true;
            return;
        }

        this.talk("Starting a new game.");  
        this.game = Game.create();
        this.newGameReq = false; 
    },
    pauseGame: function(){
        this.saveGame();
        this.talk("The game has been paused.");
    },
    restartGame: function(){
        this.newGame();
        this.talk("Restarting the game.");
    },
    loadGame: function(){
        var fs = require('fs');
        fs.readFile(this.path + 'gamedata.json', 'utf8', 
        function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); //now it an object
            this.game = obj;
        }});
    },
    quitGame: function(){
        this.game.running = false;
        this.talk("The game has ended.");
    },
    saveGame: function(){
        var gamedata = JSON.stringify(this.game);
        var fs = require('fs');
        fs.writeFile(this.path + 'gamedata.json', gamedata, 'utf8', function(data){
           if(data!=null){ console.log(data)};
        });
    }
}

module.exports = GameMgr;
